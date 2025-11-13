import React, { useState } from 'react';
import { IComplianceService } from '../../../core/ports/IComplianceService';
import { IBankingService } from '../../../core/ports/IBankingService';

interface Props {
  complianceService: IComplianceService;
  bankingService: IBankingService;
}

export const BankingTab: React.FC<Props> = ({ complianceService, bankingService }) => {
  const [shipId, setShipId] = useState('R001');
  const [year, setYear] = useState(2024);
  const [amount, setAmount] = useState(0);
  const [cb, setCb] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<'bank' | 'apply' | null>(null);

  const loadCB = async () => {
    try {
      setLoading(true);
      setError('');
      const compliance = await complianceService.getComplianceBalance(shipId, year);
      setCb(compliance.cbGco2eq);
    } catch (err: any) {
      setError(err.message || 'Failed to load compliance balance');
      setCb(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (!cb || cb <= 0) {
      setError('Cannot bank negative or zero surplus');
      return;
    }
    if (amount > cb) {
      setError(`Amount cannot exceed current surplus (${cb.toFixed(2)} gCO₂eq)`);
      return;
    }
    
    try {
      setProcessing('bank');
      setError('');
      setMessage('');
      await bankingService.bankSurplus(shipId, year, amount);
      setMessage(`✅ Successfully banked ${amount.toFixed(2)} gCO₂eq surplus!`);
      // Optimistic update
      setCb(prev => prev !== null ? prev - amount : null);
      // Verify with actual data
      setTimeout(loadCB, 500);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to bank surplus');
    } finally {
      setProcessing(null);
    }
  };

  const handleApply = async () => {
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    
    try {
      setProcessing('apply');
      setError('');
      setMessage('');
      await bankingService.applyBanked(shipId, year, amount);
      setMessage(`✅ Successfully applied ${amount.toFixed(2)} gCO₂eq from banked surplus!`);
      // Optimistic update
      setCb(prev => prev !== null ? prev + amount : null);
      // Verify with actual data
      setTimeout(loadCB, 500);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to apply banked surplus');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg transition-all duration-200" role="region" aria-label="Banking Management">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Banking (Article 20)</h2>
      <p className="text-gray-600 text-sm mb-6">
        Manage surplus compliance balance banking and application under FuelEU Maritime Article 20
      </p>

      <fieldset className="border border-gray-200 rounded-lg p-4 mb-6">
        <legend className="text-lg font-semibold text-gray-800 px-2">Banking Parameters</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="form-group">
            <label htmlFor="banking-ship-id" className="block text-sm font-medium text-gray-700 mb-2">
              Ship ID <span className="text-red-600" aria-label="required">*</span>
            </label>
            <input
              id="banking-ship-id"
              type="text"
              value={shipId}
              onChange={(e) => {
                setShipId(e.target.value);
                setCb(null);
                setMessage('');
                setError('');
              }}
              aria-required="true"
              aria-describedby="ship-id-help"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="e.g., R001"
            />
            <p id="ship-id-help" className="text-xs text-gray-500 mt-1">Enter the unique identifier for the ship</p>
          </div>
          <div className="form-group">
            <label htmlFor="banking-year" className="block text-sm font-medium text-gray-700 mb-2">
              Reporting Year <span className="text-red-600" aria-label="required">*</span>
            </label>
            <input
              id="banking-year"
              type="number"
              value={year}
              onChange={(e) => {
                setYear(parseInt(e.target.value));
                setCb(null);
                setMessage('');
                setError('');
              }}
              aria-required="true"
              aria-describedby="year-help"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              min="2020"
              max="2050"
            />
            <p id="year-help" className="text-xs text-gray-500 mt-1">Select the compliance reporting year</p>
          </div>
          <div className="form-group">
            <label htmlFor="banking-amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (gCO₂eq) <span className="text-red-600" aria-label="required">*</span>
            </label>
            <input
              id="banking-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              aria-required="true"
              aria-describedby="amount-help"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <p id="amount-help" className="text-xs text-gray-500 mt-1">Amount to bank or apply in grams CO₂ equivalent</p>
          </div>
        </div>
      </fieldset>

      <button
        onClick={loadCB}
        disabled={loading || !shipId}
        aria-label="Load compliance balance for the specified ship and year"
        className="bg-teal-600 text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
      >
        {loading ? 'Loading...' : 'Load Compliance Balance'}
      </button>

      {cb !== null && (
        <div className={`my-6 p-5 rounded-lg border-2 transition-all duration-300 animate-fade-in ${
          cb > 0 ? 'bg-green-50 border-green-300' : cb < 0 ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-300'
        }`} role="status" aria-live="polite">
          <p className="text-sm text-gray-600 mb-1">Current Compliance Balance</p>
          <p className="text-3xl font-bold">
            <span className={cb > 0 ? 'text-green-700' : cb < 0 ? 'text-red-700' : 'text-gray-700'}>
              {cb.toFixed(2)} gCO₂eq
            </span>
          </p>
          {cb > 0 && (
            <p className="text-sm text-green-600 mt-2">
              <span className="font-semibold">Status:</span> Surplus available for banking
            </p>
          )}
          {cb < 0 && (
            <p className="text-sm text-red-600 mt-2">
              <span className="font-semibold">Status:</span> Deficit - can apply banked surplus to offset
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label="Banking actions">
        <button
          onClick={handleBank}
          disabled={!cb || cb <= 0 || amount <= 0 || processing !== null}
          aria-label="Bank surplus compliance balance"
          title="Store positive compliance balance for future use (maximum 3 years)"
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          {processing === 'bank' ? 'Processing...' : 'Bank Surplus'}
        </button>
        <button
          onClick={handleApply}
          disabled={amount <= 0 || processing !== null}
          aria-label="Apply banked compliance balance"
          title="Use previously banked surplus to offset current deficit"
          className="bg-teal-600 text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          {processing === 'apply' ? 'Processing...' : 'Apply Banked Surplus'}
        </button>
      </div>

      {message && (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded animate-fade-in" role="alert">
          <p className="font-medium">{message}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded animate-fade-in" role="alert">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-200">
        <h3 className="font-semibold text-teal-900 mb-2">Banking Instructions</h3>
        <div className="text-sm text-teal-800 space-y-2">
          <div>
            <strong>Step 1:</strong> Enter Ship ID and Year, then click "Load Compliance Balance"
          </div>
          <div>
            <strong>Step 2:</strong> Review the displayed compliance balance
          </div>
          <div>
            <strong>Step 3:</strong> Enter the amount you wish to bank or apply
          </div>
          <div>
            <strong>Banking:</strong> Store positive balance for future use (valid for up to 3 years)
          </div>
          <div>
            <strong>Applying:</strong> Use previously banked balance to offset current deficits
          </div>
        </div>
      </div>
    </div>
  );
};
