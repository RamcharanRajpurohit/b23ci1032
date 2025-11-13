import { ApplyBankedUseCase } from '../ApplyBankedUseCase';
import { IComplianceRepository } from '../../ports/IComplianceRepository';
import { BankEntry } from '../../domain/Compliance';

describe('ApplyBankedUseCase', () => {
  let mockRepository: Partial<IComplianceRepository>;
  let useCase: ApplyBankedUseCase;

  beforeEach(() => {
    mockRepository = {
      getBankEntries: jest.fn(),
      updateBankEntry: jest.fn(),
    };

    useCase = new ApplyBankedUseCase(mockRepository as IComplianceRepository);
  });

  describe('execute', () => {
    it('should apply banked surplus from single entry', async () => {
      const mockEntries: BankEntry[] = [
        {
          id: 1,
          shipId: 'R001',
          year: 2024,
          amountGco2eq: 1000000,
          appliedAmount: 0,
          remainingAmount: 1000000,
        },
      ];

      (mockRepository.getBankEntries as jest.Mock).mockResolvedValue(mockEntries);

      await useCase.execute('R001', 2025, 500000);

      expect(mockRepository.getBankEntries).toHaveBeenCalledWith('R001', 2025);
      expect(mockRepository.updateBankEntry).toHaveBeenCalledWith(1, 500000);
    });

    it('should throw error if insufficient banked surplus', async () => {
      const mockEntries: BankEntry[] = [
        {
          id: 1,
          shipId: 'R001',
          year: 2024,
          amountGco2eq: 500000,
          appliedAmount: 0,
          remainingAmount: 500000,
        },
      ];

      (mockRepository.getBankEntries as jest.Mock).mockResolvedValue(mockEntries);

      await expect(useCase.execute('R001', 2025, 800000)).rejects.toThrow(
        'Insufficient banked surplus'
      );
    });

    it('should apply from multiple entries in order', async () => {
      const mockEntries: BankEntry[] = [
        {
          id: 1,
          shipId: 'R001',
          year: 2023,
          amountGco2eq: 300000,
          appliedAmount: 0,
          remainingAmount: 300000,
        },
        {
          id: 2,
          shipId: 'R001',
          year: 2024,
          amountGco2eq: 500000,
          appliedAmount: 0,
          remainingAmount: 500000,
        },
      ];

      (mockRepository.getBankEntries as jest.Mock).mockResolvedValue(mockEntries);

      await useCase.execute('R001', 2025, 600000);

      // First entry fully depleted: 300k
      expect(mockRepository.updateBankEntry).toHaveBeenCalledWith(1, 300000);
      // Second entry partially used: 300k
      expect(mockRepository.updateBankEntry).toHaveBeenCalledWith(2, 300000);
      expect(mockRepository.updateBankEntry).toHaveBeenCalledTimes(2);
    });

    it('should apply exact amount when matches available', async () => {
      const mockEntries: BankEntry[] = [
        {
          id: 1,
          shipId: 'R001',
          year: 2024,
          amountGco2eq: 750000,
          appliedAmount: 0,
          remainingAmount: 750000,
        },
      ];

      (mockRepository.getBankEntries as jest.Mock).mockResolvedValue(mockEntries);

      await useCase.execute('R001', 2025, 750000);

      expect(mockRepository.updateBankEntry).toHaveBeenCalledWith(1, 750000);
    });

    it('should handle partially used entries', async () => {
      const mockEntries: BankEntry[] = [
        {
          id: 1,
          shipId: 'R001',
          year: 2024,
          amountGco2eq: 1000000,
          appliedAmount: 400000, // Already used 400k
          remainingAmount: 600000, // Only 600k left
        },
      ];

      (mockRepository.getBankEntries as jest.Mock).mockResolvedValue(mockEntries);

      await useCase.execute('R001', 2025, 500000);

      expect(mockRepository.updateBankEntry).toHaveBeenCalledWith(1, 900000); // 400k + 500k
    });

    it('should throw error when no entries exist', async () => {
      (mockRepository.getBankEntries as jest.Mock).mockResolvedValue([]);

      await expect(useCase.execute('R001', 2025, 100000)).rejects.toThrow(
        'Insufficient banked surplus'
      );
    });

    it('should not apply if amount is zero', async () => {
      const mockEntries: BankEntry[] = [
        {
          id: 1,
          shipId: 'R001',
          year: 2024,
          amountGco2eq: 500000,
          appliedAmount: 0,
          remainingAmount: 500000,
        },
      ];

      (mockRepository.getBankEntries as jest.Mock).mockResolvedValue(mockEntries);

      await useCase.execute('R001', 2025, 0);

      expect(mockRepository.updateBankEntry).not.toHaveBeenCalled();
    });
  });
});
