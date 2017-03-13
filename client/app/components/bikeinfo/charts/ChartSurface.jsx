import React from 'react';
import { Chart } from 'react-google-charts';
import { buildRows, buildColumns, generateYLabel } from '../summary/athleteDataManip';
import ChartChooser from './ChartChooser.jsx';

import chartBuilders from './chartBuilders';



class ChartSurface extends React.Component {
    constructor(props) {
        super(props);

        //create date column for chart
        let columns = buildColumns(props.bikes);


        //allBikeData = convertMetric(props.metric, allBikeData);
        this.state = { chart: chartBuilders[0], columns };


    }
    onChange(newChartId) {
        let newChart = chartBuilders
            .reduce((reducer, chart) => chart.id === newChartId ? chart : reducer, {});
        this.setState({ chart: newChart });
    }
    render() {
        //iterate through ride activities, grab previous rows' data
        let allBikeData = buildRows(this.props.activities, this.props.bikes, this.state.chart.rowBuilder(this.props.prefersMetric), this.state.chart.description(this.props.prefersMetric));

        return (
            <div>
                <div className="row">
                    <div className="col-md-3">
                        <h2 >{this.state.chart.label} <small>{this.state.chart.description()}</small></h2>
                    </div>
                    <div className="pull-right">
                        <ChartChooser
                            onChange={this.onChange.bind(this)}
                            chartBuilders={chartBuilders}
                            currChart={this.state.chart}
                        />
                        <div className="pull-right">
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <Chart
                        chartType="AnnotatedTimeLine"
                        columns={this.state.columns}
                        rows={allBikeData}
                        options={{
                           
                            thickness: 3,
                            displayZoomButtons: false
                        }}
                        graph_id="ScatterChart"
                        width="100%"
                        height="400px"
                        legend_toggle
                    />
                </div>

            </div>
        );
    }
}

export default ChartSurface;