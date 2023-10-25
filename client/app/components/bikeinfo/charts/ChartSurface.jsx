import { buildColumns, buildRows } from "../summary/athleteDataManip";

import { Chart } from "react-google-charts";
import ChartChooser from "./ChartChooser.jsx";
import PropTypes from "prop-types";
import React from "react";
import chartBuilders from "./chartBuilders";
import { withRouter } from "react-router-dom";

class ChartSurface extends React.Component {
  constructor(props) {
    super(props);

    this.checkChartParams = this.checkChartParams.bind(this);
    this.buildChart = this.buildChart.bind(this);
    this.buildRows = this.buildRows.bind(this);

    this.checkChartParams(props).then(this.buildChart);

    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.checkChartParams(nextProps).then(this.buildChart);
    }
  }
  async checkChartParams(params) {
    const { history } = params;
    const chartParams = params.chartParams;
    if (
      chartParams &&
      chartBuilders.map((builder) => builder.id).includes(chartParams.measure)
    ) {
      return Promise.resolve(chartParams);
    } else {
      history.replace({ pathname: "/chart/" + chartBuilders[0].id });
      return Promise.reject("chart params not correct");
    }
    console.log(params.chartParams);
    // if params
  }
  componentDidMount() {
    // for some reason, the first time the google chart is rendered, it does not properly calulate the width of the container.
    // this is a hack, but forces correct width detection each time.
    this.forceUpdate();
  }
  buildRows(chart) {
    let rows = buildRows(
      this.props.activities,
      this.props.bikes,
      chart.rowBuilder(this.props.prefersMetric),
      chart.description(this.props.prefersMetric)
    );

    return rows;
  }
  buildChart(chartParams) {
    //create date column for chart
    try {
      let columns = buildColumns(this.props.bikes);

      let chart = chartBuilders.reduce(
        (reducer, chart) =>
          chart.id === chartParams.measure ? chart : reducer,
        {}
      );
      let rows = this.buildRows(chart);

      this.setState({ columns, chart, rows });
    } catch (e) {
      this.state = {
        error: e,
      };
    }
  }

  onChange(newChartId) {
    const { history } = this.props;
    history.replace({ pathname: "/chart/" + newChartId });
  }
  render() {
    return this.state.chart ? (
      <div>
        <div className="row">
          <div className="col-md-3">
            <h2>
              {this.state.chart.label}{" "}
              <small>{this.state.chart.description()}</small>
            </h2>
          </div>
          <div className="pull-right">
            <ChartChooser
              onChange={this.onChange.bind(this)}
              chartBuilders={chartBuilders}
              currChart={this.state.chart}
            />
            <div className="pull-right">{this.props.children}</div>
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
              displayZoomButtons: false,
            }}
            graph_id="chart"
            width="100%"
            height="400px"
            legend_toggle
          />
        </div>
      </div>
    ) : (
      <div>{this.state.error}</div>
    );
  }
}
ChartSurface.propTypes = {
  bikes: PropTypes.array.isRequired,
};
export default withRouter(ChartSurface);
