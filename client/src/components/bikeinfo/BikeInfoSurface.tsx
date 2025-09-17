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
import { useTheme } from '../../context/ThemeContext';
import { getThemeColors } from '../../styles/solarized';

interface BikeInfoSurfaceState {
    summary: any;
    athlete: StravaAthlete | null;
    summaries?: ActivitySummary[];
    activities?: StravaActivity[] | null;
    prefersMetric?: boolean;
}


const BikeInfoSurface = (): React.ReactElement => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams<{ chartType?: string; measure?: string }>();
    const { darkMode } = useTheme();
    const colors = getThemeColors(darkMode);
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

    const containerStyle: React.CSSProperties = {
        backgroundColor: colors.background,
        minHeight: '100vh',
        color: colors.textPrimary
    };

    const loadingStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        fontSize: '16px',
        color: colors.textSecondary
    };

    return state.athlete ? (
        <div style={containerStyle}>
            <AthleteSummary
                athlete={state.athlete}
                summaries={state.summaries}
            />

            {state.activities ? (
                <ChartSurface
                    chartParams={params}
                    activities={state.activities}
                    bikes={state.athlete.bikes || []}
                    prefersMetric={state.prefersMetric}
                >
                    <Link onClick={refreshActivities} style={{ color: '#fc4c02' }}>Refresh Strava Data</Link>
                </ChartSurface>
            ) : (
                <div style={loadingStyle}>Loading chart data...</div>
            )}
        </div>
    ) : null;
};

export default BikeInfoSurface;


