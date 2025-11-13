import { BankSurplusUseCase } from '../BankSurplusUseCase';
import { IComplianceRepository } from '../../ports/IComplianceRepository';

describe('BankSurplusUseCase', () => {
  let mockRepository: Partial<IComplianceRepository>;
  let useCase: BankSurplusUseCase;

  beforeEach(() => {
    mockRepository = {
      getCompliance: jest.fn(),
      saveBankEntry: jest.fn().mockImplementation(entry => Promise.resolve(entry)),
    };

    useCase = new BankSurplusUseCase(mockRepository as IComplianceRepository);
  });

  describe('execute', () => {
    it('should bank positive surplus successfully', async () => {
      (mockRepository.getCompliance as jest.Mock).mockResolvedValue({
        shipId: 'R001',
        year: 2024,
        cbGco2eq: 500000, // Positive surplus
        targetIntensity: 89.3368,
        actualIntensity: 88.0,
        energyInScope: 205000000,
      });

      const result = await useCase.execute('R001', 2024, 200000);

      expect(result.amountGco2eq).toBe(200000);
      expect(result.shipId).toBe('R001');
      expect(result.year).toBe(2024);
      expect(mockRepository.saveBankEntry).toHaveBeenCalled();
    });

    it('should throw error when trying to bank more than available surplus', async () => {
      (mockRepository.getCompliance as jest.Mock).mockResolvedValue({
        shipId: 'R001',
        year: 2024,
        cbGco2eq: 100000, // Only 100k available
        targetIntensity: 89.3368,
        actualIntensity: 88.0,
        energyInScope: 205000000,
      });

      await expect(useCase.execute('R001', 2024, 200000)).rejects.toThrow(
        'Amount exceeds available compliance balance'
      );
    });

    it('should throw error when CB is negative (deficit)', async () => {
      (mockRepository.getCompliance as jest.Mock).mockResolvedValue({
        shipId: 'R001',
        year: 2024,
        cbGco2eq: -500000, // Deficit
        targetIntensity: 89.3368,
        actualIntensity: 93.0,
        energyInScope: 205000000,
      });

      await expect(useCase.execute('R001', 2024, 100000)).rejects.toThrow(
        'No positive compliance balance to bank'
      );
    });

    it('should handle zero amount by creating zero-value entry', async () => {
      (mockRepository.getCompliance as jest.Mock).mockResolvedValue({
        shipId: 'R001',
        year: 2024,
        cbGco2eq: 500000,
        targetIntensity: 89.3368,
        actualIntensity: 88.0,
        energyInScope: 205000000,
      });

      // Zero amounts create a zero-value bank entry
      const result = await useCase.execute('R001', 2024, 0);
      expect(result.amountGco2eq).toBe(0);
      expect(result.remainingAmount).toBe(0);
    });

    it('should throw error if compliance balance not found', async () => {
      (mockRepository.getCompliance as jest.Mock).mockResolvedValue(null);

      await expect(useCase.execute('R001', 2024, 100000)).rejects.toThrow(
        'No positive compliance balance to bank'
      );
    });
  });
});
