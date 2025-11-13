export interface Route {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export interface ComparisonResult {
  baseline: Route;
  comparison: Route;
  percentDiff: number;
  compliant: boolean;
  targetIntensity: number;
}
