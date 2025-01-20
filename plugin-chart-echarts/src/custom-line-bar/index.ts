import { Behavior, t } from "@superset-ui/core";
import { EchartsChartPlugin } from "../types";
import buildQuery from "./buildQuery";
import controlPanel from "./controlPanel";
import thumbnail from "./img/thumbnail.png"
import { LineBarChartFormData } from "./types";
import transformProps from "./transformProps";
export default class LineBarChartPlugin extends EchartsChartPlugin<
    LineBarChartFormData
> {
    constructor() {
        super({
            buildQuery,
            controlPanel,
            loadChart: () => import('./LineBarChart'),
            metadata: {
                behaviors: [
                    Behavior.InteractiveChart,
                    Behavior.DrillToDetail,
                    Behavior.DrillBy,
                  ],
                  category: t('!CUSTOM'),
                  credits: ['Killian Serluppens - ClubIt.BVBA'],
                  description: t(
                    'Chart That will display the data on a Bar and Line '
                  ),
                  exampleGallery: [{url: thumbnail}],
                  name: t('Bar x Line Chart'),
                  tags: [
                    t('Custom'),
                    t('Report'),
                    t('Featured'),
                    t('Buisness'),
                  ],
                thumbnail,
            },
            transformProps
        });
    }
}