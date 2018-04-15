import React, { Component } from 'react';
import moment from 'moment';
import rome from 'rome';
import classNames from 'classnames';

import './style.css';

const hourNums = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2];
const minuteNums = [15, 20, 25, 30, 35, 40, 45, 50, 55, 0, 5, 10];

const prefix = 'c-datepicker';
const styles = {
  scrim: 'c-scrim',
  back: `${prefix}__back`,
  container: `${prefix}__calendar`,
  date: `${prefix}__date`,
  dayBody: `${prefix}__days-body`,
  dayBodyElem: `${prefix}__day-body`,
  dayConcealed: `${prefix}__day--concealed`,
  dayDisabled: `${prefix}__day--disabled`,
  dayHead: `${prefix}__days-head`,
  dayHeadElem: `${prefix}__day-head`,
  dayRow: `${prefix}__days-row`,
  dayTable: `${prefix}__days`,
  month: `${prefix}__month`,
  next: `${prefix}__next`,
  positioned: `${prefix}--fixed`,
  selectedDay: `${prefix}__day--selected`,
  selectedTime: `${prefix}__time--selected`,
  time: `${prefix}__time`,
  timeList: `${prefix}__time-list`,
  timeOption: `${prefix}__time-option`,
  clockNum: `${prefix}__clock__num`
};

class DateTimePicker extends Component {
  static defaultProps = {
    open: false
  };

  constructor(props) {
    super(props);

    this.state = {
      clockMode: 'hour',
      date: moment().startOf('hour'),
      mode: 'calendar'
    };
  }

  componentDidMount() {
    return rome(this._calendar, {
      initialValue: this.state.date,
      styles,
      time: false
    })
      .on('data', this.onData.bind(this));
  }

  onData(dateString) {
    const date = this.state.date;
    const [year, month, day] = dateString.split('-');
    date.set({ year, month: month - 1, date: day });

    this.setState({ date })
  }

  submit() {
    if (this.props.onChange) {
      this.props.onChange(this.state.date);
    }
    this.close();
  }

  close() {
    if (this.props.onRequestClose) {
      this.props.onRequestClose();
    }
  }

  setDate(d) {
    d = moment(d);

    const date = this.state.date;
    date.year(d.year());
    date.month(d.month());
    date.date(d.date());
    this.setState({ date });
  }

  setTime(t) {
    t = moment(t);

    const minuteAsInt = Math.ceil(parseInt(t.format('mm'), 10) / 5) * 5;
    t.minutes(minuteAsInt);

    const date = this.state.date;
    date.hours(t.hours());
    date.minutes(t.minutes());
    this.setState({ date });
  }

  showCalendar() {
    this.setState({ mode: 'calendar' });
  }

  showClock() {
    this.setState({ mode: 'clock' });
  }
  showHourClock() {
    this.setState({ mode: 'clock', clockMode: 'hour' });
  }
  showMinuteClock() {
    this.setState({ mode: 'clock', clockMode: 'minute' });
  }

  switchAm() {
    const date = this.state.date;
    if (date.hour() >= 12) {
      date.subtract(12, 'hours');
      this.setState({ date });
    }
  }
  switchPm() {
    const date = this.state.date;
    if (date.hour() < 12) {
      date.add(12, 'hours');

      this.setState({ date });
    }
  }

  clickHourNum(num) {
    const date = this.state.date;
    if (date.hour() < 12) {
      date.hour(num);
    } else {
      date.hour(num + 12);
    }

    this.setState({ date });
  }
  mouseInHourClock() {

  }
  mouseOutHourClock() {

  }

  clickMinuteNum(num) {
    const date = this.state.date;
    date.minute(num);

    this.setState({ date });
  }
  mouseInMinuteClock() {

  }
  mouseOutMinuteClock() {

  }

  render() {
    const { open } = this.props;
    const { clockMode, date, mode } = this.state;

    if (open) {
      return (
        <div>
          <div className="c-scrim"></div>
          <div className="c-datepicker">
            <a
              onClick={this.showClock.bind(this)}
              className={classNames('c-datepicker__toggle c-datepicker__toggle--right c-datepicker--show-time js-show-clock', {
                'is-selected': mode === 'clock'
              })}
              title="show time picker"
            >
            </a>
            <a
              onClick={this.showCalendar.bind(this)}
              className={classNames('c-datepicker__toggle c-datepicker__toggle--left c-datepicker--show-calendar js-show-calendar', {
                'is-selected': mode === 'calendar'
              })}
              title="show date picker"
            >
            </a>

            <div className="c-datepicker__header">
              <div className="c-datepicker__header-day">
                <span className="js-day">{date.format('dddd')}</span>
              </div>
              <div className="c-datepicker__header-date">
                <span onClick={this.showCalendar.bind(this)} className="c-datepicker__header-date__month js-date-month">
                  {date.format('MMM YYYY')}
                </span>
                <span onClick={this.showCalendar.bind(this)} className="c-datepicker__header-date__day js-date-day">
                  {date.format('Do')}
                </span>
                <span className="c-datepicker__header-date__time js-date-time">
                  <span
                    onClick={this.showHourClock.bind(this)}
                    className={classNames('c-datepicker__header-date__hours js-date-hours', {
                      'active': clockMode === 'hour'
                    })}
                  >
                    {date.format('HH')}
                  </span>
                  :
                                    <span
                    onClick={this.showMinuteClock.bind(this)}
                    className={classNames('c-datepicker__header-date__minutes js-date-minutes', {
                      'active': clockMode === 'minute'
                    })}
                  >
                    {date.format('mm')}
                  </span>
                </span>
              </div>
            </div>


            <div
              className="c-datepicker__calendar"
              ref={c => this._calendar = c}
            ></div>
            <div className="c-datepicker__clock">
              <div className="c-datepicker__clock__am-pm-toggle">
                <label
                  className={classNames({
                    'c-datepicker__toggle--checked': date.hour() < 12
                  })}
                >
                  <input
                    onChange={this.switchAm.bind(this)}
                    checked={date.hour() < 12}
                    className="c-datepicker__toggle c-datepicker__toggle--right c-datepicker__clock--am"
                    type="radio"
                    name="time-date-toggle"
                    value="AM"
                  />
                  AM
                </label>
                <label
                  className={classNames({
                    'c-datepicker__toggle--checked': date.hour() >= 12
                  })}
                >
                  <input
                    onChange={this.switchPm.bind(this)}
                    checked={date.hour() >= 12}
                    className="c-datepicker__toggle c-datepicker__toggle--right c-datepicker__clock--pm"
                    type="radio"
                    name="time-date-toggle"
                    value="PM"
                  />
                  PM
                </label>
              </div>
              <div className="c-datepicker__mask"></div>
              <div
                onMouseLeave={this.mouseOutHourClock.bind(this)}
                className={classNames('c-datepicker__clock__hours js-clock-hours', {
                  'active': clockMode === 'hour'
                })}
              >
                {hourNums.map((num, i) => (
                  <div
                    onClick={this.clickHourNum.bind(this, num)}
                    onMouseEnter={this.mouseInHourClock.bind(this)}
                    className="c-datepicker__clock__num"
                    key={i}
                  >
                    {num}
                  </div>
                ))}
                <div className="c-datepicker__clock-hands">
                  <div className="c-datepicker__hour-hand"></div>
                </div>
              </div>
              <div
                onMouseLeave={this.mouseOutMinuteClock.bind(this)}
                className={classNames('c-datepicker__clock__minutes js-clock-minutes', {
                  'active': clockMode === 'minute'
                })}
              >
                {minuteNums.map((num, i) => (
                  <div
                    onClick={this.clickMinuteNum.bind(this, num)}
                    onMouseEnter={this.mouseInMinuteClock.bind(this)}
                    className="c-datepicker__clock__num"
                    key={i}
                  >
                    {num}
                  </div>
                ))}
                <div className="c-datepicker__clock-hands">
                  <div className="c-datepicker__hour-hand"></div>
                </div>
              </div>
            </div>
            <div className="modal-btns">
              <a onClick={this.close.bind(this)} className="c-btn c-btn--flat js-cancel">Cancel</a>
              <a onClick={this.submit.bind(this)} className="c-btn c-btn--flat js-ok">OK</a>
            </div>
          </div>
        </div>
      );
    }

    return <noscript />;
  }
}

export default DateTimePicker;
