import React from 'react';

interface ChartBuilder {
    id: string;
    label: string;
}

interface ChartChooserProps {
    onChange: (chartId: string) => void;
    chartBuilders: ChartBuilder[];
    currChart: ChartBuilder;
}

const ChartChooser = ({ onChange, chartBuilders, currChart }: ChartChooserProps): React.ReactElement => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    return (
        <select className="form-control" value={currChart.id} onChange={handleChange}>
            {
                chartBuilders.map(o => {
                    return <option key={o.id} value={o.id}>{o.label}</option>;
                })
            }
        </select>
    );
};

export default ChartChooser;