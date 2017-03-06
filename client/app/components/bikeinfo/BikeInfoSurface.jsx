import React from 'react';
import * as request from 'superagent';

import AthleteSummary from './summary/AthleteSummary.jsx';
import ChartSurface from './charts/ChartSurface.jsx';
import { extractMetricPreference } from './summary/athleteDataManip';


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

                let athleteMetricPreference = athleteSummary.athlete.measurement_preference;
                let prefersMetric = extractMetricPreference(athleteMetricPreference);
                this.setState({
                    athlete: athleteSummary.athlete,
                    summaries: athleteSummary.summary,
                    activities: activityResponse.body,
                    prefersMetric
                });


            });
    }

    render() {
        return (

            this.state.athlete ? (
                <div>
                    <div className="row">
                        <AthleteSummary
                            athlete={this.state.athlete}
                            summaries={this.state.summaries}
                        />
                    </div>
                    <div className="row">
                        {this.state.activities ? (
                            <ChartSurface   
                                activities={this.state.activities}
                                bikes={this.state.athlete.bikes}
                                prefersMetric={this.state.prefersMetric}
                            />
                        ) : null}
                    </div>

                </div>
            ) : null

        );
    }
}

export default BikeInfoSurface;


