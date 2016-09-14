import React, { Component } from 'react';
import uuid from 'node-uuid';
import moment from 'moment';

import './Calendar.css';

class Today extends Component {
  render() {
    const month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const today = moment.utc();
    return (
      <div className='today'>{today.date() + ' de ' + month[today.month()] + ' ' + today.year()}</div>
    );
  }
}

class WeekDay extends Component {
  render() {
    const weekday = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
    return (
      <div className='weekday'>
        <p>{weekday[this.props.weekday]}</p>
      </div>
    );
  }
}

class WeekDays extends Component {
  render() {
    const weekdays = [];
    for (var d = 0; d < 7; d++) {
      weekdays.push(<div className='gap' key={'gap-' + d} />);
      weekdays.push(<WeekDay weekday={d} key={'weekday-' + d} />);
    }
    return (
      <div className='weekdays'>
        {weekdays}
        <div className='gap' />
      </div>
    );
  }
}

class Day extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: this.props.date.clone()
    }
  }
  render() {
    //console.log('Day:' + JSON.stringify(this.props));

    const day = this.state.date.date();
    const weekday = this.state.date.weekday();

    var classNames = '';

    if (weekday === 0 || weekday === 6) {
      classNames += 'cell weekend' ;
    } else {
      classNames += 'cell day';
    }

    var warnings = '';

    var today = moment.utc();

    if (this.props.ferias) {
      
      if (this.props.ferias[this.state.date.date()]) {

          this.props.ferias[this.state.date.date()].forEach(function(ferias) {
            var data = ferias.fields.inicial.value;
            if (data) {
              var inicial = moment.utc(data);

              if (inicial.clone().add(12, 'months') <= today) {
                warnings = 'deadline';
                return;
              }  else if (inicial.clone().add(11, 'months') <= today) {
                warnings = 'critical';
                return;
              } else if (inicial <= today) {
                warnings = 'warning';
                return;
              }
            }           
          })
      }

    }

    return (
      <div className={classNames + ' ' + warnings} >
        <div>
          <p>{day}</p>
        </div>
      </div>
    );
  }  
}

class Empty extends Component {
  render() {
    return (
      <div className='cell' >
        <div>
          <p></p>
        </div>
      </div>
    );
  }  
}

class Days extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: this.props.date.clone()
    }
  }
  render() {
    const days = [];
    var date = this.state.date.clone();
    for (var d = 0; d < 7; d++) {
      if (d === date.weekday() && this.state.date.month() === date.month()) {        
        days.push(<div className='gap' key={'gap-' + d} />);
        days.push(<Day date={date.clone()} selected={false} key={'day-' + d} ferias={this.props.ferias} />);
        date.add(1, 'day');
      } else {
        days.push(<div className='gap' key={'gap-' + d} />);
        days.push(<Empty key={'empty-' + d} />);
      }
    }
    return (
      <div className='days'>
        {days}   
        <div className='gap' />     
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
    //console.log('Props date: ' + this.state.date.format('DD MMMM YYYY'))
    const body = [];
    const date = this.state.date.clone();
    for (var week = 0; week < 6; week++) {
      //console.log('Count: ' + week + ', State month:' + this.state.date.format('YYYY-MM-DD'))
      body.push(<Days date={date.clone()} ferias={this.props.ferias} month={date.utc().month()} key={uuid.v4()} />);
      date.add(1, 'weeks').subtract(date.day(), 'days');
      if (this.state.date.month() !== date.month()) break;
    }
    return (
      <div className='body'>
        {body}
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
    var ferias = {};
    this.props.items.forEach(function ( v ) {
      var inicial = moment.utc(v.fields.inicial.value);
      if (ferias[ inicial.date() ] === undefined) ferias[ inicial.date() ] = [];
      ferias[ inicial.date() ].push( v );
    });
    return (
      <div className='calendar' >
        <Today />
        <WeekDays />
        <Body date={this.state.date.clone()} ferias={ferias} />
      </div>
    );
  }
}

export default Calendar;
