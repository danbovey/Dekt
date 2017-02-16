import React from 'react';
import classNames from 'classnames';

const Icon = ({ name, size, spin, pulse, rotate, flip, type = 'btb', prefix = 'bt' }) => (
    <span
        className={classNames(type, `${prefix}-${name}`, {
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
