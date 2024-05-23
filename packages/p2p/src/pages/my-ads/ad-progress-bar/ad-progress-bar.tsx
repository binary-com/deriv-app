import React from 'react';

type TStep = { header: { title: string }; sub_step_count: number };
type TAdProgressBar = {
    current_step: number;
    steps: TStep[];
};

const AdProgressBar = ({ current_step, steps }: TAdProgressBar) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const percentage = ((current_step + 1) / steps.length) * 100;
    const offset = ((100 - percentage) * circumference) / 100;

    return (
        <svg width={72} height={72}>
            <g transform='rotate(-90 36 100)'>
                <circle
                    r={radius}
                    cx={100}
                    cy={100}
                    fill='transparent'
                    stroke='var(--text-disabled-1)'
                    strokeWidth='0.5rem'
                    strokeDasharray={circumference}
                    strokeDashoffset='0'
                />
                <circle
                    r={radius}
                    cx={100}
                    cy={100}
                    fill='transparent'
                    stroke='var(--text-red)'
                    strokeWidth='0.5rem'
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </g>
            <text
                x='50%'
                y='50%'
                dominantBaseline='central'
                textAnchor='middle'
                fontSize='var(--text-size-xs)'
                fontWeight='var(--text-weight-bold)'
                fill='var(--text-prominent)'
            >
                {current_step + 1} / {steps.length}
            </text>
        </svg>
    );
};

export default AdProgressBar;
