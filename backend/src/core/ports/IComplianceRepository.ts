import { ShipCompliance, BankEntry, Pool, PoolMember } from '../domain/Compliance';

export interface IComplianceRepository {
  saveCompliance(compliance: ShipCompliance): Promise<ShipCompliance>;
  getCompliance(shipId: string, year: number): Promise<ShipCompliance | null>;
  
  saveBankEntry(entry: BankEntry): Promise<BankEntry>;
  getBankEntries(shipId: string, year: number): Promise<BankEntry[]>;
  updateBankEntry(id: number, appliedAmount: number): Promise<void>;
  
  createPool(pool: Pool): Promise<Pool>;
  addPoolMembers(members: PoolMember[]): Promise<void>;
  getPoolMembers(poolId: number): Promise<PoolMember[]>;
}
