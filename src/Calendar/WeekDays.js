import React, { Component } from 'react';

import { FloatingActionButton } from 'material-ui';
import IconNext from 'material-ui/svg-icons/navigation/chevron-right';
import IconPrevious from 'material-ui/svg-icons/navigation/chevron-left';

import moment from 'moment';

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

export default class WeekDays extends Component {
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
