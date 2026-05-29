export interface Dimension {
  id: string;
  label: string;
}

export interface Series {
  id: string;
  name: string;
  color: string;
  fillOpacity: number;
  values: Record<string, number>;
}

export interface Preset {
  name: string;
  description: string;
  dimensions: string[];
  series: { name: string; color: string; values: number[] }[];
}

export interface ChartStyle {
  circular: boolean;
  fillArea: boolean;
  showPoints: boolean;
  fontFamily: string;
  gridColor: string;
  gridWidth: number;
  angleLineColor: string;
  angleLineWidth: number;
}

export interface Snapshot {
  dimensions: Dimension[];
  series: Series[];
  scaleMin: number;
  scaleMax: number;
  chartStyle: ChartStyle;
}

export interface Palette {
  name: string;
  colors: string[];
}
