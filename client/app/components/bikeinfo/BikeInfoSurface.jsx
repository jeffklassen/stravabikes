import React from 'react';
import * as request from 'superagent';
import { Chart } from 'react-google-charts';
import AthleteSummary from './summary/AthleteSummary.jsx';
import { extractMetricPreference, convertMetric, buildRows, buildColumns, generateYLabel } from './summary/athleteDataManip';

class BikeInfoSurface extends React.Component {
    constructor(props) {
        super(props);
        this.state = { summary: {}, athlete: null };

        this.loadAthlete = this.loadAthlete.bind(this);
        this.loadAthlete();
    }

    loadAthlete() {
        Promise.all([request.get('/api/athleteSummary'), request.get('/api/activities')])
            .then(([summaryResponse, activityResponse]) => {
                let athleteSummary = summaryResponse.body;
                this.setState({ athlete: athleteSummary.athlete, summaries: athleteSummary.summary });

                let activities = activityResponse.body;
                let bikes = athleteSummary.athlete.bikes;
                let athleteMetricPreference = athleteSummary.athlete.measurement_preference;
                let metric = extractMetricPreference(athleteMetricPreference);
                let yAxisString = generateYLabel(metric);
                //activities = activities.filter(activity => activity.gear_id === firstBikeId);

                //create date column for chart
                let columns = buildColumns(bikes);

                //iterate through ride activities, grab previous rows' data
                let allBikeData = buildRows(activities, bikes);

                allBikeData = convertMetric(metric, allBikeData);
                this.setState({ allBikeData, columns, yAxisString });
            });
    }

    render() {
        return (

            this.state.athlete ? (
                <div>
                    <div className="row">
                        <AthleteSummary athlete={this.state.athlete} summaries={this.state.summaries} />
                    </div>
                    <div className="row">
                        {this.state.allBikeData ? (
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
                        ) : null}
                    </div>

                </div>
            ) : null

        );
    }
}

export default BikeInfoSurface;


