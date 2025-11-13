import { Route } from '../domain/Route';

export interface IRouteRepository {
  findAll(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]>;
  findById(id: number): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  setBaseline(id: number): Promise<void>;
  getBaseline(): Promise<Route | null>;
}
