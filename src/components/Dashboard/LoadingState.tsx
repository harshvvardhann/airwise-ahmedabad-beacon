
import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center py-16 px-4">
      <div className="animate-pulse flex flex-col items-center glass-card p-8 rounded-xl shadow-lg">
        <div className="h-14 w-14 rounded-full bg-primary/20 mb-6 animate-spin border-2 border-t-primary border-r-primary/50 border-b-primary/30 border-l-transparent"></div>
        <div className="h-6 w-64 bg-accent/10 rounded-md mb-3"></div>
        <div className="h-4 w-48 bg-accent/5 rounded-md"></div>
        <div className="mt-6 grid grid-cols-3 gap-4 w-full">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-accent/5 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
