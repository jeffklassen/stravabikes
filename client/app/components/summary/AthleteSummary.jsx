import React from 'react';
import Metric from './Metric.jsx';

const AthleteSummary = ({athlete, summaries}) => {
    const avatarStyle = { float: 'left', marginRight: '15px', height: '100px', width: '100px', borderRadius: '50%' };
    const bikeCountStyle = { fontWeight: 700, fontSize: 18, color: 'fc4c02' };
    return (
        <div className="col-md-12">
            <hr />
            <div className="row">

                <img src={athlete.profile} className="pull-left" style={avatarStyle} />
                <div className="col-md-3">
                    <h2 className="row"> {`${athlete.firstname} ${athlete.lastname}`}</h2>
                    <span className="row" style={bikeCountStyle}>{athlete.bikes.length} bikes</span>
                </div>
                <div className="summary">
                    {summaries
                        .map(function (summary) {
                            return (
                                <Metric key={summary.field} summary={summary} />
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