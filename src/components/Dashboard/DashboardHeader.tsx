
import React from 'react';

type DashboardHeaderProps = {
  title: string;
  subtitle: string;
};

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
      <p className="text-gray-600 text-lg">{subtitle}</p>
    </div>
  );
};

export default DashboardHeader;
