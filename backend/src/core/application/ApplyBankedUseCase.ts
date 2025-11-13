import { IComplianceRepository } from '../ports/IComplianceRepository';

export class ApplyBankedUseCase {
  constructor(private complianceRepository: IComplianceRepository) {}

  async execute(shipId: string, year: number, amount: number): Promise<void> {
    const bankEntries = await this.complianceRepository.getBankEntries(shipId, year);
    const totalAvailable = bankEntries.reduce((sum, entry) => sum + entry.remainingAmount, 0);

    if (amount > totalAvailable) {
      throw new Error('Insufficient banked surplus');
    }

    let remaining = amount;
    for (const entry of bankEntries) {
      if (remaining <= 0) break;
      
      const toApply = Math.min(remaining, entry.remainingAmount);
      await this.complianceRepository.updateBankEntry(
        entry.id!,
        entry.appliedAmount + toApply
      );
      remaining -= toApply;
    }
  }
}
