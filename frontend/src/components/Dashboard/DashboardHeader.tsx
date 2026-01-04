
import React from 'react';

type DashboardHeaderProps = {
  title: string;
  subtitle: string;
};

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{title}</h1>
      <p className="text-foreground/80 text-lg font-light">{subtitle}</p>
    </div>
  );
};

export default DashboardHeader;
