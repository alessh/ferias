import React, { Component } from 'react';

import { FloatingActionButton } from 'material-ui';
import IconNext from 'material-ui/svg-icons/navigation/chevron-right';
import IconPrevious from 'material-ui/svg-icons/navigation/chevron-left';

import moment from 'moment';

class WeekDay extends Component {
  render() {
    const weekday = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    return (
      <div className='weekday'>
        {/*<div className='gap' key={'gap-' + this.props.weekday} />*/}
        <p>{weekday[this.props.weekday]}</p>
        {/*{ this.props.weekday % 7 ? (<div className='gap' key={'gap-' + this.props.weekday + 1} />) : (null) }*/}
      </div>
    );
  }
}

export default class WeekDays extends Component {
  render() {
    const weekdays = [];
    for (var d = 0; d < 7; d++) {
      weekdays.push(<WeekDay weekday={d} key={'weekday-' + d} />);
    }
    return (
      <div className='weekdays'>
        {weekdays}
      </div>
    );
  }
}
