
import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-24 bg-gray-100 rounded"></div>
      </div>
    </div>
  );
};

export default LoadingState;
