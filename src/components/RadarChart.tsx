import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import type { Dimension, Series, ChartStyle } from '../types';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  dimensions: Dimension[];
  series: Series[];
  scaleMin: number;
  scaleMax: number;
  chartStyle: ChartStyle;
  chartRef: React.RefObject<HTMLDivElement>;
}

export default function RadarChart({ dimensions, series, scaleMin, scaleMax, chartStyle, chartRef }: Props) {
  const labels = dimensions.map((d) => d.label);

  const datasets = series.map((ser) => {
    const fillAlpha = chartStyle.fillArea ? ser.fillOpacity : 0;
    return {
      label: ser.name,
      data: dimensions.map((d) => ser.values[d.id] ?? scaleMin),
      backgroundColor: ser.color + Math.round(fillAlpha * 255).toString(16).padStart(2, '0'),
      borderColor: ser.color,
      borderWidth: 2,
      pointBackgroundColor: ser.color,
      pointBorderColor: '#fff',
      pointRadius: chartStyle.showPoints ? 4 : 0,
      pointHoverRadius: chartStyle.showPoints ? 6 : 4,
    };
  });

  const data = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: scaleMin,
        max: scaleMax,
        beginAtZero: true,
        ticks: {
          stepSize: Math.max(1, Math.round((scaleMax - scaleMin) / 5)),
          backdropColor: 'transparent',
          font: { size: 11, family: chartStyle.fontFamily },
        },
        pointLabels: {
          font: { size: 13, weight: 'bold' as const, family: chartStyle.fontFamily },
        },
        grid: {
          color: chartStyle.gridColor,
          lineWidth: chartStyle.gridWidth,
          circular: chartStyle.circular,
        },
        angleLines: {
          color: chartStyle.angleLineColor,
          lineWidth: chartStyle.angleLineWidth,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
          font: { family: chartStyle.fontFamily },
        },
      },
      tooltip: {
        callbacks: {
          title: function () {
            return '';
          },
        },
      },
    },
  };

  if (dimensions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        请至少添加一个维度
      </div>
    );
  }

  return (
    <div ref={chartRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="max-w-lg mx-auto">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}
