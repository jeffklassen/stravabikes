import React from 'react';
import * as request from 'superagent';

import AthleteSummary from './summary/AthleteSummary.jsx';
import ChartSurface from './charts/ChartSurface.jsx';
import { extractMetricPreference } from './summary/athleteDataManip';
import { withRouter } from 'react-router-dom';
import Link from '../Link.jsx';
import authService from '../../services/authService.js';

class BikeInfoSurface extends React.Component {
    constructor(props) {
        super(props);
        this.state = { summary: {}, athlete: null };

        this.checkAuth = this.checkAuth.bind(this);
        this.checkAuth(this.props);
        
        this.loadAthlete = this.loadAthlete.bind(this);
        this.refreshActivites = this.refreshActivites.bind(this);
        this.loadAthlete();
        
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            this.checkAuth(nextProps);
        }
    }
    checkAuth(params) {
        const { history } = params;
        authService
            .isAuthenticated()
            .catch(e => history.replace({ pathname: '/login' }));
    }

    refreshActivites() {
        this.setState({ activities: null });
        request.get('api/loadActivities')
            .then(() => {
                return request.get('api/activities');
            })
            .then(resp => {
                this.setState({
                    activities: resp.body
                });
            });
    }
    loadAthlete() {
        Promise.all([request.get('api/athleteSummary'), request.get('api/activities')])
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
                                chartParams={this.props.params}
                                activities={this.state.activities}
                                bikes={this.state.athlete.bikes}
                                prefersMetric={this.state.prefersMetric}
                            >

                                <Link onClick={this.refreshActivites} style={{ color: 'fc4c02' }}>Refresh Strava Data</Link>
                            </ChartSurface>
                        ) : <span>Loading... </span>}
                    </div>

                </div>
            ) : null

        );
    }
}

export default withRouter(BikeInfoSurface);


