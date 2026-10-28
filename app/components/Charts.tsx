"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, type ChartOptions } from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { ChartData } from '@/app/types/security';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const palette = ['#f6b817', '#82b6dc', '#e5d9a9', '#7595ad', '#a4c7d9', '#c98c54', '#bcc8d2', '#c7b17b'];
const tooltip = { backgroundColor: '#103b54', titleColor: '#f5f8fc', bodyColor: '#c2d3e1', padding: 12, cornerRadius: 6 };
const legend = { position: 'bottom' as const, labels: { color: '#c2d3e1', boxWidth: 10, padding: 14, font: { size: 12 } } };
const circularOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: { legend, tooltip },
};

function chartValues(data: ChartData) {
  return data.labels.map((_, i) => {
    const value = data.data?.[i];
    return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0;
  });
}

function DataValues({ data }: { data: ChartData }) {
  const values = chartValues(data);
  return <details className="chart-values"><summary>ดูข้อมูลตัวเลข</summary>
    <dl>{data.labels.map((label, i) => <div key={`${label}-${i}`}><dt>{label}</dt><dd>{values[i].toLocaleString()}</dd></div>)}</dl>
  </details>;
}

export function TopIPsChart({ data }: { data?: ChartData }) {
  if (!data?.labels?.length) return <div className="no-data">No IP data</div>;
  return <><div className="chart-canvas"><Bar role="img" aria-label="Top IP Addresses — ข้อมูลตัวเลขอยู่ด้านล่างกราฟ"
    data={{ labels: data.labels, datasets: [{ label: 'Requests', data: chartValues(data), backgroundColor: '#f6b817', borderRadius: 2 }] }}
    options={{ responsive: true, maintainAspectRatio: false, animation: false, indexAxis: 'y', plugins: { legend: { display: false }, tooltip }, scales: {
      x: { beginAtZero: true, grid: { color: '#285069' }, ticks: { color: '#a7bfd0', precision: 0 } },
      y: { grid: { display: false }, ticks: { color: '#c2d3e1', font: { family: 'monospace', size: 11 } } },
    } }}
  /></div><DataValues data={data} /></>;
}

function circularData(data: ChartData) {
  return { labels: data.labels, datasets: [{ data: chartValues(data), backgroundColor: data.labels.map((_, i) => palette[i % palette.length]), borderColor: '#00243b', borderWidth: 2, hoverOffset: 4 }] };
}

export function CountryChart({ data }: { data?: ChartData }) {
  if (!data?.labels?.length) return <div className="no-data">No country data</div>;
  return <><div className="chart-canvas"><Doughnut role="img" aria-label="Traffic by Country — ข้อมูลตัวเลขอยู่ด้านล่างกราฟ" data={circularData(data)} options={{ ...circularOptions, cutout: '65%' }} /></div><DataValues data={data} /></>;
}

export function DeviceChart({ data }: { data?: ChartData }) {
  if (!data?.labels?.length) return <div className="no-data">No device data</div>;
  return <><div className="chart-canvas"><Pie role="img" aria-label="Traffic by Device — ข้อมูลตัวเลขอยู่ด้านล่างกราฟ" data={circularData(data)} options={{ responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend, tooltip } }} /></div><DataValues data={data} /></>;
}
