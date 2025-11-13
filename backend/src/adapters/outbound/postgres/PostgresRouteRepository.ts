import { Pool } from 'pg';
import { IRouteRepository } from '../../../core/ports/IRouteRepository';
import { Route } from '../../../core/domain/Route';

export class PostgresRouteRepository implements IRouteRepository {
  constructor(private pool: Pool) {}

  async findAll(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]> {
    let query = 'SELECT * FROM routes WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.vesselType) {
      query += ` AND vessel_type = $${paramIndex++}`;
      params.push(filters.vesselType);
    }
    if (filters?.fuelType) {
      query += ` AND fuel_type = $${paramIndex++}`;
      params.push(filters.fuelType);
    }
    if (filters?.year) {
      query += ` AND year = $${paramIndex++}`;
      params.push(filters.year);
    }

    const result = await this.pool.query(query, params);
    return result.rows.map(this.mapToRoute);
  }

  async findById(id: number): Promise<Route | null> {
    const result = await this.pool.query('SELECT * FROM routes WHERE id = $1', [id]);
    return result.rows[0] ? this.mapToRoute(result.rows[0]) : null;
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const result = await this.pool.query('SELECT * FROM routes WHERE route_id = $1', [routeId]);
    return result.rows[0] ? this.mapToRoute(result.rows[0]) : null;
  }

  async setBaseline(id: number): Promise<void> {
    await this.pool.query('UPDATE routes SET is_baseline = false');
    await this.pool.query('UPDATE routes SET is_baseline = true WHERE id = $1', [id]);
  }

  async getBaseline(): Promise<Route | null> {
    const result = await this.pool.query('SELECT * FROM routes WHERE is_baseline = true LIMIT 1');
    return result.rows[0] ? this.mapToRoute(result.rows[0]) : null;
  }

  private mapToRoute(row: any): Route {
    return {
      id: row.id,
      routeId: row.route_id,
      vesselType: row.vessel_type,
      fuelType: row.fuel_type,
      year: row.year,
      ghgIntensity: parseFloat(row.ghg_intensity),
      fuelConsumption: parseFloat(row.fuel_consumption),
      distance: parseFloat(row.distance),
      totalEmissions: parseFloat(row.total_emissions),
      isBaseline: row.is_baseline
    };
  }
}
