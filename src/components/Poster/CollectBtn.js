import React from 'react';
import classNames from 'classnames';

import Icon from '../Icon';

const CollectBtn = ({ item, ...props }) => {
  const collected = false;

  return (
    <button
      className={classNames('btn', 'collect', { active: collected })}
      {...props}
    >
      <Icon name="book" />
    </button>
  );
};

export default CollectBtn;