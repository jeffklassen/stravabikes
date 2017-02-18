import React from 'react';
import * as request from 'superagent';


const AthleteSummary = ({athlete}) => {
    return (
        <div>
            <img src={athlete.profile} className="pull-left" style={{ float: 'left', marginRight: '15px', height: '100px', width: '100px', borderRadius: '50%' }} />
            <h2 className="col-md-3"> {`${athlete.firstname} ${athlete.lastname}`}</h2>
        </div>
    );
};

const SummaryComponent = ({summary}) => {
    for(key in summary){
        return (
            <div className="summary">
                <div className="summaryComponent" style={{ display: 'inline-block', padding: '14px' }}>
                    <div style={{ display: 'block' }}>summary[key]</div>
                    <div style={{ display: 'block' }}>Total {key}</div>
                </div>
                <div className="summaryComponent" style={{ display: 'inline-block', padding: '14px' }}>
                    <div style={{ display: 'block', boxSizing: "border-box" }}>200</div>
                    <div style={{ display: 'block' }}>Total Elevation</div>
                </div>
                <div className="summaryComponent" style={{ display: 'inline-block', padding: '14px' }}>
                    <div style={{ display: 'block' }}>600</div>
                    <div style={{ display: 'block' }}>Total Hours</div>
                </div>
            </div>

        );


    class BikeInfoSurface extends React.Component {
        constructor(props) {
            super(props);
            this.state = { numBikes: null, athlete: null };

            this.loadAthlete = this.loadAthlete.bind(this);
            this.loadAthlete();
        }
        loadAthlete() {
            request.get('/api/athlete')
                .then(response => {
                    let json = response.body;
                    this.setState({ athlete: json });

                    // request.get('/api/metrics')
                    //     .then(response => {
                    //         let json = response.body;
                    this.setState({
                        summary: 
                            elevation: 1200,
                            distance: 100,
                            hours: 50,
                        }
                    });
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
                                <AthleteSummary athlete={this.state.athlete} />
                                <SummaryComponent summary={this.state.summary} />
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
    export default BikeInfoSurface;


