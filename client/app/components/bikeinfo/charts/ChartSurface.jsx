import React from 'react';
import { Chart } from 'react-google-charts';
import { buildRows, buildColumns, generateYLabel } from '../summary/athleteDataManip';

import chartBuilder from './chartBuilder';

class ChartSurface extends React.Component {
    constructor(props) {
        super(props);

        let yAxisString = generateYLabel(props.prefersMetric);
        //activities = activities.filter(activity => activity.gear_id === firstBikeId);

        //create date column for chart
        let columns = buildColumns(props.bikes);

        //iterate through ride activities, grab previous rows' data
        let allBikeData = buildRows(props.activities, props.bikes, chartBuilder.distance.rowBuilder(props.prefersMetric) );
        
        //allBikeData = convertMetric(props.metric, allBikeData);
        this.state = { allBikeData, columns, yAxisString };


    }
    render() {
        return (
            <div>

                <h2>Bike Mileage</h2>
                <Chart
                    chartType="AnnotatedTimeLine"
                    columns={this.state.columns}
                    rows={this.state.allBikeData}
                    options={{
                        title: 'Bike Mileage',
                        vAxis: { title: this.state.yAxisString },
                        titleTextStyle: { bold: true, fontSize: 20 },
                        legend: { textStyle: { bold: true } },
                        curveType: 'function',
                        thickness: 3,
                        displayZoomButtons: false
                    }}
                    graph_id="ScatterChart"
                    width="100%"
                    height="400px"
                    legend_toggle
                />
            </div>
        );
    }
}

export default ChartSurface;