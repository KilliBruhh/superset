import { t

 } from "@superset-ui/core";
 import {
  sharedControls,
  ControlPanelConfig,
  ControlSubSectionHeader,
} from '@superset-ui/chart-controls';
import { DEFAULT_FORM_DATA } from './types';

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
    ]
}

export default config;               
