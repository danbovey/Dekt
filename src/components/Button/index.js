import React from 'react';
import classNames from 'classnames';

import './styles';

const Button = ({ children, className, disabled, loading, onClick, size, type }) => {
    return (
        <button
            className={classNames('btn', className, `btn--${type}`, {
                [`btn--${size}`]: size,
                'btn--disabled': disabled
            })}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
