
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Zap, Leaf } from 'lucide-react';

interface EmissionMetricsGridProps {
  forecastedEmission: number;
}

const EmissionMetricsGrid = ({ forecastedEmission }: EmissionMetricsGridProps) => {
  const metrics = [
    {
      title: 'Forecasted Emission',
      value: `${forecastedEmission} tons`,
      change: '+8.3%',
      changeType: 'increase' as const,
      icon: TrendingUp,
      description: 'Next 24 hours'
    },
    {
      title: 'Emission Target',
      value: '4.0 tons',
      change: '-23.1%',
      changeType: 'decrease' as const,
      icon: Target,
      description: 'Daily limit'
    },
    {
      title: 'Energy Efficiency',
      value: '76%',
      change: '+5.2%',
      changeType: 'increase' as const,
      icon: Zap,
      description: 'Current efficiency'
    },
    {
      title: 'Carbon Offset',
      value: '2.1 tons',
      change: '+12.4%',
      changeType: 'increase' as const,
      icon: Leaf,
      description: 'This month'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="eco-card border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span className="flex items-center">
                <metric.icon className="h-4 w-4 mr-2" />
                {metric.title}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">
                {metric.value}
              </div>
              <div className="flex items-center justify-between">
                <span 
                  className={`text-xs font-medium ${
                    metric.changeType === 'increase' 
                      ? metric.title === 'Forecasted Emission' 
                        ? 'text-red-400' 
                        : 'text-green-400'
                      : 'text-green-400'
                  }`}
                >
                  {metric.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  {metric.description}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmissionMetricsGrid;
