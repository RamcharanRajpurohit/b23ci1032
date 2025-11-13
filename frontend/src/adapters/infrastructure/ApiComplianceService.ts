import axios from 'axios';
import { IComplianceService } from '../../core/ports/IComplianceService';
import { ShipCompliance } from '../../core/domain/Compliance';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class ApiComplianceService implements IComplianceService {
  async getComplianceBalance(shipId: string, year: number): Promise<ShipCompliance> {
    const response = await axios.get(`${API_URL}/compliance/cb`, {
      params: { shipId, year },
    });
    return response.data;
  }

  async getAdjustedCB(shipId: string, year: number): Promise<ShipCompliance> {
    const response = await axios.get(`${API_URL}/compliance/adjusted-cb`, {
      params: { shipId, year },
    });
    return response.data;
  }
}
