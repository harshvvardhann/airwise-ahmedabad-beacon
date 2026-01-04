
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ErrorStateProps = {
  onRetry: () => void;
};

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="glass-card p-8 rounded-xl shadow-lg text-center max-w-md animate-fade-in">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Failed to load data</h2>
        <p className="text-foreground/70 mb-6">
          We're having trouble fetching the latest air quality data. 
          Please try again or check your connection.
        </p>
        <Button 
          onClick={onRetry}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 eco-glow-hover"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Retry</span>
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
