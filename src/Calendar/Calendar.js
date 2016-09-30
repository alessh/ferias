import React, { Component } from 'react';

import { FloatingActionButton } from 'material-ui';
import IconNext from 'material-ui/svg-icons/navigation/chevron-right';
import IconPrevious from 'material-ui/svg-icons/navigation/chevron-left';

import uuid from 'node-uuid';
import moment from 'moment';

import Today from './Today';
import WeekDays from './WeekDays';
import Body from './Body';

import './Calendar.css';

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
