import axios from 'axios';
import { IPoolingService } from '../../core/ports/IPoolingService';
import { Pool, PoolMember } from '../../core/domain/Compliance';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class ApiPoolingService implements IPoolingService {
  async createPool(
    year: number,
    members: Array<{ shipId: string; cbBefore: number }>
  ): Promise<{ pool: Pool; members: PoolMember[] }> {
    const response = await axios.post(`${API_URL}/pools`, {
      year,
      members,
    });
    return response.data;
  }
}
