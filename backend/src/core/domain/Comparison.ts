import { Route } from './Route';

export interface ComparisonResult {
  baseline: Route;
  comparison: Route;
  percentDiff: number;
  compliant: boolean;
  targetIntensity: number;
}
