import { IRouteRepository } from '../ports/IRouteRepository';
import { IComplianceRepository } from '../ports/IComplianceRepository';
import { ShipCompliance } from '../domain/Compliance';

export class ComputeCBUseCase {
  private readonly TARGET_INTENSITY = 89.3368;
  private readonly ENERGY_CONVERSION = 41000; // MJ/tonne

  constructor(
    private routeRepository: IRouteRepository,
    private complianceRepository: IComplianceRepository
  ) {}

  async execute(shipId: string, year: number): Promise<ShipCompliance> {
    const route = await this.routeRepository.findByRouteId(shipId);
    if (!route || route.year !== year) {
      throw new Error('Route not found for specified ship and year');
    }

    const energyInScope = route.fuelConsumption * this.ENERGY_CONVERSION;
    const cbGco2eq = (this.TARGET_INTENSITY - route.ghgIntensity) * energyInScope;

    const compliance: ShipCompliance = {
      shipId,
      year,
      cbGco2eq,
      targetIntensity: this.TARGET_INTENSITY,
      actualIntensity: route.ghgIntensity,
      energyInScope
    };

    return await this.complianceRepository.saveCompliance(compliance);
  }
}
