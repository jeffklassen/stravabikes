import React from 'react';
import { Chart } from 'react-google-charts';
import { buildRows, buildColumns } from '../summary/athleteDataManip';
import ChartChooser from './ChartChooser';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import chartBuilders from './chartBuilders';
import { StravaActivity, StravaBike } from '../../../../../../types/strava';


interface ChartSurfaceState {
    columns?: any[];
    chart?: any;
    rows?: any[];
    error?: string;
}

interface ChartSurfaceProps {
    chartParams?: { chartType?: string; measure?: string };
    activities: StravaActivity[];
    bikes: StravaBike[];
    prefersMetric?: boolean;
    children?: React.ReactNode;
}

const ChartSurface = ({ chartParams, activities, bikes, prefersMetric, children }: ChartSurfaceProps): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = React.useState<ChartSurfaceState>({});
    const checkChartParams = React.useCallback(async (params?: { chartType?: string; measure?: string }) => {
        if (params && chartBuilders.map(builder => builder.id).includes(params.measure)) {
            return Promise.resolve(params);
        } else {
            navigate('/chart/' + chartBuilders[0].id);
            return Promise.reject('chart params not correct');
        }
    }, [navigate]);
    const buildChartRows = React.useCallback((chart: any) => {
        return buildRows(activities as any[], bikes, chart.rowBuilder(prefersMetric));
    }, [activities, bikes, prefersMetric]);

    const buildChart = React.useCallback((params: { chartType?: string; measure?: string }) => {
        try {
            const columns = buildColumns(bikes);
            const chart = chartBuilders
                .reduce((reducer, chart) => chart.id === params.measure ? chart : reducer, {});
            const rows = buildChartRows(chart);

            setState({ columns, chart, rows });
        } catch (e) {
            setState({ error: e as string });
        }
    }, [bikes, buildChartRows]);

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
    return state.chart ? (
        <div>
            <div className="row">
                <div className="col-md-3">
                    <h2>{state.chart.label} <small>{state.chart.description()}</small></h2>
                </div>
                <div className="pull-right">
                    <ChartChooser
                        onChange={onChange}
                        chartBuilders={chartBuilders}
                        currChart={state.chart}
                    />
                    <div className="pull-right">
                        {children}
                    </div>
                </div>
            </div>
            <div className="row">
                <Chart
                    chartType="AnnotatedTimeLine"
                    columns={state.columns}
                    rows={state.rows}
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
    ) : <div>{state.error}</div>;
};
export default ChartSurface;