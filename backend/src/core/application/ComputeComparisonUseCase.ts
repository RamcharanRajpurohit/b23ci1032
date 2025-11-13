import { IRouteRepository } from '../ports/IRouteRepository';
import { ComparisonResult } from '../domain/Comparison';
import { Route } from '../domain/Route';

export class ComputeComparisonUseCase {
  private readonly TARGET_INTENSITY = 89.3368; // 2% below 91.16

  constructor(private routeRepository: IRouteRepository) {}

  async execute(): Promise<ComparisonResult[]> {
    const baseline = await this.routeRepository.getBaseline();
    if (!baseline) {
      throw new Error('No baseline route set');
    }

    const allRoutes = await this.routeRepository.findAll();
    const comparisons = allRoutes
      .filter(route => route.id !== baseline.id)
      .map(route => this.compareRoutes(baseline, route));

    return comparisons;
  }

  private compareRoutes(baseline: Route, comparison: Route): ComparisonResult {
    const percentDiff = ((comparison.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
    const compliant = comparison.ghgIntensity <= this.TARGET_INTENSITY;

    return {
      baseline,
      comparison,
      percentDiff,
      compliant,
      targetIntensity: this.TARGET_INTENSITY
    };
  }
}
