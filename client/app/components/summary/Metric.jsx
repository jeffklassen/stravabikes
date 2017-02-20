import React from 'react';

const Metric = ({summary}) => {
    const metricStyle = { display: 'block', color: 'fc4c02' };
    const fieldStyle = { display: 'block' };
    const summaryStyle = { fontSize: 18, fontWeight: 700, marginLeft: '120px', display: 'inline-block', padding: '14px' };
    return (

        <div className="summary" style={summaryStyle}>
            <div style={metricStyle}>{summary.total}</div>
            <div style={fieldStyle}>{summary.field}</div>
        </div>
    );
};

export default Metric;