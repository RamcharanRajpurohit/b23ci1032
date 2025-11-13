import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-300 rounded ${className}`}></div>
);

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 8 
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white">
      <thead>
        <tr className="bg-gray-200">
          {Array.from({ length: columns }).map((_, idx) => (
            <th key={idx} className="px-4 py-2">
              <Skeleton className="h-4 w-full" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <tr key={rowIdx} className="border-b">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <td key={colIdx} className="px-4 py-2">
                <Skeleton className="h-4 w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <Skeleton className="h-8 w-64 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4 mb-4" />
    <Skeleton className="h-32 w-full mb-4" />
    <Skeleton className="h-10 w-32" />
  </div>
);
