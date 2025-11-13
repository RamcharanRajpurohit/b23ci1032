import { Pool } from 'pg';
import { IComplianceRepository } from '../../../core/ports/IComplianceRepository';
import { ShipCompliance, BankEntry, Pool as PoolDomain, PoolMember } from '../../../core/domain/Compliance';

export class PostgresComplianceRepository implements IComplianceRepository {
  constructor(private pool: Pool) {}

  async saveCompliance(compliance: ShipCompliance): Promise<ShipCompliance> {
    const result = await this.pool.query(
      `INSERT INTO ship_compliance (ship_id, year, cb_gco2eq, target_intensity, actual_intensity, energy_in_scope)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (ship_id, year) DO UPDATE SET cb_gco2eq = $3
       RETURNING *`,
      [compliance.shipId, compliance.year, compliance.cbGco2eq, compliance.targetIntensity, compliance.actualIntensity, compliance.energyInScope]
    );
    return { ...compliance, id: result.rows[0].id };
  }

  async getCompliance(shipId: string, year: number): Promise<ShipCompliance | null> {
    const result = await this.pool.query(
      'SELECT * FROM ship_compliance WHERE ship_id = $1 AND year = $2',
      [shipId, year]
    );
    return result.rows[0] ? this.mapToCompliance(result.rows[0]) : null;
  }

  async saveBankEntry(entry: BankEntry): Promise<BankEntry> {
    const result = await this.pool.query(
      `INSERT INTO bank_entries (ship_id, year, amount_gco2eq, applied_amount, remaining_amount)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [entry.shipId, entry.year, entry.amountGco2eq, entry.appliedAmount, entry.remainingAmount]
    );
    return { ...entry, id: result.rows[0].id };
  }

  async getBankEntries(shipId: string, year: number): Promise<BankEntry[]> {
    const result = await this.pool.query(
      'SELECT * FROM bank_entries WHERE ship_id = $1 AND year <= $2 AND remaining_amount > 0',
      [shipId, year]
    );
    return result.rows.map(this.mapToBankEntry);
  }

  async updateBankEntry(id: number, appliedAmount: number): Promise<void> {
    await this.pool.query(
      `UPDATE bank_entries SET applied_amount = $1, remaining_amount = amount_gco2eq - $1 WHERE id = $2`,
      [appliedAmount, id]
    );
  }

  async createPool(poolData: PoolDomain): Promise<PoolDomain> {
    const result = await this.pool.query(
      'INSERT INTO pools (year, created_at) VALUES ($1, $2) RETURNING *',
      [poolData.year, poolData.createdAt]
    );
    return { id: result.rows[0].id, year: result.rows[0].year, createdAt: result.rows[0].created_at };
  }

  async addPoolMembers(members: PoolMember[]): Promise<void> {
    for (const member of members) {
      await this.pool.query(
        'INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after) VALUES ($1, $2, $3, $4)',
        [member.poolId, member.shipId, member.cbBefore, member.cbAfter]
      );
    }
  }

  async getPoolMembers(poolId: number): Promise<PoolMember[]> {
    const result = await this.pool.query('SELECT * FROM pool_members WHERE pool_id = $1', [poolId]);
    return result.rows.map(row => ({
      poolId: row.pool_id,
      shipId: row.ship_id,
      cbBefore: parseFloat(row.cb_before),
      cbAfter: parseFloat(row.cb_after)
    }));
  }

  private mapToCompliance(row: any): ShipCompliance {
    return {
      id: row.id,
      shipId: row.ship_id,
      year: row.year,
      cbGco2eq: parseFloat(row.cb_gco2eq),
      targetIntensity: parseFloat(row.target_intensity),
      actualIntensity: parseFloat(row.actual_intensity),
      energyInScope: parseFloat(row.energy_in_scope)
    };
  }

  private mapToBankEntry(row: any): BankEntry {
    return {
      id: row.id,
      shipId: row.ship_id,
      year: row.year,
      amountGco2eq: parseFloat(row.amount_gco2eq),
      appliedAmount: parseFloat(row.applied_amount),
      remainingAmount: parseFloat(row.remaining_amount)
    };
  }
}
