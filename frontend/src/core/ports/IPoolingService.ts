import { Pool, PoolMember } from '../domain/Compliance';

export interface IPoolingService {
  createPool(year: number, members: Array<{ shipId: string; cbBefore: number }>): Promise<{
    pool: Pool;
    members: PoolMember[];
  }>;
}
