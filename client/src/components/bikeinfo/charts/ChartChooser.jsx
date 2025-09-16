import React from 'react';

const ChartChooser = ({ onChange, chartBuilders, currChart }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };
    return (
        <select className="form-control" value={currChart.id} onChange={handleChange.bind(null)}>
            {
                chartBuilders.map(o => {
                    return <option key={o.id} value={o.id}>{o.label}</option>;
                })
            }

        </select>
    );
};

export default ChartChooser;