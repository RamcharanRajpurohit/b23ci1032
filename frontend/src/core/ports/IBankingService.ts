import { BankEntry } from '../domain/Compliance';

export interface IBankingService {
  getBankRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry>;
  applyBanked(shipId: string, year: number, amount: number): Promise<void>;
}
