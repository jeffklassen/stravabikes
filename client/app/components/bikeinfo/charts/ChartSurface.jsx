import React from 'react';
import { Chart } from 'react-google-charts';
import { buildRows, buildColumns, generateYLabel } from '../summary/athleteDataManip';

import chartBuilders from './chartBuilders';

const ChartChooser = ({ onChange, chartBuilders, currChart }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };
    return (
        <select className="form-control" value={currChart.id} onChange={handleChange.bind(null)}>
            {
                chartBuilders.map(o => {
                    return <option key={o.id} value={o.id}>{o.label}</option>;
                })
            }

        </select>
    );
}

class ChartSurface extends React.Component {
    constructor(props) {
        super(props);

        let yAxisString = generateYLabel(props.prefersMetric);
        //activities = activities.filter(activity => activity.gear_id === firstBikeId);

        //create date column for chart
        let columns = buildColumns(props.bikes);


        //allBikeData = convertMetric(props.metric, allBikeData);
        this.state = {chart: chartBuilders[0], columns, yAxisString };


    }
    onChange(newChartId) {
        let newChart = chartBuilders
            .reduce((reducer, chart) => chart.id === newChartId ? chart : reducer, {});
        this.setState({ chart: newChart });
    }
    render() {
        //iterate through ride activities, grab previous rows' data
        let allBikeData = buildRows(this.props.activities, this.props.bikes, this.state.chart.rowBuilder(this.props.prefersMetric));

        return (
            <div>
                <ChartChooser
                    onChange={this.onChange.bind(this)}
                    chartBuilders={chartBuilders}
                    currChart={this.state.chart}
                />
                <h2 style={{cursor:"pointer"}}>{this.state.chart.label}</h2><i class="fa fa-info-circle" aria-hidden="true"></i>
                <Chart
                    chartType="AnnotatedTimeLine"
                    columns={this.state.columns}
                    rows={allBikeData}
                    options={{
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