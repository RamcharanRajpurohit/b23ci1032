import { IComplianceRepository } from '../ports/IComplianceRepository';
import { BankEntry } from '../domain/Compliance';

export class BankSurplusUseCase {
  constructor(private complianceRepository: IComplianceRepository) {}

  async execute(shipId: string, year: number, amount: number): Promise<BankEntry> {
    const compliance = await this.complianceRepository.getCompliance(shipId, year);
    
    if (!compliance || compliance.cbGco2eq <= 0) {
      throw new Error('No positive compliance balance to bank');
    }

    if (amount > compliance.cbGco2eq) {
      throw new Error('Amount exceeds available compliance balance');
    }

    const bankEntry: BankEntry = {
      shipId,
      year,
      amountGco2eq: amount,
      appliedAmount: 0,
      remainingAmount: amount
    };

    return await this.complianceRepository.saveBankEntry(bankEntry);
  }
}
