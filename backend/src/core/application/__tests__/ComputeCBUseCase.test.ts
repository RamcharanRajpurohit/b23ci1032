import { ComputeCBUseCase } from '../ComputeCBUseCase';
import { IRouteRepository } from '../../ports/IRouteRepository';
import { IComplianceRepository } from '../../ports/IComplianceRepository';
import { Route } from '../../domain/Route';

describe('ComputeCBUseCase', () => {
  let mockRouteRepository: Partial<IRouteRepository>;
  let mockComplianceRepository: Partial<IComplianceRepository>;
  let useCase: ComputeCBUseCase;

  beforeEach(() => {
    mockRouteRepository = {
      findByRouteId: jest.fn(),
    };

    mockComplianceRepository = {
      saveCompliance: jest.fn().mockImplementation(c => Promise.resolve(c)),
    };

    useCase = new ComputeCBUseCase(
      mockRouteRepository as IRouteRepository,
      mockComplianceRepository as IComplianceRepository
    );
  });

  describe('execute', () => {
    it('should calculate positive CB for route below target', async () => {
      const route: Route = {
        id: 1,
        routeId: 'R001',
        vesselType: 'Container',
        fuelType: 'LNG',
        year: 2025,
        ghgIntensity: 88.0, // Below target of 89.3368
        fuelConsumption: 5000,
        distance: 12000,
        totalEmissions: 4500,
        isBaseline: false,
      };

      (mockRouteRepository.findByRouteId as jest.Mock).mockResolvedValue(route);

      const result = await useCase.execute('R001', 2025);

      // Energy = 5000 t × 41,000 MJ/t = 205,000,000 MJ
      // CB = (89.3368 - 88.0) × 205,000,000 ≈ 274,004,000 gCO2eq (surplus)
      expect(result.cbGco2eq).toBeGreaterThan(0);
      expect(result.cbGco2eq).toBeCloseTo(274000000, -5); // Within 50,000
      expect(result.shipId).toBe('R001');
      expect(result.year).toBe(2025);
    });

    it('should calculate negative CB for route above target', async () => {
      const route: Route = {
        id: 2,
        routeId: 'R003',
        vesselType: 'Tanker',
        fuelType: 'MGO',
        year: 2024,
        ghgIntensity: 93.5, // Above target of 89.3368
        fuelConsumption: 5100,
        distance: 12500,
        totalEmissions: 4700,
        isBaseline: false,
      };

      (mockRouteRepository.findByRouteId as jest.Mock).mockResolvedValue(route);

      const result = await useCase.execute('R003', 2024);

      // Energy = 5100 t × 41,000 MJ/t = 209,100,000 MJ
      // CB = (89.3368 - 93.5) × 209,100,000 = -870,386,880 gCO2eq (deficit)
      expect(result.cbGco2eq).toBeLessThan(0);
      expect(result.shipId).toBe('R003');
      expect(result.year).toBe(2024);
    });

    it('should save computed CB to repository', async () => {
      const route: Route = {
        id: 1,
        routeId: 'R001',
        vesselType: 'Container',
        fuelType: 'LNG',
        year: 2025,
        ghgIntensity: 88.0,
        fuelConsumption: 5000,
        distance: 12000,
        totalEmissions: 4500,
        isBaseline: false,
      };

      (mockRouteRepository.findByRouteId as jest.Mock).mockResolvedValue(route);

      await useCase.execute('R001', 2025);

      expect(mockComplianceRepository.saveCompliance).toHaveBeenCalledWith(
        expect.objectContaining({
          shipId: 'R001',
          year: 2025,
        })
      );
    });

    it('should throw error if route not found', async () => {
      (mockRouteRepository.findByRouteId as jest.Mock).mockResolvedValue(null);

      await expect(useCase.execute('INVALID', 2025)).rejects.toThrow(
        'Route not found for specified ship and year'
      );
    });

    it('should use correct energy conversion factor (41,000 MJ/t)', async () => {
      const route: Route = {
        id: 1,
        routeId: 'R001',
        vesselType: 'Container',
        fuelType: 'HFO',
        year: 2024,
        ghgIntensity: 91.0,
        fuelConsumption: 1000, // 1000 tonnes
        distance: 10000,
        totalEmissions: 3000,
        isBaseline: false,
      };

      (mockRouteRepository.findByRouteId as jest.Mock).mockResolvedValue(route);

      const result = await useCase.execute('R001', 2024);

      // Expected energy: 1000 × 41,000 = 41,000,000 MJ
      expect(result.energyInScope).toBe(41000000);
    });
  });
});
