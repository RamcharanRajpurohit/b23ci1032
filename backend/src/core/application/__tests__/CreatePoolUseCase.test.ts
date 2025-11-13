import { CreatePoolUseCase } from '../CreatePoolUseCase';
import { IComplianceRepository } from '../../ports/IComplianceRepository';

describe('CreatePoolUseCase', () => {
  let mockRepository: Partial<IComplianceRepository>;
  let useCase: CreatePoolUseCase;

  beforeEach(() => {
    mockRepository = {
      createPool: jest.fn().mockImplementation(pool => Promise.resolve({ ...pool, id: 1 })),
      addPoolMembers: jest.fn(),
    };

    useCase = new CreatePoolUseCase(mockRepository as IComplianceRepository);
  });

  describe('execute', () => {
    it('should create pool with surplus and deficit ships using greedy allocation', async () => {
      const request = {
        year: 2024,
        members: [
          { shipId: 'R001', cbBefore: 1000000 }, // Surplus
          { shipId: 'R003', cbBefore: -500000 }, // Deficit
        ]
      };

      const result = await useCase.execute(request);

      expect(result.pool.year).toBe(2024);
      expect(result.members).toHaveLength(2);
      
      // Surplus ship contributes all
      const surplusShip = result.members.find(m => m.shipId === 'R001');
      expect(surplusShip?.cbBefore).toBe(1000000);
      expect(surplusShip?.cbAfter).toBe(0);
      
      // Deficit ship gets covered
      const deficitShip = result.members.find(m => m.shipId === 'R003');
      expect(deficitShip?.cbBefore).toBe(-500000);
      expect(deficitShip?.cbAfter).toBe(0); // Fully covered
      
      expect(mockRepository.createPool).toHaveBeenCalled();
      expect(mockRepository.addPoolMembers).toHaveBeenCalled();
    });

    it('should throw error if total CB is negative', async () => {
      const request = {
        year: 2024,
        members: [
          { shipId: 'R001', cbBefore: 100000 },
          { shipId: 'R003', cbBefore: -500000 },
        ]
      };

      await expect(useCase.execute(request)).rejects.toThrow(
        'Pool total compliance balance must be non-negative'
      );
    });

    it('should allocate surplus to multiple deficit ships', async () => {
      const request = {
        year: 2024,
        members: [
          { shipId: 'R001', cbBefore: 900000 }, // Surplus
          { shipId: 'R002', cbBefore: 600000 }, // Surplus
          { shipId: 'R003', cbBefore: -300000 }, // Deficit
        ]
      };

      // Total = 1,200,000
      // Deficit needs 300,000

      const result = await useCase.execute(request);

      expect(result.members).toHaveLength(3);
      
      // All surplus ships contribute all
      const surplusShips = result.members.filter(m => m.cbBefore > 0);
      surplusShips.forEach(ship => {
        expect(ship.cbAfter).toBe(0);
      });
      
      // Deficit ship is fully covered
      const deficitShip = result.members.find(m => m.shipId === 'R003');
      expect(deficitShip?.cbAfter).toBe(0);
    });

    it('should reject pool with negative total CB (insufficient surplus)', async () => {
      const request = {
        year: 2024,
        members: [
          { shipId: 'R001', cbBefore: 200000 }, // Surplus (200k)
          { shipId: 'R003', cbBefore: -500000 }, // Deficit (needs 500k)
        ]
      };

      // Total = 200k - 500k = -300k (negative!)
      await expect(useCase.execute(request)).rejects.toThrow(
        'Pool total compliance balance must be non-negative'
      );
    });

    it('should handle zero total CB correctly', async () => {
      const request = {
        year: 2024,
        members: [
          { shipId: 'R001', cbBefore: 500000 },
          { shipId: 'R003', cbBefore: -500000 },
        ]
      };

      const result = await useCase.execute(request);

      expect(result.members).toHaveLength(2);
      
      const surplusShip = result.members.find(m => m.shipId === 'R001');
      expect(surplusShip?.cbAfter).toBe(0);
      
      const deficitShip = result.members.find(m => m.shipId === 'R003');
      expect(deficitShip?.cbAfter).toBe(0); // Exactly covered
    });

    it('should handle multiple surplus ships', async () => {
      const request = {
        year: 2024,
        members: [
          { shipId: 'R001', cbBefore: 800000 },
          { shipId: 'R002', cbBefore: 400000 },
        ]
      };

      const result = await useCase.execute(request);

      // All surplus ships contribute everything
      result.members.forEach(member => {
        expect(member.cbAfter).toBe(0);
      });
    });
  });
});
