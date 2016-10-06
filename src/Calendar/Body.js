import React, { Component } from 'react';

import { FloatingActionButton } from 'material-ui';
import IconNext from 'material-ui/svg-icons/navigation/chevron-right';
import IconPrevious from 'material-ui/svg-icons/navigation/chevron-left';

import { range, chunk } from 'lodash';
import cx from 'classnames';

import uuid from 'node-uuid';
import moment from 'moment';

class Day extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //date: this.props.date.clone()
    }
  }
  render() {
    //console.log('Day:' + JSON.stringify(this.props));

    //const day = this.props.date.date();
    //const weekday = this.props.date.weekday();

    let classNames = cx('cell', {
      'weekend': (this.props.w === 0 || this.props.w === 6),
      'day': !(this.props.w === 0 || this.props.w === 6)
    })

    var warnings = '';

    var today = moment.utc();

    /*if (this.props.items) {
      
      if (this.props.items[this.props.date.format('YYYYMMDD')]) {

          this.props.items[this.props.date.format('YYYYMMDD')].forEach(function(items) {
            var data = items.inicial;
            if (data) {
              var inicial = moment.utc(data);

              if (inicial.clone().add(12, 'months').diff(today, 'days') <= 0) {
                warnings = 'deadline';
              }  else if (inicial.clone().add(11, 'months').diff(today, 'days') <= 0) {
                warnings = 'critical';
              } else if (inicial.diff(today, 'days') <= 0) {
                warnings = 'warning';
              }
            }           
          })
      }

    }*/

    return (
        <td className={classNames}><div>{this.props.i || ''}</div></td>
    );
  }  
}

export default class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: (this.props.today || this.props.date) ? (this.props.today || this.props.date).clone().date(1) : moment().utc().date(1)
    }

    this.selectDate = this.selectDate.bind(this);
  }

  render() {
    //console.log('Props date: ' + this.state.date.format('DD MMMM YYYY'))
    const body = [];
    const date = (this.props.today || this.props.date) ? (this.props.today || this.props.date).clone().date(1) : moment().utc().date(1); //this.state.date.clone();
    
    var m = this.props.date;
    var d = m.date();
    var d1 = m.clone().subtract(1, 'month').endOf('month').date();
    var d2 = m.clone().date(1).day();
    var d3 = m.clone().endOf('month').date();

    var days = [].concat(
      range(d1-d2+1, d1+1),
      range(1, d3+1),
      range(1, 42-d3-d2+1)
    );

    var weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    {/*for (var week = 0; week < 6; week++) {
      //console.log('Count: ' + week + ', State month:' + this.state.date.format('YYYY-MM-DD'))
      body.push(<Days date={date.clone()} items={this.props.items} month={date.utc().month()} key={uuid.v4()} onFilter={this.props.onFilter} />);
      date.add(1, 'weeks').subtract(date.day(), 'days');
      if (this.state.date.month() !== date.month()) break;
    }*/}
    return (
      <div>
        <table>
          <thead>
            <tr>
              {weeks.map((w, i) => <td key={i}>{w}</td>)}
            </tr>
          </thead>

          <tbody>
            {chunk(days, 7).map((row, w) => (
              <tr key={w}>
                {row.map((i) => (
                  <Day key={i} i={i} d={d} w={w}
                    onClick={this.selectDate.bind(null, i, w)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }  

  selectDate(i, w) {
    var prevMonth = (w === 0 && i > 7);
    var nextMonth = (w >= 4 && i <= 14);
    var m = this.props.moment;

    m.date(i);
    if(prevMonth) m.subtract(1, 'month');
    if(nextMonth) m.add(1, 'month');

    this.props.onChange(m);
  }  
}

/*class Day extends Component {
  render() {
    var i = this.props.i;
    var w = this.props.w;
    var prevMonth = (w === 0 && i > 7);
    var nextMonth = (w >= 4 && i <= 14);
    var cn = cx({
      'prev-month': prevMonth,
      'next-month': nextMonth,
      'current-day': !prevMonth && !nextMonth && (i === this.props.d)
    });

    return <td className={cn} >{i}</td>;
  }
}

export default class Body extends Component {
  render() {
    var m = this.props.date;
    var d = m.date();
    var d1 = m.clone().subtract(1, 'month').endOf('month').date();
    var d2 = m.clone().date(1).day();
    var d3 = m.clone().endOf('month').date();

    var days = [].concat(
      range(d1-d2+1, d1+1),
      range(1, d3+1),
      range(1, 42-d3-d2+1)
    );

    var weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className={cx('m-calendar', this.props.className)}>
        <div className="toolbar">
          <button type="button" className="prev-month" onClick={this.prevMonth}>
            <i className={this.props.prevMonthIcon}/>
          </button>
          <span className="current-date">{m.format('MMMM YYYY')}</span>
          <button type="button" className="next-month" onClick={this.nextMonth}>
            <i className={this.props.nextMonthIcon}/>
          </button>
        </div>

        <table>
          <thead>
            <tr>
              {weeks.map((w, i) => <td key={i}>{w}</td>)}
            </tr>
          </thead>

          <tbody>
            {chunk(days, 7).map((row, w) => (
              <tr key={w}>
                {row.map((i) => (
                  <Day key={i} i={i} d={d} w={w}
                    onClick={this.selectDate.bind(null, i, w)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  selectDate(i, w) {
    var prevMonth = (w === 0 && i > 7);
    var nextMonth = (w >= 4 && i <= 14);
    var m = this.props.moment;

    m.date(i);
    if(prevMonth) m.subtract(1, 'month');
    if(nextMonth) m.add(1, 'month');

    this.props.onChange(m);
  }

  prevMonth(e) {
    e.preventDefault();
    this.props.onChange(this.props.moment.subtract(1, 'month'));
  }

  nextMonth(e) {
    e.preventDefault();
    this.props.onChange(this.props.moment.add(1, 'month'));
  }

}*/

