import axios from 'axios';
import { IRouteService } from '../../core/ports/IRouteService';
import { Route, ComparisonResult } from '../../core/domain/Route';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class ApiRouteService implements IRouteService {
  async getAllRoutes(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]> {
    const response = await axios.get(`${API_URL}/routes`, { params: filters });
    return response.data;
  }

  async setBaseline(id: number): Promise<void> {
    await axios.post(`${API_URL}/routes/${id}/baseline`);
  }

  async getComparison(): Promise<ComparisonResult[]> {
    const response = await axios.get(`${API_URL}/routes/comparison`);
    return response.data;
  }
}
