import React from 'react';
import classNames from 'classnames';

import './style.css';

const Button = ({ children, className, theme = 'default', ...props }) => (
  <button className={classNames('btn', `btn--${theme}`, className)} {...props}>
    {children}
  </button>
);

export default Button;