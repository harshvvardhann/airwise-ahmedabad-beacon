
import React from 'react';

type ErrorStateProps = {
  onRetry: () => void;
};

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-red-500 mb-4 text-center">
        <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold mt-4">Failed to load data</h2>
        <p className="text-gray-600 mt-1">Please try again later or contact support.</p>
      </div>
      <button
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorState;
