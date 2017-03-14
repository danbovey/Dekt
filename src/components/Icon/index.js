import React from 'react';
import classNames from 'classnames';

const Icon = ({ name, size, spin, pulse, rotate, fixed, flip, type = 'btb', prefix = 'bt' }) => (
    <span
        className={classNames(type, `${prefix}-${name}`, {
            [`bt-${size}`]: size,
            'bt-fw': fixed,
            'bt-spin': spin,
            'bt-pulse': pulse,
            [`bt-rotate-${rotate}`]: rotate,
            [`bt-flip-${flip}`]: flip
        })}
    >
    </span>
);

export default Icon;
