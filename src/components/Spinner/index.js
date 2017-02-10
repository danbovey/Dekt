import React from 'react';
import classNames from 'classnames';

import './styles';

const Spinner = ({ size = 'small', spinning = true, type }) => (
    <span
        className={classNames('spinner', `spinner--${size}`, {
            'spinner--spinning': spinning,
            [`spinner--${type}`]: type
        })}
    >
    </span>
);

export default Spinner;
