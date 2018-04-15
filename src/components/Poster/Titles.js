import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

const Titles = ({ episodeLink, item, mainLink, progress }) => {
  const itemTitle = item.show ? item.show.title : item.movie.title;
  const hasEpisode = progress && progress.next_episode;
  const episodeNumber = hasEpisode
    ? `${progress.next_episode.season}x${progress.next_episode.number}`
    : null;
  const episodeTitle = hasEpisode
    ? `${episodeNumber} ${progress.next_episode.title}`
    : null;

  return (
    <div className="poster__titles">
      {hasEpisode && (
        <p className="titles__episode" title={episodeTitle}>
          <Link to={episodeLink}>
            <span className="titles__number">
              {episodeNumber}
            </span>
            <span
              className="titles__name"
              dangerouslySetInnerHTML={{__html: progress.next_episode.title }}
            />
            {item.progress && item.progress.unseen > 1 && (
              <span className="unseen">
                {` + ${item.progress.unseen - 1}`}
              </span>
            )}
          </Link>
        </p>
      )}
      <p
        className={classNames('titles__show', {
          'titles--single': !hasEpisode
        })}
        title={itemTitle}
      >
        <Link to={mainLink} dangerouslySetInnerHTML={{__html: itemTitle }} />
      </p>
    </div>
  );
};

export default Titles;