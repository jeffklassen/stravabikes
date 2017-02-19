import React from 'react';
import * as request from 'superagent';

class BikeInfoSurface extends React.Component {
    constructor(props) {
        super(props);
        this.state = { summary: {}, athlete: null };

        this.loadAthlete = this.loadAthlete.bind(this);
        this.loadAthlete();
    }
    loadAthlete() {
        request.get('/api/athleteSummary')
            .then(response => {
                let json = response.body;
                this.setState({ athlete: json.athlete, summaries: json.summary });

            });
    }


    render() {
        return (

            this.state.athlete ? (<div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="row">
                            <hr />
                            <AthleteSummary athlete={this.state.athlete} summaries={this.state.summaries} />

                        </div>
                        <hr />
                    </div>
             
                </div>
            </div>) : null

        );
    }
}

const AthleteSummary = ({athlete, summaries}) => {
    const avatarStyle = { float: 'left', marginRight: '15px', height: '100px', width: '100px', borderRadius: '50%' };
    return (
        <div>
            <div className="row">
                <img src={athlete.profile} className="pull-left" style={avatarStyle} />
                <div className="col-md-3">
                    <h2 className="row"> {`${athlete.firstname} ${athlete.lastname}`}</h2>
                    <span className="row" >Bike Count: {athlete.bikes.length} </span>
                </div>
                <div className="summary">
                    {summaries
                        .map(function (summary) {
                            return (
                                <SummaryComponent key={summary.field} summary={summary} />
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

const SummaryComponent = ({summary}) => {
    const block = { display: 'block' };
    return (

        <div className="summaryComponent" style={{ display: 'inline-block', padding: '14px' }}>
            <div style={block}>{summary.field}</div>
            <div style={block}>Total {summary.total}</div>
        </div>
    );
};


export default BikeInfoSurface;


