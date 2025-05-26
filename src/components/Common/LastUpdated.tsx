
import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from './LoadingSpinner';

interface LastUpdatedProps {
  lastUpdate: Date | null;
  onRefresh?: () => Promise<void> | void;
  autoRefresh?: boolean;
  refreshInterval?: number;
  isLoading?: boolean;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({ 
  lastUpdate, 
  onRefresh, 
  autoRefresh = false, 
  refreshInterval = 300000,
  isLoading = false
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (autoRefresh && onRefresh) {
      const interval = setInterval(() => {
        onRefresh();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, onRefresh, refreshInterval]);

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing && !isLoading) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setTimeout(() => setIsRefreshing(false), 1000);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span>
          Last updated: {lastUpdate ? formatTime(lastUpdate) : 'Never'}
        </span>
      </div>
      
      {onRefresh && (
        <div className="flex items-center gap-2">
          {(isLoading || isRefreshing) ? (
            <LoadingSpinner size="sm" text="" />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default LastUpdated;
