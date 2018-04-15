import React from 'react';
import classNames from 'classnames';

import './style.css';

const Spinner = ({ color = 'default', size = 'small' }) => (
  <span
    className={classNames('spinner', `spinner--${size}`, `spinner--${color}`)}
  />
);

export default Spinner;
