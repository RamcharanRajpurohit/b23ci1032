import { Request, Response } from 'express';
import { ComputeCBUseCase } from '@core/application/ComputeCBUseCase';
import { IComplianceRepository } from '@core/ports/IComplianceRepository';

export class ComplianceController {
  constructor(
    private computeCBUseCase: ComputeCBUseCase,
    private complianceRepository: IComplianceRepository
  ) {}

  getComplianceBalance = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;
      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      const compliance = await this.computeCBUseCase.execute(
        shipId as string,
        parseInt(year as string)
      );
      res.json(compliance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAdjustedCB = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;
      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      const compliance = await this.complianceRepository.getCompliance(
        shipId as string,
        parseInt(year as string)
      );

      if (!compliance) {
        return res.status(404).json({ error: 'Compliance data not found' });
      }

      const bankEntries = await this.complianceRepository.getBankEntries(
        shipId as string,
        parseInt(year as string)
      );

      const totalBanked = bankEntries.reduce((sum: number, entry: any) => sum + entry.remainingAmount, 0);
      const adjustedCB = compliance.cbGco2eq + totalBanked;

      res.json({ ...compliance, adjustedCB, bankedAmount: totalBanked });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
