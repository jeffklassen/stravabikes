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
                console.log('returned json', json);
                this.setState({athlete: json.athlete, summaries: json.summary});
                
            });
        //});
    }
    onButtonClick() {
        request.get('/api/bikecount')
            .then(response => {
                let json = response.body;
                this.setState({ numBikes: json.bikeCount });
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
                    <div className="row">
                        <span>number of bikes:{this.state.numBikes}</span>
                    </div>
                    <div className="row">
                        <button onClick={this.onButtonClick.bind(this)}> Get Count </button>
                    </div>
                </div>
            </div>) : null

        );
    }
}

const AthleteSummary = ({athlete, summaries}) => {
    return (
        <div>
            <img src={athlete.profile} className="pull-left" style={{ float: 'left', marginRight: '15px', height: '100px', width: '100px', borderRadius: '50%' }} />
            <h2 className="col-md-3"> {`${athlete.firstname} ${athlete.lastname}`}</h2>

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
    );
};

const SummaryComponent = ({summary}) => {

    return (

        <div className="summaryComponent" style={{ display: 'inline-block', padding: '14px' }}>
            <div style={{ display: 'block' }}>{summary.field}</div>
            <div style={{ display: 'block' }}>Total {summary.total}</div>
        </div>
    );
};


export default BikeInfoSurface;


