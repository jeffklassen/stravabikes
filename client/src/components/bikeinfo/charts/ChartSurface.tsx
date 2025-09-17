import React from 'react';
import BikeChart from './BikeChart';
import ChartChooser from './ChartChooser';
import BikeSelector from './BikeSelector';
import TimeRangeFilter, { TimeRange } from './TimeRangeFilter';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import chartBuilders from './chartBuilders';
import { StravaActivity, StravaBike } from '../../../../../types/strava';
import { useTheme } from '../../../context/ThemeContext';
import { getThemeColors } from '../../../styles/solarized';


interface ChartSurfaceState {
    chart?: any;
    error?: string;
    selectedBikes: string[];
    timeRange: TimeRange;
}

interface ChartSurfaceProps {
    chartParams?: { chartType?: string; measure?: string };
    activities: StravaActivity[];
    bikes: StravaBike[];
    prefersMetric?: boolean;
    children?: React.ReactNode;
}

const ChartSurface = ({ chartParams, activities, bikes, prefersMetric, children }: ChartSurfaceProps): React.ReactElement => {
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode } = useTheme();
    const colors = getThemeColors(darkMode);

    const [state, setState] = React.useState<ChartSurfaceState>({
        selectedBikes: [],
        timeRange: { label: 'All Time', value: 'all' }
    });

    // Initialize selected bikes and time range from localStorage
    React.useEffect(() => {
        if (bikes.length > 0) {
            const activeBikes = bikes.filter(bike => bike.distance && bike.distance > 0);
            const storedBikes = localStorage.getItem('strava-bikes-selected');
            const storedTimeRange = localStorage.getItem('strava-time-range');

            let selectedBikes: string[] = [];
            let timeRange: TimeRange = { label: 'All Time', value: 'all' };

            // Parse stored bike selection
            if (storedBikes) {
                try {
                    const parsed = JSON.parse(storedBikes);
                    selectedBikes = parsed.filter((bikeId: string) =>
                        activeBikes.some(bike => bike.id === bikeId)
                    );
                } catch (e) {
                    console.warn('Failed to parse stored bike selection:', e);
                }
            }

            // Parse stored time range
            if (storedTimeRange) {
                try {
                    timeRange = JSON.parse(storedTimeRange);
                } catch (e) {
                    console.warn('Failed to parse stored time range:', e);
                }
            }

            // If no valid stored bike selection, default to all active bikes
            if (selectedBikes.length === 0) {
                selectedBikes = activeBikes.map(bike => bike.id);
            }

            setState(prev => ({ ...prev, selectedBikes, timeRange }));
        }
    }, [bikes]);

    const checkChartParams = React.useCallback(async (params?: { chartType?: string; measure?: string }) => {
        if (params && chartBuilders.map(builder => builder.id).includes(params.measure)) {
            return Promise.resolve(params);
        } else {
            navigate('/chart/' + chartBuilders[0].id);
            return Promise.reject('chart params not correct');
        }
    }, [navigate]);


    const buildChart = React.useCallback((params: { chartType?: string; measure?: string }) => {
        try {
            const chart = chartBuilders
                .find(chart => chart.id === params.measure) || chartBuilders[0];

            setState(prev => ({ ...prev, chart, error: undefined }));
        } catch (e) {
            console.error('❌ Chart building error:', e);
            setState(prev => ({ ...prev, error: e instanceof Error ? e.message : e as string }));
        }
    }, []);

    // Handle bike selection changes
    const handleBikeSelectionChange = React.useCallback((selectedBikes: string[]) => {
        setState(prev => ({ ...prev, selectedBikes }));
        localStorage.setItem('strava-bikes-selected', JSON.stringify(selectedBikes));
    }, []);

    // Handle time range changes
    const handleTimeRangeChange = React.useCallback((timeRange: TimeRange) => {
        setState(prev => ({ ...prev, timeRange }));
        localStorage.setItem('strava-time-range', JSON.stringify(timeRange));
    }, []);

    React.useEffect(() => {
        if (chartParams) {
            checkChartParams(chartParams).then(buildChart).catch(() => {});
        }
    }, [chartParams, checkChartParams, buildChart]);

    React.useEffect(() => {
        if (chartParams) {
            checkChartParams(chartParams).then(buildChart).catch(() => {});
        }
    }, [location, chartParams, checkChartParams, buildChart]);


    const onChange = React.useCallback((newChartId: string) => {
        navigate('/chart/' + newChartId);
    }, [navigate]);

    const containerStyle: React.CSSProperties = {
        backgroundColor: colors.background,
        minHeight: '100vh',
        padding: '0'
    };

    const chartHeaderStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        boxShadow: colors.shadow
    };

    const titleStyle: React.CSSProperties = {
        margin: 0,
        fontSize: '20px',
        fontWeight: '600',
        color: colors.textPrimary
    };

    const descriptionStyle: React.CSSProperties = {
        fontSize: '14px',
        color: colors.textSecondary,
        margin: '4px 0 0 0'
    };

    const controlsStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    };

    const lastUpdatedStyle: React.CSSProperties = {
        fontSize: '12px',
        color: colors.textMuted,
        fontStyle: 'italic'
    };

    return state.chart ? (
        <div style={containerStyle}>
            <BikeSelector
                bikes={bikes}
                selectedBikes={state.selectedBikes}
                onSelectionChange={handleBikeSelectionChange}
                darkMode={darkMode}
            />

            <TimeRangeFilter
                selectedRange={state.timeRange}
                onRangeChange={handleTimeRangeChange}
                darkMode={darkMode}
            />

            <div style={chartHeaderStyle}>
                <div>
                    <h2 style={titleStyle}>{state.chart.label}</h2>
                    <p style={descriptionStyle}>{state.chart.description(prefersMetric || false)}</p>
                </div>
                <div style={controlsStyle}>
                    <div style={lastUpdatedStyle}>
                        Last updated: 2 mins ago
                    </div>
                    <ChartChooser
                        onChange={onChange}
                        chartBuilders={chartBuilders}
                        currChart={state.chart}
                    />
                    {children}
                </div>
            </div>

            <div style={{
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                padding: '20px',
                boxShadow: colors.shadow
            }}>
                {state.error ? (
                    <div style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: colors.error || colors.textSecondary
                    }}>
                        Error: {state.error}
                    </div>
                ) : state.chart ? (
                    <BikeChart
                        activities={activities}
                        bikes={bikes}
                        selectedBikes={state.selectedBikes}
                        chart={state.chart}
                        prefersMetric={prefersMetric}
                        timeRange={state.timeRange}
                    />
                ) : (
                    <div style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: colors.textSecondary
                    }}>
                        Loading chart...
                    </div>
                )}
            </div>
        </div>
    ) : <div style={{ color: darkMode ? '#ffffff' : '#1a1a1a' }}>{state.error}</div>;
};
export default ChartSurface;