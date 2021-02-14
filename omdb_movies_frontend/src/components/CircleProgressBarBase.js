import React from 'react';

const INITIAL_OFFSET = 25;
const circleConfig = {
  viewBox: '0 0 38 38',
  x: '19',
  y: '19',
  radio: '15.91549430918954'
};

const CircleProgressBarBase = ({
  className,
  trailStrokeColor,
  strokeColor,
  percentage,
  innerText
  }) => {
    return (
        <figure className={className}>
            <svg viewBox={circleConfig.viewBox}>
                <circle
                className="ring"
                cx={circleConfig.x}
                cy={circleConfig.y}
                r={circleConfig.radio}
                fill="transparent"
                stroke={trailStrokeColor}
                />

                <circle
                className="path"
                cx={circleConfig.x}
                cy={circleConfig.y}
                r={circleConfig.radio}
                fill="transparent"
                stroke={strokeColor}
                strokeDasharray={`${percentage} ${100 - percentage}`}
                strokeDashoffset={INITIAL_OFFSET}
                />
                <g className="circle-label">
                <text x="22%" y="55%" className="circle-percentage" fill="#fff">
                    {percentage}%
                </text>
                </g>
            </svg>
        </figure>
    );
};

export default CircleProgressBarBase;