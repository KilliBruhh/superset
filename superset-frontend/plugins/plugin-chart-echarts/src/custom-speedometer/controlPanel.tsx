import { t } from '@superset-ui/core';
import {
  sharedControls,
  ControlPanelConfig,
  ControlSubSectionHeader,
} from '@superset-ui/chart-controls';
import { DEFAULT_FORM_DATA } from './types';
import { renderSegmentControls } from './transformProps'
console.log("Render ControlPanel")


const config: ControlPanelConfig = {
  controlPanelSections: [

    {
      label: t('Query'),
      expanded: false,
      controlSetRows: [
        [
          {
            name: 'groupby',
            config: {
              ...sharedControls.groupby,
              description: t('Colums to group by')    
            }
          },
        ],
        ['metric'],
        ['adhoc_filters'],
        [
          {
            name: 'row_limit',
            config: {
              ...sharedControls.row_limit,
              
            }
          }
        ],
      ],
    },
    {
      label: t('Gauge Settings'), // New section label
      expanded: true,
      controlSetRows: [
        [<ControlSubSectionHeader>{t('General')}</ControlSubSectionHeader>],
        [
          {
            name: 'minValue',
            config: {
              type: 'TextControl',
              isInt: true,
              default: DEFAULT_FORM_DATA.minValue || 0,
              renderTrigger: true,
              label: t('Min'),
              description: t('Minimum value on the gauge axis'),
            },
          },
          {
            name: 'maxValue',
            config: {
              type: 'TextControl',
              isInt: true,
              default: DEFAULT_FORM_DATA.maxValue,
              renderTrigger: true,
              label: t('Max'),
              description: t('Maximum value on the gauge axis'),
            },
          },
        ],
        [<ControlSubSectionHeader>{t('Segement 1')}</ControlSubSectionHeader>],
        [
          {
            name: 's1ChartColor', // Unique name for the control
            config: {
              type: 'ColorPickerControl', // Type set to ColorPickerControl
              default: DEFAULT_FORM_DATA.s1ChartColor,
              renderTrigger: true,
              label: t('Chart Color'), // Label for the control
              description: t('Select the color for the chart'), // Description
            },
          },
          {
            name: 's1IsActive',
            config: {
              type: 'CheckboxControl',
              label: t('Enable this Segment'),
              default: DEFAULT_FORM_DATA.s1IsActive,
              description: t('Check this to activate this segment, uncheck it to disable the segment'),
            }
          },        
        ],
        [
          {
            name: 's1Start',
            config: {
              type: 'TextControl',
              isInt: true,
              default: DEFAULT_FORM_DATA.s1Start || 0,
              renderTrigger: true,
              label: t('Start'),
              description: t('Start value of the first Segment'),
            },
          },
          {
            name: 's1End',
            config: {
              type: 'TextControl',
              isInt: true,
              default: DEFAULT_FORM_DATA.s1End,
              renderTrigger: true,
              label: t('End'),
              description: t('The Ending degrees of the first segment'),
            }
          },     
        ],               
        [<ControlSubSectionHeader>{t('Segment 2')}</ControlSubSectionHeader>],
        [
          {
            name: 's2ChartColor', // Unique name for the control
            config: {
              type: 'ColorPickerControl', // Type set to ColorPickerControl
              default: DEFAULT_FORM_DATA.s2ChartColor,
              renderTrigger: true,
              label: t('Chart Color'), // Label for the control
              description: t('Select the color for the Second chart'), // Description
            },
          },
          {
            name: 's2IsActive',
            config: {
              type: 'CheckboxControl',
              label: t('Enable this Segment'),
              default: DEFAULT_FORM_DATA.s2IsActive,
              description: t('Check this to activate this segment, uncheck it to disable the segment'),
            }
          },
        ],
        [         
          {
            name: 's2Start',
            config: {
              type: 'TextControl',
              isInt: true,
              default: DEFAULT_FORM_DATA.s2Start,
              renderTrigger: true,
              label: t('Start'),
              description: t('Start value of the Second Segment'),
            },
          },
          {
            name: 's2End',
            config: {
              type: 'TextControl',
              isInt: true,
              default: DEFAULT_FORM_DATA.s2End,
              renderTrigger: true,
              label: t('End'),
              description: t('The Ending degrees of the Second segment'),
            }
          },
        ],               
        [<ControlSubSectionHeader>{t('Segement 3')}</ControlSubSectionHeader>],
        [
          {
            name: 's3ChartColor', // Unique name for the control
            config: {
              type: 'ColorPickerControl', // Type set to ColorPickerControl
              default: DEFAULT_FORM_DATA.s3ChartColor,
              renderTrigger: true,
              label: t('Chart Color'), // Label for the control
              description: t('Select the color for the Third chart'), // Description
            },
          },
          {
            name: 's3IsActive',
            config: {
              type: 'CheckboxControl',
              label: t('Enable this Segment'),
              default: DEFAULT_FORM_DATA.s3IsActive,
              description: t('Check this to activate this segment, uncheck it to disable the segment'),
            }
          },
        ],
        [      
          {
            name: 's3Start',
            config: {
              type: 'TextControl',
              isInt: true,
              default: DEFAULT_FORM_DATA.s3Start,
              renderTrigger: true,
              label: t('Start'),
              description: t('Start value of the Third Segment'),
            },
          },
          {
            name: 's3End',
            config: {
              type: 'TextControl',
              isInt: true,
              default: DEFAULT_FORM_DATA.s3End,
              renderTrigger: true,
              label: t('End'),
              description: t('The Ending degrees of the Third segment'),
            }
          },
        ],
        [<ControlSubSectionHeader>{t('Color Data Chart')}</ControlSubSectionHeader>],            
        [  
          {
            name: 'useSegmentColorData',
            config: {
              type: 'CheckboxControl',
              label: t('Use Segment Color'),
              description: 'Select if you want to use the color of the active segment',
              default: DEFAULT_FORM_DATA.useSegmentColorData
            },
          },
        ],
        [
          {
            name: 'dataChartColor',
            config: {
              type: 'ColorPickerControl', 
              default: DEFAULT_FORM_DATA.dataChartColor,
              renderTrigger: true,
              label: t('Data Chart Color (uncheck default)'),
              description: t('Select the color for the Data chart'),
            }
          }
        ],
        [
          {
            name: 'dataChartLineThickness',
            config: {
              type: 'TextControl',
              isInt: true,
              default: DEFAULT_FORM_DATA.dataChartLineThickness,
              label: t('Choose the border line thicknes'),          
            }
          },
        ],
        [<ControlSubSectionHeader>{t('Data Chart Thickness')}</ControlSubSectionHeader>],
        [
          {
            name: 'dataChartThickness',
            config: {
              type: 'TextControl',
              isInt: true,
              default: DEFAULT_FORM_DATA.dataChartThickness,
              label: t('Choose the Charts Thickness'),         
              renderTrigger: true 
            }
          },
          
        ],
        [<ControlSubSectionHeader>{ t('Default Options') }</ControlSubSectionHeader>],
        [
          {
            name: 'backToDefault',
            config: {
              type: 'CheckboxControl',
              label: t('Use Default Data?'),
              description: 'Select if you want to use the color of the active segment',
              default: true,
            }
          }
        ],
    ]}
  ]
}

export default config;               
