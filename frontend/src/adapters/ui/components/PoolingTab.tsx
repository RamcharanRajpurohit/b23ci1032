import React, { useState } from 'react';
import { IComplianceService } from '../../../core/ports/IComplianceService';
import { IPoolingService } from '../../../core/ports/IPoolingService';
import { PoolMember } from '../../../core/domain/Compliance';

interface Props {
  complianceService: IComplianceService;
  poolingService: IPoolingService;
}

export const PoolingTab: React.FC<Props> = ({ poolingService }) => {
  const [year, setYear] = useState(2024);
  const [members, setMembers] = useState([
    { shipId: 'R001', cbBefore: 1000000 },
    { shipId: 'R003', cbBefore: -500000 },
  ]);
  const [result, setResult] = useState<PoolMember[] | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);

  const addMember = () => {
    setMembers([...members, { shipId: '', cbBefore: 0 }]);
    setResult(null);
    setError('');
    setSuccess('');
  };

  const updateMember = (index: number, field: 'shipId' | 'cbBefore', value: string | number) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
    setResult(null);
    setError('');
    setSuccess('');
  };

  const removeMember = (index: number) => {
    if (members.length <= 2) {
      setError('Pool must have at least 2 members');
      return;
    }
    setMembers(members.filter((_, i) => i !== index));
    setResult(null);
    setError('');
    setSuccess('');
  };

  const validateMembers = (): string | null => {
    if (members.length < 2) {
      return 'Pool must have at least 2 members';
    }
    for (let i = 0; i < members.length; i++) {
      if (!members[i].shipId || members[i].shipId.trim() === '') {
        return `Member ${i + 1} must have a Ship ID`;
      }
    }
    const shipIds = members.map(m => m.shipId);
    const uniqueIds = new Set(shipIds);
    if (shipIds.length !== uniqueIds.size) {
      return 'Duplicate Ship IDs found';
    }
    return null;
  };

  const createPool = async () => {
    const validationError = validateMembers();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (totalCB < 0) {
      setError('Pool total compliance balance must be non-negative to create a pool');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      setSuccess('');
      const response = await poolingService.createPool(year, members);
      setResult(response.members);
      setSuccess(`✅ Pool created successfully with ${response.members.length} members!`);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create pool');
      setResult(null);
    } finally {
      setProcessing(false);
    }
  };

  const totalCB = members.reduce((sum, m) => sum + (m.cbBefore || 0), 0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg transition-all duration-200" role="region" aria-label="Pooling Management">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Pooling (Article 21)</h2>
      <p className="text-gray-600 text-sm mb-6">
        Create compliance pools to share balance across multiple ships under FuelEU Maritime Article 21
      </p>

      <div className="mb-6">
        <label htmlFor="pool-year" className="block text-sm font-medium text-gray-700 mb-2">
          Pool Year <span className="text-red-600" aria-label="required">*</span>
        </label>
        <input
          id="pool-year"
          type="number"
          value={year}
          onChange={(e) => {
            setYear(parseInt(e.target.value));
            setResult(null);
            setError('');
            setSuccess('');
          }}
          aria-required="true"
          aria-describedby="pool-year-help"
          className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          min="2020"
          max="2050"
        />
        <p id="pool-year-help" className="text-xs text-gray-500 mt-1">Select the year for this pooling agreement</p>
      </div>

      <fieldset className="mb-6 border border-gray-200 rounded-lg p-4">
        <legend className="text-lg font-semibold text-gray-800 px-2">
          Pool Members ({members.length} total)
        </legend>
        <p className="text-sm text-gray-600 mb-3">Add at least 2 ships to create a pooling agreement</p>
        
        <div className="space-y-3" role="list" aria-label="Pool members">
          {members.map((member, idx) => (
            <div key={idx} className="flex gap-2 items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors" role="listitem">
              <span className="text-sm font-medium text-gray-600 w-8" aria-label={`Member ${idx + 1}`}>{idx + 1}.</span>
              <div className="flex-1">
                <label htmlFor={`member-${idx}-ship-id`} className="sr-only">Ship ID for member {idx + 1}</label>
                <input
                  id={`member-${idx}-ship-id`}
                  type="text"
                  placeholder="Ship ID (e.g., R001)"
                  value={member.shipId}
                  onChange={(e) => updateMember(idx, 'shipId', e.target.value)}
                  aria-label={`Ship ID for member ${idx + 1}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`member-${idx}-cb`} className="sr-only">Compliance balance for member {idx + 1}</label>
                <input
                  id={`member-${idx}-cb`}
                  type="number"
                  placeholder="Compliance Balance"
                  value={member.cbBefore}
                  onChange={(e) => updateMember(idx, 'cbBefore', parseFloat(e.target.value) || 0)}
                  aria-label={`Compliance balance for member ${idx + 1}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  step="0.01"
                />
              </div>
              <button
                onClick={() => removeMember(idx)}
                disabled={members.length <= 2}
                aria-label={`Remove member ${idx + 1}`}
                title={members.length <= 2 ? "Pool must have at least 2 members" : "Remove this member from pool"}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        
        <button
          onClick={addMember}
          aria-label="Add another pool member"
          className="mt-3 w-full bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-102 active:scale-98 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          + Add Another Member
        </button>
      </fieldset>

      <div className={`mb-6 p-5 rounded-lg border-2 transition-all ${
        totalCB >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
      }`} role="status" aria-live="polite">
        <p className="text-sm text-gray-600 mb-1">Pool Total Compliance Balance</p>
        <p className="text-3xl font-bold">
          <span className={totalCB >= 0 ? 'text-green-700' : 'text-red-700'}>
            {totalCB.toFixed(2)} gCO₂eq
          </span>
        </p>
        {totalCB >= 0 ? (
          <p className="text-sm text-green-600 mt-2">
            <span className="font-semibold">Valid:</span> Pool can be created (non-negative balance required)
          </p>
        ) : (
          <p className="text-sm text-red-600 mt-2">
            <span className="font-semibold">Invalid:</span> Pool cannot be created with negative total balance
          </p>
        )}
      </div>

      <button
        onClick={createPool}
        disabled={totalCB < 0 || processing}
        aria-label="Create pooling agreement"
        title="Create a pooling agreement to share compliance balance among members"
        className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-102 active:scale-98 disabled:transform-none font-medium text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
      >
        {processing ? 'Creating Pool...' : 'Create Pooling Agreement'}
      </button>

      {success && (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded animate-fade-in" role="alert">
          <p className="font-medium">Success</p>
          <p className="text-sm mt-1">{success.replace('✅ ', '')}</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded animate-fade-in" role="alert">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8 animate-fade-in" role="region" aria-label="Pool results">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Pool Distribution Results</h3>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full bg-white" role="table" aria-label="Pool member balance distribution">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ship ID</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <abbr title="Compliance Balance Before Pooling">CB Before</abbr>
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <abbr title="Compliance Balance After Pooling">CB After</abbr>
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <abbr title="Net Change in Balance">Change</abbr>
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {result.map((member, idx) => {
                  const change = member.cbAfter - member.cbBefore;
                  return (
                    <tr key={idx} className="hover:bg-teal-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{member.shipId}</td>
                      <td className={`px-4 py-3 text-right font-mono ${member.cbBefore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {member.cbBefore.toFixed(2)}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono font-semibold ${member.cbAfter >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {member.cbAfter.toFixed(2)}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {change > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800" role="status">
                            + Gained Balance
                          </span>
                        ) : change < 0 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800" role="status">
                            - Contributed Balance
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800" role="status">
                            No Change
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-200">
        <h3 className="font-semibold text-teal-900 mb-2">How Pooling Works</h3>
        <div className="text-sm text-teal-800 space-y-2">
          <div>
            <strong>Purpose:</strong> Pool multiple ships to share compliance balance across the fleet
          </div>
          <div>
            <strong>Mechanism:</strong> Ships with surplus balance help offset deficits in other ships
          </div>
          <div>
            <strong>Requirement:</strong> Total pool balance must be non-negative (≥ 0) to create
          </div>
          <div>
            <strong>Distribution:</strong> Balance is redistributed equally among all pool members
          </div>
          <div>
            <strong>Benefit:</strong> Allows fleet-wide compliance management under Article 21
          </div>
        </div>
      </div>
    </div>
  );
};
