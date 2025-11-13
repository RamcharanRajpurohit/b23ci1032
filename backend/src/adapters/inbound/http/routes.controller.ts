import { Request, Response } from 'express';
import { ComputeComparisonUseCase } from '@core/application/ComputeComparisonUseCase';
import { IRouteRepository } from '@core/ports/IRouteRepository';

export class RoutesController {
  constructor(
    private routeRepository: IRouteRepository,
    private computeComparisonUseCase: ComputeComparisonUseCase
  ) {}

  getAllRoutes = async (req: Request, res: Response) => {
    try {
      const filters = {
        vesselType: req.query.vesselType as string,
        fuelType: req.query.fuelType as string,
        year: req.query.year ? parseInt(req.query.year as string) : undefined
      };
      const routes = await this.routeRepository.findAll(filters);
      res.json(routes);
    } catch (error: any) {
      console.error('❌ Error in getAllRoutes:', error.message);
      if (error.message.includes('Tenant or user not found')) {
        console.error('💡 Database connection error - check .env DATABASE_URL');
      }
      res.status(500).json({ error: error.message });
    }
  };

  setBaseline = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await this.routeRepository.setBaseline(id);
      res.json({ message: 'Baseline set successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getComparison = async (req: Request, res: Response) => {
    try {
      const comparisons = await this.computeComparisonUseCase.execute();
      res.json(comparisons);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
