import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DropdownMenu from 'react-dd-menu';

import * as checkinActions from '../../actions/checkin';
import * as userActions from '../../actions/user';
import Button from '../Button';
import Icon from '../Icon';
import DateTimePicker from '../DateTimePicker';

class Menu extends Component {
  state = { isOpen: false };

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.checkIn = this.checkIn.bind(this);
    this.toggleHide = this.toggleHide.bind(this);
    this.toggleDatePicker = this.toggleDatePicker.bind(this);
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  close() {
    this.setState({ isOpen: false });
  }

  checkIn() {
    this.props.checkinActions.checkin(this.props.item.episode.ids.trakt)
      .then(() => this.props.userActions.get_watching());
  }

  toggleHide() {
    this.props.userActions.toggle_hidden_item(this.props.item);
  }

  toggleDatePicker() {
    this.setState({ datepicker: !this.state.datepicker });
  }

  render() {
    const { disabledActions, item, progress } = this.props;
    const { datepicker, isOpen } = this.state;

    const hasAired = progress && progress.aired > 0;
    const allowHide = disabledActions.indexOf('hide') === -1;
    
    if(!hasAired && !allowHide) {
      // There is nothing for the menu to show
      return <noscript />;
    }

    return (
      <div className="menu">
        <DropdownMenu
          isOpen={isOpen}
          close={this.close}
          toggle={(
            <Button onClick={this.toggle}>
              <Icon name="ellipsis-v" />
            </Button>
          )}
          align="right"
          inverse
        >
          {hasAired && [
              <li key={0}>
                <button onClick={this.checkIn}>
                  Check in
                </button>
              </li>,
              <li key={1}>
                <button onClick={this.toggleDatePicker}>
                  Watched at...
                </button>
              </li>
          ]}
          {allowHide && (
            <li>
              <button onClick={this.toggleHide}>
                {item.is_hidden ? 'Unhide this' : 'Hide this'}
              </button>
            </li>
          )}
        </DropdownMenu>
        {datepicker && (
          <DateTimePicker
            onRequestClose={this.toggleDatePicker}
            onChange={this.props.history}
            open={true}
          />
        )}
      </div>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => ({
    checkinActions: bindActionCreators(checkinActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  })
)(Menu);