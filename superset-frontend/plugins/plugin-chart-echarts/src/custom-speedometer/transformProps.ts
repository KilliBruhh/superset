import { DEFAULT_FORM_DATA, USER_FORM_DATA, SpeedometerTransformProps, SpeedometerChartFormData, RGBA } from "./types";
import { t } from "@superset-ui/core";


const calculatePercentage = (min: number, max: number, value: any): number => {
    if (max === min) {
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

// Turn color from rgba to Hex
export function rgbaToHex(color: RGBA | string): string {
    if (typeof color === 'string' && /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(color)) {
        return color;
    }

    const { r, g, b, a } = color as RGBA

    const redHex = r.toString(16).padStart(2, '0');
    const greenHex = g.toString(16).padStart(2, '0');
    const blueHex = b.toString(16).padStart(2, '0');
    const alphaHex = (Math.round(a * 255)).toString(16).padStart(2, '0');

    return a === 1 ? `#${redHex}${greenHex}${blueHex}` : `#${redHex}${greenHex}${blueHex}${alphaHex}`;
}

// Turn color from Hex to rgba
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

    return { r, g, b, a: alpha };
}

// Calculates the thicknes off the DATA chart
export function calculateThickness(thicknes: number, innerRData: number) {
    const outerDataChart = innerRData + thicknes;
    const innerSegmentChart = outerDataChart + DEFAULT_FORM_DATA.chartGap!;
    const outerSegmentChart = innerSegmentChart + DEFAULT_FORM_DATA.segmentChartThickness!;
    return [outerDataChart, innerSegmentChart, outerSegmentChart]
}

function checkIfStartIsGreaterThanEnd(start: number, end: number) {
    // Use more descriptive parameter names
    if (start > end) {
        return { start: end, end: start }; // Return swapped values if start is greater than end
    }
    return { start, end }; // Otherwise return as is
}



export function renderDynamicControls(formData: any) {
    return {
        name: `text_control_Function`,
        config: {
            type: 'TextControl',
            label: t(`Text Field Function `),
            renderTrigger: true,
            default: '',
        },
    };
}

export const renderSegmentControls = ((amt: any | undefined, type: string) => {
    amt = amt ?? DEFAULT_FORM_DATA.segmentAmt;
    return {
        name: `text_control_ArrowFunction`,
        config: {
            type: 'TextControl',
            label: t(`Text Field Arrow: ${amt}`),
            renderTrigger: true,
            default: '',
        },
    }
});

// -- Segment Functions
// -- Segment Functions
// Enable/Disable the Segment based on checkbox status
export function checkSegmentStatus(formData: Partial<SpeedometerChartFormData>) {
    // Helper function to reset a segment
    const temp_formdata = formData;

    const resetSegment = (segment: string) => {
        temp_formdata[`${segment}Start`] = 0;
        temp_formdata[`${segment}End`] = 0;
    };

    // All segments inactive
    if (!formData.s1IsActive && !formData.s2IsActive && !formData.s3IsActive) {
        resetSegment('s1');
        resetSegment('s2');
        resetSegment('s3');
    } 
    // Only S1 active
    else if (formData.s1IsActive && !formData.s2IsActive && !formData.s3IsActive) {
        resetSegment('s2');
        resetSegment('s3');
    } 
    // Only S2 active
    else if (!formData.s1IsActive && formData.s2IsActive && !formData.s3IsActive) {
        resetSegment('s1');
        resetSegment('s3');
    } 
    // Only S3 active
    else if (!formData.s1IsActive && !formData.s2IsActive && formData.s3IsActive) {
        resetSegment('s1');
        resetSegment('s2');
    } 
    // S1 and S2 active, S3 inactive
    else if (formData.s1IsActive && formData.s2IsActive && !formData.s3IsActive) {
        temp_formdata.s2End = formData.s3Start
        resetSegment('s3');
    } 
    // S1 and S3 active, S2 inactive
    else if (formData.s1IsActive && !formData.s2IsActive && formData.s3IsActive) {
        resetSegment('s2');
    } 
    // S2 and S3 active, S1 inactive
    else if (!formData.s1IsActive && formData.s2IsActive && formData.s3IsActive) {
        resetSegment('s1');
    } 

    return temp_formdata;
}

export function checkNoOfverlapping(segments: { color: string; start: number; end: number; name: string }[], bool: boolean) {
    if (bool) {
        return segments
    } else {
        const segmentEnd = segments.length;
        for (let i = 0; i < segmentEnd - 1; i++) {
            if (segments[i].end > segments[i + 1].start) {
                segments[i].end = segments[i + 1].start; // Prevent overlap
            }
            if (segments[i].start > segments[i + 1].start) {
                segments[i].start = 0;
                segments[i].end = 0; // Reset if out of order
            }
        }
        return segments;
    }
}
export function configureSegmentCharts(formData: any, bool: boolean) {
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
        { color: s1ChartColor, end: s1End, start: s1Start, name: 's1' },
        { color: s2ChartColor, end: s2End, start: s2Start, name: 's2' },
        { color: s3ChartColor, end: s3End, start: s3Start, name: 's3' },
    ]

    var controlledSegments = checkNoOfverlapping(segmentarray, bool)

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
// --- End Segment Functions
// --- End Segment Functions

export function checkDataChartColorOption(useDefault: boolean, segmentChartData: any, currentValue: number, userPickedColor: string) {
    if (useDefault) {
        for (let i = 0; i < segmentChartData.length; i++) {
            if (currentValue <= segmentChartData[i].end) { // Check if progress is in segment i
                return segmentChartData[i].color
            } else if (currentValue >= 100) {     // If progress is above 100% set the color the the latsts segment's color
                return segmentChartData[2].color
            }
        }
    } else {
        // Use User inp
        return rgbaToHex(userPickedColor); // Converts the RGBA code to Hex
    }
}

// Set the ControlPanel Options to the Default Values
export function getDefaultOptions(formData: Partial<SpeedometerChartFormData>) {
    saveUserOptions(formData)
    return { ...DEFAULT_FORM_DATA }
}

// Set the ControlPanel Option to the users selected values
export function getUserOptions(formData: Partial<SpeedometerChartFormData>) {
    saveUserOptions(formData)
    return { ...USER_FORM_DATA }
}

// Save the options the user has set
export function saveUserOptions(formData: Partial<SpeedometerChartFormData>) {
    Object.assign(USER_FORM_DATA, formData)
}




export default function transformProps(chartProps: SpeedometerTransformProps) {
    var { width, height, formData, queriesData } = chartProps;
    var { metric } = formData;

    // formData = formData.backToDefault ? getDefaultOptions(formData) : getUserOptions()
    // formData = formData.backToDefault ? getDefaultOptions(formData) as SpeedometerChartFormData : getUserOptions() as SpeedometerChartFormData;

    var segmentChartFormData = configureSegmentCharts(formData, true)

    if (formData.s1IsActive && formData.s2IsActive && formData.s3IsActive) {
        segmentChartFormData = configureSegmentCharts(formData, false)
    } else {
        formData = checkSegmentStatus(formData) as SpeedometerChartFormData;
        segmentChartFormData = configureSegmentCharts(formData, true)
    }


    if (formData.backToDefault) {
        formData = getDefaultOptions(formData) as SpeedometerChartFormData
    } else {
        formData = getUserOptions(formData) as SpeedometerChartFormData

    }

    // Ensure there's data
    var data = queriesData[0]?.data || [];
    var metricLabel = metric.label;

    var metricValue = data[0][metricLabel];

    // Get min and max from formData / fall back to defaults
    var minVal = formData.minValue ?? DEFAULT_FORM_DATA.minValue ?? 0;
    var maxVal = formData.maxValue ?? DEFAULT_FORM_DATA.maxValue ?? 100;

    // Calculate actual percentage based on dataset, mn and max values
    var progress = calculatePercentage(minVal, maxVal, metricValue);
    // progress = 70

    // Segements 2nd arch
    var segmentAmount = formData.segmentAmt ?? DEFAULT_FORM_DATA.segmentAmt ?? 0;

    // var segmentChartFormData = configureSegmentCharts(formData)
    var dataChartColor = checkDataChartColorOption(formData.useSegmentColorData, segmentChartFormData.controlledSegments, progress, formData.dataChartColor)
    var dataChartLineThickness = formData.dataChartLineThickness


    var [dataChartOuterRadius, segmentChartInnerRadius, segmentChartOuterRadius] = calculateThickness(formData.dataChartThickness, DEFAULT_FORM_DATA.dataChartInnerRadius!);
    var dataChartInnerRadius = DEFAULT_FORM_DATA.dataChartInnerRadius ?? 140


    // progress = 86        // Test Value
    console.log("FINAL FORMDATA: \n",segmentChartFormData.controlledSegments);

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
        dataChartInnerRadius: dataChartInnerRadius,
        dataChartOuterRadius: dataChartOuterRadius,
        segmentChartInnerRadius: segmentChartInnerRadius,
        segmentChartOuterRadius: segmentChartOuterRadius,
    };
}
