import { ShipCompliance } from '../domain/Compliance';

export interface IComplianceService {
  getComplianceBalance(shipId: string, year: number): Promise<ShipCompliance>;
  getAdjustedCB(shipId: string, year: number): Promise<ShipCompliance>;
}
