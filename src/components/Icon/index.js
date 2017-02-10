import React from 'react';
import classNames from 'classnames';

const Icon = ({ name, size, spin, pulse, rotate, flip }) => (
    <span
        className={classNames('btb', `bt-${name}`, {
            [`bt-${size}`]: size,
            'bt-spin': spin,
            'bt-pulse': pulse,
            [`bt-rotate-${rotate}`]: rotate,
            [`bt-flip-${flip}`]: flip
        })}
    >
    </span>
);

export default Icon;
