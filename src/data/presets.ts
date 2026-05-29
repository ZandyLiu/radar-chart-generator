import type { Preset } from '../types';

export const presets: Preset[] = [
  {
    name: '能力评估',
    description: '个人综合能力雷达图',
    dimensions: ['技术能力', '沟通表达', '领导力', '执行力', '学习能力', '团队协作'],
    series: [
      { name: '自评', color: '#3B82F6', values: [85, 70, 60, 80, 90, 75] },
      { name: '期望目标', color: '#EF4444', values: [90, 85, 80, 90, 95, 85] },
    ],
  },
  {
    name: '产品对比',
    description: '多产品功能对比',
    dimensions: ['价格', '性能', '易用性', '功能丰富度', '售后服务', '品牌口碑'],
    series: [
      { name: '产品A', color: '#3B82F6', values: [70, 90, 85, 80, 65, 75] },
      { name: '产品B', color: '#10B981', values: [85, 75, 70, 90, 80, 85] },
      { name: '产品C', color: '#F59E0B', values: [60, 80, 90, 75, 90, 70] },
    ],
  },
  {
    name: '运动能力',
    description: '运动员能力分析',
    dimensions: ['速度', '力量', '耐力', '柔韧性', '爆发力', '协调性'],
    series: [
      { name: '运动员', color: '#8B5CF6', values: [80, 70, 85, 60, 90, 75] },
    ],
  },
  {
    name: '项目评估',
    description: '项目多维度健康度评估',
    dimensions: ['进度', '质量', '预算', '团队士气', '风险控制', '客户满意度'],
    series: [
      { name: '当前状态', color: '#EC4899', values: [75, 80, 60, 70, 55, 85] },
    ],
  },
];
