import React from 'react';
import Metric from './Metric';
import { StravaAthlete } from '../../../../../../types/strava';
import { ActivitySummary } from '../../../../../../types/models';

interface AthleteSummaryProps {
    athlete: StravaAthlete;
    summaries?: ActivitySummary[];
}

const AthleteSummary = ({ athlete, summaries }: AthleteSummaryProps): JSX.Element => {
    const avatarStyle: React.CSSProperties = { float: 'left', marginRight: '15px', height: '100px', width: '100px', borderRadius: '50%' };
    const bikeCountStyle = { fontWeight: 700, fontSize: 18, color: 'fc4c02' };
    return (
        <div className="col-md-12">
            <hr />
            <div className="row">

                <img src={athlete.profile} className="pull-left" style={avatarStyle} />
                <div className="col-md-3">
                    <h2 className="row"> {`${athlete.firstname} ${athlete.lastname}`}</h2>
                    <span className="row" style={bikeCountStyle}>{athlete.bikes&&athlete.bikes.length} bikes</span>
                </div>
                <div className="summary">
                    {summaries &&
                        summaries.map((summary) => {
                            return (
                                <Metric key={summary.field} summary={summary} metricPreference={athlete.measurement_preference}/>
                            );
                        })
                    }
                </div>
            </div>

            <hr />
        </div>
    );
};
export default AthleteSummary;