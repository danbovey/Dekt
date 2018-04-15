import React from 'react';
import classNames from 'classnames';

import Icon from '../Icon';

const WatchlistBtn = ({ item, ...props }) => (
  <button
    className={classNames('btn', 'list', {
      active: item.inWatchlist
    })}
    {...props}
  >
    <Icon name="align-left" />
  </button>
);

export default WatchlistBtn;