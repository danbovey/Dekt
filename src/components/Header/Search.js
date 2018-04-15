import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import Icon from '../Icon';

class Search extends Component {
  state = { search: false, value: '' };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleKey(e) {
    if(e.keyCode === 27) { // ESC
      this.close();
    } else if(e.keyCode === 13) { // Enter
      const query = e.target.value;
      if(query.length > 0) {
        this.close();
        this.props.history.push(
          '/search?query=' + encodeURIComponent(query).replace(/%20/g, '+')
        );
      }
    }
  }

  toggle() {
    this.setState({ search: !this.state.search, value: '' }, () => {
      if(this._searchInput && this.state.search) {
        window.setTimeout(() => this._searchInput.focus(), 200);
      }
    });
  }

  close() {
    this.setState({ search: false, value: '' });
  }

  render() {
    const { search, value } = this.state;

    return (
      <li className={classNames('search', { active: search })}>
        <button onClick={this.toggle}>
          <Icon name={search ? 'times' : 'search'} />
        </button>
        <div className="search__input">
          <input
            type="text"
            ref={c => this._searchInput = c}
            onChange={this.handleChange}
            onKeyUp={this.handleKey}
            value={value}
          />
        </div>
      </li>
    );
  }
}

export default withRouter(Search);