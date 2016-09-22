import React, { Component } from 'react';

import { FloatingActionButton } from 'material-ui';
import IconNext from 'material-ui/svg-icons/navigation/chevron-right';
import IconPrevious from 'material-ui/svg-icons/navigation/chevron-left';

import uuid from 'node-uuid';
import moment from 'moment';

import './Calendar.css';

class Today extends Component {
  render() {
    const month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const today = this.props.today;
    return (
      <div className='today' style={{display: 'inline-block', width: '100%', padding: 0}}>
        <FloatingActionButton onTouchTap={this.props.onPrev} mini={true} style={{ marginTop: 30, marginRight: 5, align: 'left', padding: 0}} >
          <IconPrevious />
        </FloatingActionButton>
        {today.date() + ' de ' + month[today.month()] + ' ' + today.year()}
        <FloatingActionButton onTouchTap={this.props.onNext} mini={true} style={{ marginTop: 30, marginLeft: 5, align: 'right', padding: 0}} >
          <IconNext />
        </FloatingActionButton>
      </div>
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

    const day = this.props.date.date();
    const weekday = this.props.date.weekday();

    var classNames = '';

    if (weekday === 0 || weekday === 6) {
      classNames += 'cell weekend' ;
    } else {
      classNames += 'cell day';
    }

    var warnings = '';

    var today = moment.utc();

    if (this.props.ferias) {
      
      if (this.props.ferias[this.props.date.format('YYYYMMDD')]) {

          this.props.ferias[this.props.date.format('YYYYMMDD')].forEach(function(ferias) {
            var data = ferias.inicial;
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

    }

    return (
      <div className={classNames + ' ' + warnings} >
        <div>
          <p onTouchTap={this.props.onFilter.bind(this, day)}>{day}</p>
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
    var date = this.props.date.clone();
    for (var d = 0; d < 7; d++) {
      if (d === date.weekday() && this.props.date.month() === date.month()) {        
        days.push(<div className='gap' key={'gap-' + d} />);
        days.push(<Day date={date.clone()} selected={false} key={'day-' + d} ferias={this.props.ferias} onFilter={this.props.onFilter} />);
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
    const date = (this.props.today || this.props.date) ? (this.props.today || this.props.date).clone().date(1) : moment().utc().date(1); //this.state.date.clone();
    for (var week = 0; week < 6; week++) {
      //console.log('Count: ' + week + ', State month:' + this.state.date.format('YYYY-MM-DD'))
      body.push(<Days date={date.clone()} ferias={this.props.ferias} month={date.utc().month()} key={uuid.v4()} onFilter={this.props.onFilter} />);
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
      var inicial = moment.utc(v.inicial);
      if (ferias[ inicial.format('YYYYMMDD') ] === undefined) ferias[ inicial.format('YYYYMMDD') ] = [];
      ferias[ inicial.format('YYYYMMDD') ].push( v );
    });
    return (
      <div className='calendar' >
        <Today today={this.props.today} onNext={this.props.onNext} onPrev={this.props.onPrev} />
        <WeekDays />
        <Body date={(this.props.today || this.props.date) ? (this.props.today || this.props.date).clone() : moment().utc()} ferias={ferias} onFilter={this.props.onFilter} />
      </div>
    );
  }
}

export default Calendar;
