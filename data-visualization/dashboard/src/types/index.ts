
export interface StatData {
  id: string;
  label: string;
  value: number;
  change: number;
  icon: string;
  color: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string | string[];
  tension?: number;
  fill?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

