import { DataRecord, QueryFormData } from '@superset-ui/core';
import { DEFAULT_LEGEND_FORM_DATA } from '../constants';

console.log("Render Types");

// Data that will be used by the Chart
export type SpeedometerChartFormData = QueryFormData & {
    metrix: string;
    minValue: number | null;
    maxValue: number | null;
    threshholdRanges?: [ number, number, number, number];
    colorSheme?: string;
    label?: string;
    numberFormat?: string;
    showLabel?: boolean;
    segmentAmt: number;
    segmentControls: any[];     // Dont know what type this will be atm (createe modal?)
    gSegmentAmt: number;
    // segment Values
    s1ChartColor: string;    
    s1Start: number | null;
    s1End: number | null;
    s1IsActive: boolean;
    s2ChartColor: string;
    s2Start: number | null;
    s2End: number | null;
    s2IsActive: boolean;
    s3ChartColor: string;
    s3Start: number | null;
    s3End: number | null;
    s3IsActive: boolean;
    // misc
    controlledSegments: any[]   // Create type for this (interface)
    useSegmentColorData: boolean;
    dataChartColor: string;
    dataChartLineThickness: number;
    outerRadius: number;
    innerRadius: number;
    dataChartThickness: number;     // Thickness that user enters
    chartGap: number;
    segmentChartThickness: number;
    segmentChartOuterRadius: number;
    segmentChartinnerRadius: number;
    backToDefault: boolean;

}

export type RGBA = {r: number, g: number, b: number, a: number };


// Define the strucute for the query data returned by Superset
export interface SpeedometerQueryData {
    data: DataRecord[];
    key: string;
    value: number;
}



// Define the props that the speedometer component will recieve
export interface SpeedometerChartProps {
    width: number;
    height: number;
    data: SpeedometerQueryData[];
    minValue?: number;
    maxValue?: number;
    threshholdRanges?: [ number, number, number, number];
    colorSheme?: string;
    label?: string;
    numberFormat?: string;
    showLabel?: boolean;
    segmentAmt: number;
    segmentControls?: any[];     // Dont know what type this will be atm (createe modal?)
    gSegmentAmt: number;
    s1ChartColor: string;    
    s1Start: number;
    s1End: number;
    s2ChartColor: string;
    s2Start: number;
    s2End: number;
    s3ChartColor: string;
    s3Start: number;
    s3End: number;
    controlledSegments: any[]   // Create type for this (interface)
    useSegmentColorData: boolean;
    dataChartColor: string;
    dataChartLineThickness: number;
    dataChartOuterRadius: number;
    dataChartInnerRadius: number;
    dataChartThickness: number;     // Thickness that user enters
    chartGap: number;
    segmentChartThickness: number;
    segmentChartOuterRadius: number;
    segmentChartinnerRadius: number;
    backToDefault: boolean;

}

// Defines defailt values for the SpeedometerChartFormData (fallback values)
export const DEFAULT_FORM_DATA: Partial<SpeedometerChartFormData> = {
    ...DEFAULT_LEGEND_FORM_DATA,
    minValue: 0,
    maxValue: 100,
    segmentAmt: 6,    
    s1ChartColor: '#02F702',
    s1Start: 0,
    s1End: 50,
    s1IsActive: true,
    s2ChartColor: '#DBA307',
    s2Start: 50,
    s2End: 70,
    s2IsActive: true,
    s3ChartColor: '#DB0707',
    s3Start: 70,
    s3End: 100,
    s3IsActive: true,
    useSegmentColorData: true,
    dataChartColor: '#4caf50',
    dataChartLineThickness: 2,
    dataChartOuterRadius: 190,
    dataChartInnerRadius: 140,
    dataChartThickness: 50,     // Thickness that user enters
    chartGap: 10,
    segmentChartThickness: 10,
    segmentChartOuterRadius: 205,
    segmentChartinnerRadius: 195,
    backToDefault: true,
}

export const USER_FORM_DATA: Partial<SpeedometerChartFormData> = {}

// Transform props for the Speedometer
export interface SpeedometerTransformProps {
    width: number;
    height: number;
    formData: SpeedometerChartFormData;
    queriesData: SpeedometerQueryData[];
}