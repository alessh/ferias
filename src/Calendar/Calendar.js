import React, { Component } from 'react';

import moment from 'moment';
import { noop, range, chunk } from 'lodash';
import cx from 'classnames';

import Today from './Today';
import './Calendar.css';

class WeekDays extends Component {
  render() {
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    return (
      <div className='weekdays'>
        {weekdays.map((w, i) => <div className='weekday' key={i}>{w}</div>)}
      </div>
    );
  }
}

class Day extends Component {
  render() {

    var classNames = cx('cell', 'day', this.props.color, {
      'weekend': (this.props.w === 0 && this.props.d > 7) || (this.props.w >= 4 && this.props.d <= 14)
    })

    return (
      <div className={classNames} >
        <div>
          <p onTouchTap={this.props.onFilter}>{this.props.d}</p>
        </div>
      </div>
    );
  }  
}

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: (this.props.today || this.props.date) ? (this.props.today || this.props.date).clone().date(1) : moment().utc().date(1)
    }
  }
  render() {
    var m = this.props.date;
    var d1 = m.clone().subtract(1, 'month').endOf('month').date();
    var d2 = m.clone().date(1).day();
    var d3 = m.clone().endOf('month').date();

    var days = [].concat(
      range(d1-d2+1, d1+1),
      range(1, d3+1),
      range(1, 42-d3-d2+1)
    );

    let d4 = m.clone();
    if (days[0] > 7) {
      d4.date(days[0]).subtract(1, 'month');
    } else {
      d4.date(days[0]);
    }

    return (
      <div className='body'>
        {chunk(days, 7).map((row, w) => (
          <div key={w} className='days'>
            {row.map((d, i) => 
              {
                let dt = d4.clone()
                let color = this.props.items.find((k, y) => 
                              k.final.clone().add(12, 'months').isSame(dt, 'day')) ? 'deadline' :
                            this.props.items.find((k, y) => 
                              k.final.clone().add(11, 'months').subtract(1, 'days').isSame(dt, 'day')) ? 'critical' :
                            this.props.items.find((k, y) => 
                              k.final.clone().add(1, 'days').isSame(dt, 'day')) ? 'warning' : ''; 

                d4.add(1, 'days');

                return (<Day 
                  key={i} i={i} d={d} w={w} color={color}
                  onFilter={this.props.onFilter ? this.props.onFilter.bind(null, dt.clone()) : noop()}
                />)
              }
            )}
          </div>
        ))}
      </div>
    );
  }  
}

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: (this.props.today || this.props.date) ? (this.props.today || this.props.date).clone() : moment().utc()
    }
  }
  render() {
    return (
      <div className='calendar' >
        <Today today={this.props.today} date={this.props.date} onNext={this.props.onNext} onPrev={this.props.onPrev} />
        <WeekDays />
        <Body items={this.props.items} date={this.props.date} onFilter={this.props.onFilter} />
      </div>
    );
  }
}

export default Calendar;