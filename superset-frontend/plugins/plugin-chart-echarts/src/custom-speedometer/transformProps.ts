import { func } from "prop-types";
import { DEFAULT_FORM_DATA, SpeedometerTransformProps } from "./types";

type RGBA = {r: number, g: number, b: number, a: number };

const calculatePercentage = (min: number, max: number, value: any): number => {
    if(max === min) {
        return 0;
    }

    let percentage = ((value - min) / (max - min)) * 100;
    
    percentage = parseFloat(percentage.toFixed(2));

    // Ensure percentage does notfall below 0%
    if (percentage < 0) {
        percentage = 0;
    }

    return percentage;
}

export function rgbaToHex(color: RGBA | string): string {    
    if (typeof color === 'string' && /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(color)) {
        return color;
    }

    const {r, g, b, a }= color as RGBA

    const redHex = r.toString(16).padStart(2, '0');
    const greenHex = g.toString(16).padStart(2, '0');
    const blueHex = b.toString(16).padStart(2, '0');
    const alphaHex = (Math.round(a * 255)).toString(16).padStart(2, '0');

    return a === 1 ? `#${redHex}${greenHex}${blueHex}` : `#${redHex}${greenHex}${blueHex}${alphaHex}`;
}

export function hexToRgba(hex: any): { r: number, g: number, b: number, a: number } {
    var alpha: number = 100
    // Remove the hash if it's there
    hex = hex.replace(/^#/, '');
    // If shorthand hex (e.g., #abc), expand it to full form (e.g., #aabbcc)
    if (hex.length === 3) {
        hex = hex.split('').map((char: any) => char + char).join('');
    }
    // Ensure the hex code is valid
    if (!/^[A-Fa-f0-9]{6}$/.test(hex)) {
        throw new Error('Invalid hex color');
    }
    // Extract the red, green, and blue components
    var r = parseInt(hex.slice(0, 2), 16);
    var g = parseInt(hex.slice(2, 4), 16);
    var b = parseInt(hex.slice(4, 6), 16);

    r = 0
    b = 255
    g = 0            
        
        

    console.log(hex, r,g,b,alpha)

    return { r, g, b, a: alpha };
}

function checkIfStartIsGreaterThanEnd(start: number, end: number) {
    // Use more descriptive parameter names
    if (start > end) {
        return { start: end, end: start }; // Return swapped values if start is greater than end
    }
    return { start, end }; // Otherwise return as is
}

export function checkNoOfverlapping(segment :  {color:string; end: number; start: number }[]) {
    const segmentEnd = segment.length;
    for (let i = 0; i <= 2; i++) {
        if(i === segmentEnd-1) {
            if(segment[i].end > 100) {  
            segment[i].end = 100
                break;
            } else {
                break;
            }
        }
        else if(segment[i].end > segment[i+1].start) {
            segment[i].end = segment[i+1].start
        }
        if (segment[i].start > segment[i + 1].start) {
            segment[i].start = 0
            segment[i].end = 0
        }   
    }    
    return segment
}


export function configureSegmentCharts(formData:any) {
   // Process colors with fallback to default
   const s1ChartColor = rgbaToHex(formData.s1ChartColor) ?? DEFAULT_FORM_DATA.s1ChartColor;
   
    // Destructure and rename for clarity
   const { start: s1Start, end: s1End } = checkIfStartIsGreaterThanEnd(
       formData.s1Start ?? DEFAULT_FORM_DATA.s1Start ?? 0,
       formData.s1End ?? DEFAULT_FORM_DATA.s1End ?? 0
   );

   const s2ChartColor = rgbaToHex(formData.s2ChartColor) ?? DEFAULT_FORM_DATA.s2ChartColor;
   const { start: s2Start, end: s2End } = checkIfStartIsGreaterThanEnd(
       formData.s2Start ?? DEFAULT_FORM_DATA.s2Start ?? 0,
       formData.s2End ?? DEFAULT_FORM_DATA.s2End ?? 0
   );

   const s3ChartColor = rgbaToHex(formData.s3ChartColor) ?? DEFAULT_FORM_DATA.s3ChartColor;
   const { start: s3Start, end: s3End } = checkIfStartIsGreaterThanEnd(
       formData.s3Start ?? DEFAULT_FORM_DATA.s3Start ?? 0,
       formData.s3End ?? DEFAULT_FORM_DATA.s3End ?? 0
   );

   const segmentarray = [
    {color: s1ChartColor, end: s1End,  start: s1Start, name: 's1'},
    {color: s2ChartColor, end: s2End,  start: s2Start, name: 's2'},
    {color: s3ChartColor, end: s3End,  start: s3Start, name: 's3'},
   ]

    var controlledSegments =  checkNoOfverlapping(segmentarray)        


    return {
        s1ChartColor,
        s1Start,
        s1End,
        s2ChartColor,
        s2Start,
        s2End,
        s3ChartColor,
        s3Start,
        s3End,
        controlledSegments,
    };
}

export function checkDataChartColorOption(useDefault: boolean, segmentChartData : any, currentValue: number, userPickedColor:string) {
    if(useDefault) {
        console.log(segmentChartData.length)
        for(let i = 0; i<segmentChartData.length; i++) {
            if(currentValue <= segmentChartData[i].end) { // Check if progress is in segment i
                return segmentChartData[i].color
            } else if(currentValue >= 100) {     // If progress is above 100% set the color the the latsts segment's color
                return segmentChartData[2].color
            }
        }
    } else {
        // Use User input
        return rgbaToHex(userPickedColor); // Converts the RGBA code to Hex
    }
}

export default function transformProps(chartProps: SpeedometerTransformProps) {
    const { width, height, formData, queriesData } = chartProps;
    const { metric } = formData;

    // Ensure there's data
    const data = queriesData[0]?.data || [];
    const metricLabel = metric.label;

    const metricValue = data[0][metricLabel];

    // Get min and max from formData / fall back to defaults
    const minVal = formData.minValue ?? DEFAULT_FORM_DATA.minValue ?? 0;
    const maxVal = formData.maxValue ?? DEFAULT_FORM_DATA.maxValue ?? 100;

    // Calculate actual percentage based on dataset, mn and max values
    var progress = calculatePercentage(minVal, maxVal, metricValue); 
    // progress = 70

    // Segements 2nd arch
    const segmentAmount = formData.segmentAmt ?? DEFAULT_FORM_DATA.segmentAmt ?? 0;
    
    const segmentChartFormData = configureSegmentCharts(formData)        
    const dataChartColor = checkDataChartColorOption(formData.useSegmentColorData, segmentChartFormData.controlledSegments, progress, formData.dataChartColor)
    const dataChartLineThickness = formData.dataChartLineThickness

    const outerRadius = formData.outerRadius || DEFAULT_FORM_DATA.outerRadius;
    const innerRadius = formData.innerRadius || DEFAULT_FORM_DATA.innerRadius;

    // progress = 86        // Test Value

    return {
        width,
        height,
        minValue: minVal,
        maxValue: maxVal,
        progress: progress,
        segmentAmt: segmentAmount,
        controlledSegments: segmentChartFormData.controlledSegments,
        dataChartColor: dataChartColor,
        dataChartLineThickness: dataChartLineThickness,
        outerRadius: outerRadius,
        innerRadius: innerRadius,
    };
}
