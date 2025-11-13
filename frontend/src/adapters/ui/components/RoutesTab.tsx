import React, { useEffect, useState } from 'react';
import { IRouteService } from '../../../core/ports/IRouteService';
import { Route } from '../../../core/domain/Route';
import { TableSkeleton } from './Skeleton';

interface Props {
  routeService: IRouteService;
}

export const RoutesTab: React.FC<Props> = ({ routeService }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState<{
    vesselType?: string;
    fuelType?: string;
    year?: number;
  }>({});

  useEffect(() => {
    loadRoutes();
  }, [filters]);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await routeService.getAllRoutes(filters);
      setRoutes(data);
    } catch (error: any) {
      console.error('Failed to load routes:', error);
      setError(error.message || 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  const handleSetBaseline = async (id: number) => {
    try {
      setUpdatingId(id);
      setError('');
      await routeService.setBaseline(id);
      // Optimistic update
      setRoutes(prevRoutes => 
        prevRoutes.map(route => 
          route.id === id ? { ...route, isBaseline: true } : route
        )
      );
    } catch (error: any) {
      console.error('Failed to set baseline:', error);
      setError(error.message || 'Failed to set baseline');
      // Reload on error
      await loadRoutes();
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="h-8 w-48 bg-gray-300 rounded animate-pulse mb-4"></div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <TableSkeleton rows={5} columns={9} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg transition-all duration-200" role="region" aria-label="Routes Management">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Routes Management</h2>
          <p className="text-sm text-gray-600 mt-1">View, filter, and set baseline routes for compliance comparison</p>
        </div>
        <button
          onClick={loadRoutes}
          disabled={loading}
          aria-label="Refresh routes data"
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded animate-fade-in" role="alert">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* Filters */}
      <fieldset className="mb-6 border border-gray-200 rounded-lg p-4">
        <legend className="text-lg font-semibold text-gray-800 px-2">Filter Routes</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="form-group">
            <label htmlFor="vessel-type-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Vessel Type
            </label>
            <select
              id="vessel-type-filter"
              value={filters.vesselType || ''}
              onChange={(e) => setFilters({ ...filters, vesselType: e.target.value || undefined })}
              aria-label="Filter by vessel type"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            >
              <option value="">All Types</option>
              <option value="Container">Container Ships</option>
              <option value="BulkCarrier">Bulk Carriers</option>
              <option value="Tanker">Tankers</option>
              <option value="RoRo">Roll-on/Roll-off (RoRo)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="fuel-type-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type
            </label>
            <select
              id="fuel-type-filter"
              value={filters.fuelType || ''}
              onChange={(e) => setFilters({ ...filters, fuelType: e.target.value || undefined })}
              aria-label="Filter by fuel type"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            >
              <option value="">All Fuels</option>
              <option value="HFO">HFO - Heavy Fuel Oil</option>
              <option value="LNG">LNG - Liquefied Natural Gas</option>
              <option value="MGO">MGO - Marine Gas Oil</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Reporting Year
            </label>
            <select
              id="year-filter"
              value={filters.year || ''}
              onChange={(e) => setFilters({ ...filters, year: e.target.value ? parseInt(e.target.value) : undefined })}
              aria-label="Filter by year"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            >
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>
      </fieldset>

      <div className="mb-3 text-sm text-gray-600" role="status" aria-live="polite">
        Showing <span className="font-semibold">{routes.length}</span> route{routes.length !== 1 ? 's' : ''}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white" role="table" aria-label="Routes data table">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Route ID</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Vessel Type</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Fuel Type</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Year</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <abbr title="Greenhouse Gas Intensity in grams CO2 equivalent per Megajoule">GHG Intensity</abbr>
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <abbr title="Fuel consumption in tonnes">Fuel (t)</abbr>
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <abbr title="Distance traveled in kilometers">Distance (km)</abbr>
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <abbr title="Total emissions in tonnes">Emissions (t)</abbr>
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {routes.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  <p className="text-lg mb-2">No routes found</p>
                  <p className="text-sm">Try adjusting your filter criteria above</p>
                </td>
              </tr>
            ) : (
              routes.map(route => (
                <tr key={route.id} className="hover:bg-teal-50 transition-colors duration-150">
                  <td className="px-4 py-3 font-medium text-gray-900">{route.routeId}</td>
                  <td className="px-4 py-3 text-gray-700">{route.vesselType}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      {route.fuelType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{route.year}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-900">{route.ghgIntensity.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-700">{route.fuelConsumption.toFixed(0)}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-700">{route.distance.toFixed(0)}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-700">{route.totalEmissions.toFixed(0)}</td>
                  <td className="px-4 py-3 text-center">
                    {!route.isBaseline ? (
                      <button
                        onClick={() => handleSetBaseline(route.id)}
                        disabled={updatingId === route.id}
                        aria-label={`Set route ${route.routeId} as baseline`}
                        title="Set this route as the baseline for compliance comparison"
                        className="bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      >
                        {updatingId === route.id ? 'Setting...' : 'Set Baseline'}
                      </button>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-800" role="status">
                        <span aria-hidden="true">✓</span> Baseline
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Help Section */}
      <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
        <h3 className="font-semibold text-teal-900 mb-2">Help: Setting Baselines</h3>
        <ul className="text-sm text-teal-800 space-y-1 list-disc list-inside">
          <li>A baseline route represents the reference standard for emissions comparison</li>
          <li>Click "Set Baseline" to designate a route as your baseline</li>
          <li>Only one baseline can be active at a time</li>
          <li>Baselines are used in the Compare tab to calculate compliance</li>
        </ul>
      </div>
    </div>
  );
};
