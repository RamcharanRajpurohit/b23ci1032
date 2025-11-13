import React, { useEffect, useState } from 'react';
import { IRouteService } from '../../../core/ports/IRouteService';
import { ComparisonResult } from '../../../core/domain/Route';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CardSkeleton } from './Skeleton';

interface Props {
  routeService: IRouteService;
}

export const CompareTab: React.FC<Props> = ({ routeService }) => {
  const [comparisons, setComparisons] = useState<ComparisonResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadComparisons();
  }, []);

  const loadComparisons = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await routeService.getComparison();
      setComparisons(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load comparisons');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CardSkeleton />;
  
  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg" role="region" aria-label="Comparison Error">
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded" role="alert">
          <p className="font-medium">Error Loading Comparisons</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={loadComparisons}
            aria-label="Retry loading comparisons"
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const chartData = comparisons.map((c) => ({
    name: c.comparison.routeId,
    baseline: c.baseline.ghgIntensity,
    comparison: c.comparison.ghgIntensity,
    target: c.targetIntensity,
  }));

  const compliantCount = comparisons.filter(c => c.compliant).length;
  const complianceRate = comparisons.length > 0 ? (compliantCount / comparisons.length * 100).toFixed(1) : 0;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg transition-all duration-200" role="region" aria-label="Route Comparison Analysis">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Route Comparison Analysis</h2>
          <p className="text-gray-600 mt-1">
            Target GHG Intensity Limit: <span className="font-semibold text-red-600">{comparisons[0]?.targetIntensity.toFixed(4)} gCO₂e/MJ</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">Comparing routes against baseline to determine FuelEU compliance</p>
        </div>
        <button
          onClick={loadComparisons}
          aria-label="Refresh comparison data"
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" role="list" aria-label="Compliance statistics">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200" role="listitem">
          <div className="text-sm text-teal-700 font-medium">Total Routes Analyzed</div>
          <div className="text-3xl font-bold text-teal-900 mt-1" aria-label={`${comparisons.length} routes`}>{comparisons.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200" role="listitem">
          <div className="text-sm text-green-700 font-medium">Compliant Routes</div>
          <div className="text-3xl font-bold text-green-900 mt-1" aria-label={`${compliantCount} compliant routes`}>{compliantCount}</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200" role="listitem">
          <div className="text-sm text-emerald-700 font-medium">Overall Compliance Rate</div>
          <div className="text-3xl font-bold text-emerald-900 mt-1" aria-label={`${complianceRate}% compliance rate`}>{complianceRate}%</div>
        </div>
      </div>

      <div className="mb-8 bg-gray-50 p-4 rounded-lg" role="figure" aria-label="GHG Intensity Comparison Chart">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">GHG Intensity Comparison Chart</h3>
        <p className="text-sm text-gray-600 mb-4">Visual comparison of baseline, actual, and target GHG intensity values</p>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#666"
              label={{ value: 'Route ID', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'GHG Intensity (gCO₂e/MJ)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #ccc', 
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="baseline" fill="#0d9488" name="Baseline Intensity" radius={[4, 4, 0, 0]} />
            <Bar dataKey="comparison" fill="#10b981" name="Actual Intensity" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="#ef4444" name="Target Limit" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full bg-white" role="table" aria-label="Route compliance comparison results">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Route ID</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <abbr title="Baseline GHG Intensity in grams CO2 equivalent per Megajoule">Baseline (gCO₂e/MJ)</abbr>
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <abbr title="Actual GHG Intensity in grams CO2 equivalent per Megajoule">Actual (gCO₂e/MJ)</abbr>
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <abbr title="Percentage difference from baseline">Difference (%)</abbr>
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Compliance Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {comparisons.map((c, idx) => (
              <tr key={idx} className="hover:bg-teal-50 transition-colors duration-150">
                <td className="px-4 py-3 font-medium text-gray-900">{c.comparison.routeId}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-700">{c.baseline.ghgIntensity.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-700">{c.comparison.ghgIntensity.toFixed(2)}</td>
                <td className={`px-4 py-3 text-right font-mono font-semibold ${c.percentDiff < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {c.percentDiff > 0 ? '+' : ''}{c.percentDiff.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-center">
                  {c.compliant ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800" role="status">
                      <span aria-hidden="true">✓</span> <span className="ml-1">Compliant</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800" role="status">
                      <span aria-hidden="true">✗</span> <span className="ml-1">Non-Compliant</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Help Section */}
      <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
        <h3 className="font-semibold text-teal-900 mb-2">Understanding Compliance</h3>
        <ul className="text-sm text-teal-800 space-y-1 list-disc list-inside">
          <li><strong>Compliant:</strong> Route GHG intensity meets or is below the target limit</li>
          <li><strong>Non-Compliant:</strong> Route exceeds the allowed GHG intensity threshold</li>
          <li><strong>Negative %:</strong> Indicates improvement over baseline (better performance)</li>
          <li><strong>Positive %:</strong> Indicates worse performance compared to baseline</li>
        </ul>
      </div>
    </div>
  );
};
