'use client'

import { Chart as ChartJS, ArcElement, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import React from 'react';

// Register necessary chart components
ChartJS.register(ArcElement, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export interface ChartWrapperProps {
  type: 'pie' | 'line' | 'bar';
  title: string;
  data: any; // Chart.js data object
  options?: any;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({ type, title, data, options }) => {
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      title: { display: true, text: title },
    },
    ...options,
  };

  return (
    <div className="relative w-full h-64 glass-card p-4">
      {type === 'pie' && <Doughnut data={data} options={commonOptions} />}
      {type === 'line' && <Line data={data} options={commonOptions} />}
      {type === 'bar' && <Bar data={data} options={commonOptions} />}
    </div>
  );
};
