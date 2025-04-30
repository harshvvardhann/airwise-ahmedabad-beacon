
import React from 'react';
import { AirQualityData, Pollutant } from '@/types/air-quality';
import { pollutantInfo } from '@/utils/helpers';
import AQICard from '@/components/Dashboard/AQICard';
import PollutantCard from '@/components/Dashboard/PollutantCard';

type AirQualityOverviewProps = {
  data: AirQualityData | null;
};

const AirQualityOverview = ({ data }: AirQualityOverviewProps) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <div className="md:col-span-1">
        <AQICard data={data} />
      </div>
      <div className="md:col-span-1 lg:col-span-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.keys(pollutantInfo).map((key) => (
            <PollutantCard
              key={key}
              pollutant={key as Pollutant}
              value={data.measurements[key as Pollutant]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AirQualityOverview;
