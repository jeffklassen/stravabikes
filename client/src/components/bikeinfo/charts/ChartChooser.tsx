import React, { CSSProperties } from 'react';
import { useTheme } from '../../../context/ThemeContext';

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
    const { darkMode } = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    const selectStyle: CSSProperties = {
        backgroundColor: darkMode ? '#333333' : '#ffffff',
        color: darkMode ? '#ffffff' : '#1a1a1a',
        border: darkMode ? '1px solid #404040' : '1px solid #e1e5e9',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.2s ease',
        minWidth: '120px'
    };

    return (
        <select
            style={selectStyle}
            value={currChart.id}
            onChange={handleChange}
            onFocus={(e) => {
                e.currentTarget.style.borderColor = '#fc4c02';
            }}
            onBlur={(e) => {
                e.currentTarget.style.borderColor = darkMode ? '#404040' : '#e1e5e9';
            }}
        >
            {
                chartBuilders.map(o => {
                    return <option key={o.id} value={o.id}>{o.label}</option>;
                })
            }
        </select>
    );
};

export default ChartChooser;