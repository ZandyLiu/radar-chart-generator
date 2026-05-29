import type { Palette } from '../types';

export const palettes: Palette[] = [
  {
    name: '学术蓝',
    colors: ['#1E40AF', '#0D9488', '#059669', '#7C3AED', '#0891B2', '#475569'],
  },
  {
    name: '对比色',
    colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
  },
  {
    name: '柔和色',
    colors: ['#F472B6', '#FB923C', '#FBBF24', '#A3E635', '#2DD4BF', '#A78BFA'],
  },
  {
    name: '经典色',
    colors: ['#000000', '#4B5563', '#1E40AF', '#B91C1C', '#047857', '#6D28D9'],
  },
  {
    name: '商务色',
    colors: ['#1E3A8A', '#3B82F6', '#06B6D4', '#64748B', '#94A3B8', '#CBD5E1'],
  },
  {
    name: '自然色',
    colors: ['#166534', '#92400E', '#EA580C', '#CA8A04', '#0891B2', '#4D7C0F'],
  },
];

export const FONT_OPTIONS = [
  { label: '系统默认 (System)', value: 'system-ui, -apple-system, sans-serif' },
  { label: '思源黑体 (Noto Sans SC)', value: '"Noto Sans SC", sans-serif' },
  { label: '思源宋体 (Noto Serif SC)', value: '"Noto Serif SC", serif' },
  { label: '宋体 (SimSun)', value: '"SimSun", "Songti SC", serif' },
  { label: '微软雅黑 (YaHei)', value: '"Microsoft YaHei", "PingFang SC", sans-serif' },
  { label: '苹方 (PingFang)', value: '"PingFang SC", "Hiragino Sans GB", sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
];
