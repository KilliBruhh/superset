import { DataRecord, QueryFormData } from '@superset-ui/core';
import { DEFAULT_LEGEND_FORM_DATA } from '../constants';

export type LineBarChartFormData = QueryFormData & {
    metrix: string; // Ensure this is correctly typed
    minValue: number | null;
    maxValue: number | null;
    threshholdRanges?: [number, number, number, number];
    colorSheme?: string;
    label?: string;
    numberFormat?: string;
    showLabel?: boolean;
};


export interface LineBarChartQueryData {
    data: DataRecord[];
    key: string;
    value: number;
}

export interface LineBarChartProps {
    width: number;
    height: number;
    data: LineBarChartQueryData[];
    minValue?: number;
    maxValue?: number;
    colorSheme?: string;
    label?: string;
    numberFormat?: string;
    showLabel?: boolean;
}

export const DEFAULT_FORM_DATA: Partial<LineBarChartFormData> = {
    ...DEFAULT_LEGEND_FORM_DATA,
    minValue: 0,
    maxValue: 100,
}
export interface LineBarTransformProps {
    width: number;
    height: number;
    formData: LineBarChartFormData;
    queriesData: LineBarChartQueryData[];
}
