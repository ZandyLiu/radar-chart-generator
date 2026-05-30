import type { Preset } from '../types';

export const presets: Preset[] = [
  {
    name: 'Ability Assessment',
    description: 'Personal ability radar chart',
    dimensions: ['Technical', 'Communication', 'Leadership', 'Execution', 'Learning', 'Teamwork'],
    series: [
      { name: 'Self', color: '#3B82F6', values: [85, 70, 60, 80, 90, 75] },
      { name: 'Target', color: '#EF4444', values: [90, 85, 80, 90, 95, 85] },
    ],
  },
  {
    name: 'Product Comparison',
    description: 'Multi-product feature comparison',
    dimensions: ['Price', 'Performance', 'Usability', 'Features', 'Support', 'Brand'],
    series: [
      { name: 'Product A', color: '#3B82F6', values: [70, 90, 85, 80, 65, 75] },
      { name: 'Product B', color: '#10B981', values: [85, 75, 70, 90, 80, 85] },
      { name: 'Product C', color: '#F59E0B', values: [60, 80, 90, 75, 90, 70] },
    ],
  },
  {
    name: 'Sports Ability',
    description: 'Athlete ability analysis',
    dimensions: ['Speed', 'Strength', 'Endurance', 'Flexibility', 'Explosive', 'Coordination'],
    series: [
      { name: 'Athlete', color: '#8B5CF6', values: [80, 70, 85, 60, 90, 75] },
    ],
  },
  {
    name: 'Project Evaluation',
    description: 'Project multi-dimension health evaluation',
    dimensions: ['Progress', 'Quality', 'Budget', 'Morale', 'Risk', 'Satisfaction'],
    series: [
      { name: 'Current', color: '#EC4899', values: [75, 80, 60, 70, 55, 85] },
    ],
  },
];
