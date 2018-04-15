import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DropdownMenu from 'react-dd-menu';

import Button from '../Button';

class User extends Component {
  state = { isOpen: false };
  
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  close() {
    this.setState({ isOpen: false });
  }

  logout() {
    this.props.authActions.logout();
    this.props.history.push('/');
  }

  render() {
    const { user } = this.props;
    const { isOpen } = this.state;

    return (
      <div className="user">
        <DropdownMenu
          isOpen={isOpen}
          close={this.close}
          toggle={
            <Button onClick={this.toggle}>
              <img src={user.images.avatar.full} className="avatar" alt={user.name} />
              <span>{user.name}</span>
            </Button>
          }
          align="right"
          inverse
        >
          <li>
            <a
              href={`https://trakt.tv/users/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Profile
            </a>
          </li>
          <li>
            <a
              href={`https://trakt.tv/users/${user.username}/history`}
              target="_blank"
              rel="noopener noreferrer"
            >
              History
            </a>
          </li>
          <li>
            <a
              href={`https://trakt.tv/users/${user.username}/lists`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lists
            </a>
          </li>
          <li>
            <a
              href="https://trakt.tv/settings/hidden"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hidden Items
            </a>
          </li>
          <li>
            <a
              href="https://trakt.tv/settings"
              target="_blank"
              rel="noopener noreferrer"
            >
              Settings
            </a>
          </li>
          <li role="separator" className="separator" />
          <li>
            <button onClick={this.logout}>
              Sign out
            </button>
          </li>
        </DropdownMenu>
      </div>
    )
  }
}

export default withRouter(User);