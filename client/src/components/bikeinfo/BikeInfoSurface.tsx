import React from 'react';
import * as request from 'superagent';

import AthleteSummary from './summary/AthleteSummary';
import ChartSurface from './charts/ChartSurface';
import { extractMetricPreference } from './summary/athleteDataManip';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Link from '../Link';
import authService from '../../services/authService';
import { StravaActivity, StravaAthlete } from '../../../../types/strava';
import { ActivitySummary } from '../../../../types/models';

interface BikeInfoSurfaceState {
    summary: any;
    athlete: StravaAthlete | null;
    summaries?: ActivitySummary[];
    activities?: StravaActivity[] | null;
    prefersMetric?: boolean;
}

interface BikeInfoSurfaceProps {
    chartType?: string;
    measure?: string;
}

const BikeInfoSurface = (): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams<{ chartType?: string; measure?: string }>();
    const [state, setState] = React.useState<BikeInfoSurfaceState>({
        summary: {},
        athlete: null
    });

    const checkAuth = React.useCallback(async () => {
        return authService
            .isAuthenticated()
            .catch(e => {
                navigate('/login');
                return Promise.reject();
            });
    }, [navigate]);

    const refreshActivities = React.useCallback(async () => {
        setState(prev => ({ ...prev, activities: null }));
        await request.get('/api/loadActivities');

        const resp = await request.get('/api/activities');

        setState(prev => ({
            ...prev,
            activities: resp.body
        }));
    }, []);

    const loadAthlete = React.useCallback(async () => {
        const [summaryResponse, activityResponse] = await Promise.all([
            request.get('/api/athleteSummary'),
            request.get('/api/activities')
        ]);

        const athleteSummary = summaryResponse.body;
        const athleteMetricPreference = athleteSummary.athlete.measurement_preference;
        const prefersMetric = extractMetricPreference(athleteMetricPreference);

        setState({
            summary: {},
            athlete: athleteSummary.athlete,
            summaries: athleteSummary.summary,
            activities: activityResponse.body,
            prefersMetric
        });
    }, []);

    React.useEffect(() => {
        checkAuth().then(() => {
            loadAthlete();
        });
    }, [checkAuth, loadAthlete]);

    React.useEffect(() => {
        checkAuth();
    }, [location, checkAuth]);

    return state.athlete ? (
        <div>
            <div className="row">
                <AthleteSummary
                    athlete={state.athlete}
                    summaries={state.summaries}
                />
            </div>

            <div className="row">
                {state.activities ? (
                    <ChartSurface
                        chartParams={params}
                        activities={state.activities}
                        bikes={state.athlete.bikes}
                        prefersMetric={state.prefersMetric}
                    >
                        <Link onClick={refreshActivities} style={{ color: 'fc4c02' }}>Refresh Strava Data</Link>
                    </ChartSurface>
                ) : <span>Loading... </span>}
            </div>
        </div>
    ) : null;
};

export default BikeInfoSurface;


