import { Request, Response } from 'express';
import { BankSurplusUseCase } from '@core/application/BankSurplusUseCase';
import { ApplyBankedUseCase } from '@core/application/ApplyBankedUseCase';
import { IComplianceRepository } from '@core/ports/IComplianceRepository';

export class BankingController {
  constructor(
    private bankSurplusUseCase: BankSurplusUseCase,
    private applyBankedUseCase: ApplyBankedUseCase,
    private complianceRepository: IComplianceRepository
  ) {}

  getBankRecords = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;
      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      const entries = await this.complianceRepository.getBankEntries(
        shipId as string,
        parseInt(year as string)
      );
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  bankSurplus = async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;
      if (!shipId || !year || !amount) {
        return res.status(400).json({ error: 'shipId, year, and amount are required' });
      }

      const result = await this.bankSurplusUseCase.execute(shipId, year, amount);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  applyBanked = async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;
      if (!shipId || !year || !amount) {
        return res.status(400).json({ error: 'shipId, year, and amount are required' });
      }

      await this.applyBankedUseCase.execute(shipId, year, amount);
      res.json({ message: 'Banked surplus applied successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
