import { useState, useMemo } from 'react';
import { RoutesTab } from './adapters/ui/components/RoutesTab';
import { CompareTab } from './adapters/ui/components/CompareTab';
import { BankingTab } from './adapters/ui/components/BankingTab';
import { PoolingTab } from './adapters/ui/components/PoolingTab';
import { ApiRouteService } from './adapters/infrastructure/ApiRouteService';
import { ApiComplianceService } from './adapters/infrastructure/ApiComplianceService';
import { ApiBankingService } from './adapters/infrastructure/ApiBankingService';
import { ApiPoolingService } from './adapters/infrastructure/ApiPoolingService';

const routeService = new ApiRouteService();
const complianceService = new ApiComplianceService();
const bankingService = new ApiBankingService();
const poolingService = new ApiPoolingService();

type TabType = 'routes' | 'compare' | 'banking' | 'pooling';

const TAB_LABELS: Record<TabType, { label: string; icon: string; description: string }> = {
  routes: { label: 'Routes', icon: '▶', description: 'View and manage maritime routes' },
  compare: { label: 'Compare', icon: '⚖', description: 'Compare route emissions against baselines' },
  banking: { label: 'Banking', icon: '◉', description: 'Manage compliance balance banking' },
  pooling: { label: 'Pooling', icon: '◈', description: 'Create and manage pooling agreements' },
};

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('routes');

  // Memoize tabs to prevent unnecessary re-renders
  const tabComponents = useMemo(
    () => ({
      routes: <RoutesTab routeService={routeService} />,
      compare: <CompareTab routeService={routeService} />,
      banking: (
        <BankingTab
          complianceService={complianceService}
          bankingService={bankingService}
        />
      ),
      pooling: (
        <PoolingTab
          complianceService={complianceService}
          poolingService={poolingService}
        />
      ),
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-teal-700 to-emerald-700 text-white p-1 sm:p-6 shadow-lg" role="banner">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">FuelEU Maritime Compliance System</h1>
         
        </div>
      </header>

      <nav className="bg-white shadow-md sticky top-0 z-10" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex overflow-x-auto space-x-1 sm:space-x-2 py-3 scrollbar-hide" role="tablist">
            {(Object.entries(TAB_LABELS) as [TabType, typeof TAB_LABELS[TabType]][]).map(([tab, { label, icon, description }]) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`${tab}-panel`}
                aria-label={`${label}: ${description}`}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-teal-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                }`}
                title={description}
              >
                <span className="mr-1 sm:mr-2" aria-hidden="true">{icon}</span>
                <span className="hidden xs:inline sm:inline">{label}</span>
                <span className="inline xs:hidden sm:hidden">{label.slice(0, 1)}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Help Banner */}
      {/* <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-3 sm:pt-4">
        <div className="bg-teal-50 border-l-4 border-teal-500 p-3 sm:p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-teal-700 font-bold text-base sm:text-lg" aria-hidden="true">ⓘ</span>
            </div>
            <div className="ml-2 sm:ml-3">
              <h3 className="text-xs sm:text-sm font-medium text-teal-800">Getting Started</h3>
              <p className="mt-1 text-xs sm:text-sm text-teal-700">
                {activeTab === 'routes' && 'View and manage your maritime routes. Set baselines for compliance comparison.'}
                {activeTab === 'compare' && 'Compare your routes against baseline values to check FuelEU compliance status.'}
                {activeTab === 'banking' && 'Bank surplus compliance balance or apply previously banked balance to offset deficits.'}
                {activeTab === 'pooling' && 'Create pooling agreements between ships to share compliance balance.'}
              </p>
            </div>
          </div>
        </div>
      </div> */}

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4" role="main">
        <div className="tab-content-wrapper">
          {(Object.keys(tabComponents) as TabType[]).map((tab) => (
            <div
              key={tab}
              id={`${tab}-panel`}
              role="tabpanel"
              aria-labelledby={tab}
              className={`tab-content ${activeTab === tab ? 'active' : ''}`}
              style={{ display: activeTab === tab ? 'block' : 'none' }}
            >
              {tabComponents[tab]}
            </div>
          ))}
        </div>
      </main>

      {/* Footer with help */}
      <footer className="bg-white border-t border-gray-200 mt-6 sm:mt-8" role="contentinfo">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center">
            Need help? Hover over buttons and fields for guidance. All calculations follow FuelEU Maritime Regulation standards.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
