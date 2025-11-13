import axios from 'axios';
import { IBankingService } from '../../core/ports/IBankingService';
import { BankEntry } from '../../core/domain/Compliance';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class ApiBankingService implements IBankingService {
  async getBankRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const response = await axios.get(`${API_URL}/banking/records`, {
      params: { shipId, year },
    });
    return response.data;
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry> {
    const response = await axios.post(`${API_URL}/banking/bank`, {
      shipId,
      year,
      amount,
    });
    return response.data;
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<void> {
    await axios.post(`${API_URL}/banking/apply`, {
      shipId,
      year,
      amount,
    });
  }
}
