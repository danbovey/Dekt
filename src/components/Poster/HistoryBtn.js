import React from 'react';
import classNames from 'classnames';

import Icon from '../Icon';

const HistoryBtn = ({ item, ...props }) => {
  // TODO: Is an episode poster going to exist? - if episode is watched
  // TODO: If movie is watched
  let itemIsWatched = false;
  if(item.itemType === 'show') {
    itemIsWatched = item.progress
      && item.progress.aired > 0
      && item.progress.aired === item.progress.completed;
  }

  return (
    <button
      className={classNames('btn', 'history', { active: itemIsWatched })}
      {...props}
    >
      <Icon name="check" />
    </button>
  );
};

export default HistoryBtn;