import React from 'react';
import ReactDOM from 'react-dom';
import { Chart } from 'react-google-charts';
import { buildRows, buildColumns } from '../summary/athleteDataManip';
import ChartChooser from './ChartChooser.jsx';

import chartBuilders from './chartBuilders';
import PropTypes from 'prop-types';


class ChartSurface extends React.Component {
    constructor(props) {
        super(props);

        //create date column for chart
        try{
            let columns = buildColumns(props.bikes);
            this.buildRows = this.buildRows.bind(this);
            let chart = chartBuilders[0];
            let rows = this.buildRows(chart);
            this.state = { columns, chart, rows };
        }
        catch (e){
            this.state = {
                error: e
            };

           
        }

        console.log('PARAMMMMSSS', props);
        
    }
    componentDidMount() {
        // for some reason, the first time the google chart is rendered, it does not properly calulate the width of the container.
        // this is a hack, but forces correct width detection each time.
        this.forceUpdate();
    }
    buildRows(chart) {
        let rows = buildRows(this.props.activities, this.props.bikes, chart.rowBuilder(this.props.prefersMetric), chart.description(this.props.prefersMetric));

        return rows;
    }
    onChange(newChartId) {
        let newChart = chartBuilders
            .reduce((reducer, chart) => chart.id === newChartId ? chart : reducer, {});
        let rows = this.buildRows(newChart);
        this.setState({ chart: newChart, rows });
    }
    render() {

        return (this.state.error ? <div>{this.state.error}</div>:
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
                        ref="c"
                        chartType="AnnotatedTimeLine"
                        columns={this.state.columns}
                        rows={this.state.rows}
                        options={{

                            thickness: 3,
                            displayZoomButtons: false
                        }}
                        graph_id="chart"
                        width="100%"
                        height="400px"
                        legend_toggle
                    />
                </div>

            </div>
        );
    }
}
ChartSurface.propTypes = {
    bikes: PropTypes.array.isRequired
};
export default ChartSurface;