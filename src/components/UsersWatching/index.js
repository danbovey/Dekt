import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tooltip from 'rc-tooltip';

import * as showActions from 'actions/show';
import Spinner from 'components/Spinner';

import './styles';

@connect(
    state => ({
        auth: state.auth,
        watching: state.watching
    }),
    dispatch => ({
        showActions: bindActionCreators(showActions, dispatch)
    })
)
export default class UsersWatching extends Component {
    componentWillMount() {
        const show = this.props.show;

        if(show.watching == null && show.watching_loading == false) {
            this.props.showActions.watching(show.item.show.ids.slug);
        }
    }

    renderUser(user, i, auth = false) {
        return (
            <Tooltip
                placement="bottom"
                transitionName="rc-tooltip-zoom"
                overlay={<span>{auth ? 'YOU!' : user.username}</span>}
                mouseLeaveDelay={0}
                key={i}
            >
                <a href={`https://trakt.tv/users/${user.username}`} target="_blank" rel="noopener" className={auth ? 'me' : ''}>
                    <img src={user.images ? user.images.avatar.full : 'https://walter.trakt.tv/hotlink-ok/placeholders/medium/fry.png'} alt={user.username} />
                </a>
            </Tooltip>
        );
    }

    render() {
        const {
            auth,
            show,
            watching
        } = this.props;

        const users = show.watching;

        if(!show.watching_loading && users) {
            const isWatching = watching.item && watching.item.show && watching.item.show.ids.trakt == show.item.show.ids.trakt;
            let usersLength = isWatching ? 9 : 10;
            if(users.length > 10) {
                usersLength = usersLength - 1;
            }

            return (
                <div className="users-watching">
                    {users.length > 0 ? (
                        <div>
                            <p>{users.length} watching now</p>
                            <div className="users">
                                {isWatching ? this.renderUser(auth.user, 0, true) : null}
                                {users.slice(0, usersLength)
                                    .filter(u => u.username != auth.user.username)
                                    .map((user, i) => this.renderUser(user, i))
                                }
                                {users.length > 10 ? (
                                    <a href="#" className="plus-more">+{users.length - 9} more</a>
                                ) : null}
                            </div>
                        </div>
                    ) : null}
                </div>
            );
        } else {
            return (
                <div className="users-watching loading">
                    <Spinner size="medium" />
                </div>
            );
        }
    }
}
