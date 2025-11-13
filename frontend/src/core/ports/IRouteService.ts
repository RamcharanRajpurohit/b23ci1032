import { Route, ComparisonResult } from '../domain/Route';

export interface IRouteService {
  getAllRoutes(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]>;
  setBaseline(id: number): Promise<void>;
  getComparison(): Promise<ComparisonResult[]>;
}
