import { ComputeComparisonUseCase } from '../ComputeComparisonUseCase';
import { IRouteRepository } from '../../ports/IRouteRepository';
import { Route } from '../../domain/Route';

describe('ComputeComparisonUseCase', () => {
  let mockRepository: Partial<IRouteRepository>;
  let useCase: ComputeComparisonUseCase;

  beforeEach(() => {
    mockRepository = {
      getBaseline: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new ComputeComparisonUseCase(mockRepository as IRouteRepository);
  });

  describe('execute', () => {
    const baselineRoute: Route = {
      id: 1,
      routeId: 'R001',
      vesselType: 'Container',
      fuelType: 'HFO',
      year: 2024,
      ghgIntensity: 91.16,
      fuelConsumption: 450,
      distance: 8000,
      totalEmissions: 500,
      isBaseline: true,
    };

    it('should compare routes against baseline correctly', async () => {
      const comparisonRoute: Route = {
        id: 2,
        routeId: 'R002',
        vesselType: 'Container',
        fuelType: 'HFO',
        year: 2024,
        ghgIntensity: 85.0, // Better than baseline
        fuelConsumption: 400,
        distance: 8000,
        totalEmissions: 450,
        isBaseline: false,
      };

      (mockRepository.getBaseline as jest.Mock).mockResolvedValue(baselineRoute);
      (mockRepository.findAll as jest.Mock).mockResolvedValue([baselineRoute, comparisonRoute]);

      const results = await useCase.execute();

      expect(results).toHaveLength(1); // Baseline excluded
      expect(results[0].baseline.id).toBe(1);
      expect(results[0].comparison.id).toBe(2);
      expect(results[0].compliant).toBe(true); // 85 < 89.3368
      expect(results[0].targetIntensity).toBe(89.3368);
      
      // Percent diff: (85 / 91.16 - 1) * 100 ≈ -6.76%
      expect(results[0].percentDiff).toBeCloseTo(-6.76, 1);
    });

    it('should identify non-compliant routes', async () => {
      const comparisonRoute: Route = {
        id: 3,
        routeId: 'R003',
        vesselType: 'Container',
        fuelType: 'HFO',
        year: 2024,
        ghgIntensity: 95.0, // Worse than baseline
        fuelConsumption: 500,
        distance: 8000,
        totalEmissions: 550,
        isBaseline: false,
      };

      (mockRepository.getBaseline as jest.Mock).mockResolvedValue(baselineRoute);
      (mockRepository.findAll as jest.Mock).mockResolvedValue([baselineRoute, comparisonRoute]);

      const results = await useCase.execute();

      expect(results).toHaveLength(1);
      expect(results[0].compliant).toBe(false); // 95 > 89.3368
      
      // Percent diff: (95 / 91.16 - 1) * 100 ≈ 4.21%
      expect(results[0].percentDiff).toBeCloseTo(4.21, 1);
    });

    it('should throw error if no baseline set', async () => {
      (mockRepository.getBaseline as jest.Mock).mockResolvedValue(null);

      await expect(useCase.execute()).rejects.toThrow('No baseline route set');
    });

    it('should handle multiple comparison routes', async () => {
      const route2: Route = {
        ...baselineRoute,
        id: 2,
        routeId: 'R002',
        ghgIntensity: 88.0,
        isBaseline: false,
      };

      const route3: Route = {
        ...baselineRoute,
        id: 3,
        routeId: 'R003',
        ghgIntensity: 92.0,
        isBaseline: false,
      };

      (mockRepository.getBaseline as jest.Mock).mockResolvedValue(baselineRoute);
      (mockRepository.findAll as jest.Mock).mockResolvedValue([baselineRoute, route2, route3]);

      const results = await useCase.execute();

      expect(results).toHaveLength(2);
      expect(results[0].comparison.id).toBe(2);
      expect(results[0].compliant).toBe(true); // 88 < 89.3368
      expect(results[1].comparison.id).toBe(3);
      expect(results[1].compliant).toBe(false); // 92 > 89.3368
    });

    it('should use target intensity of 89.3368 (2% below 91.16)', async () => {
      const comparisonRoute: Route = {
        ...baselineRoute,
        id: 2,
        routeId: 'R002',
        ghgIntensity: 89.3368, // Exactly at target
        isBaseline: false,
      };

      (mockRepository.getBaseline as jest.Mock).mockResolvedValue(baselineRoute);
      (mockRepository.findAll as jest.Mock).mockResolvedValue([baselineRoute, comparisonRoute]);

      const results = await useCase.execute();

      expect(results[0].targetIntensity).toBe(89.3368);
      expect(results[0].compliant).toBe(true); // <= target
    });

    it('should handle only baseline route in database', async () => {
      (mockRepository.getBaseline as jest.Mock).mockResolvedValue(baselineRoute);
      (mockRepository.findAll as jest.Mock).mockResolvedValue([baselineRoute]);

      const results = await useCase.execute();

      expect(results).toHaveLength(0); // No comparisons
    });

    it('should calculate percentage difference correctly', async () => {
      const comparisonRoute: Route = {
        ...baselineRoute,
        id: 2,
        routeId: 'R002',
        ghgIntensity: 100.0, // Exactly 100
        isBaseline: false,
      };

      (mockRepository.getBaseline as jest.Mock).mockResolvedValue(baselineRoute);
      (mockRepository.findAll as jest.Mock).mockResolvedValue([baselineRoute, comparisonRoute]);

      const results = await useCase.execute();

      // (100 / 91.16 - 1) * 100 ≈ 9.69%
      expect(results[0].percentDiff).toBeCloseTo(9.69, 1);
    });
  });
});
