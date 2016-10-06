import React, { Component } from 'react';

import { FloatingActionButton } from 'material-ui';
import IconNext from 'material-ui/svg-icons/navigation/chevron-right';
import IconPrevious from 'material-ui/svg-icons/navigation/chevron-left';

export default class Today extends Component {
  constructor(props) {
    super(props);

    this.onPrev = this.onPrev.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  onPrev() {
    this.setState({date: this.props.date.subtract(1, 'month')}, this.props.onPrev ? this.props.onPrev(this.props.date) : null);
  }

  onNext() {
    this.setState({date: this.props.date.add(1, 'month')}, this.props.onNext ? this.props.onNext(this.props.date) : null);
  }

  render() {
    
    const month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const date = this.props.date;
    
    const style = {
      today: {  
        textAlign: 'center',
        fontSize: '1.8em',
        fontWeight: '400',
        textOverflow: 'ellipsis', 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: 0
      },
      title: {
        position: 'relative', 
        width: '100%'}
    }

    return (
      <div style={style.today} >

        <FloatingActionButton onTouchTap={this.onPrev.bind(this)} mini={true} >
          <IconPrevious />
        </FloatingActionButton>

        <div style={style.title}>
          {(this.props.today ? date.utc().date() + ' de ' : '') + month[date.utc().month()] + ' de ' + date.utc().year()}
        </div>

        <FloatingActionButton onTouchTap={this.onNext.bind(this)} mini={true} >
          <IconNext />
        </FloatingActionButton>
        
      </div>
    );
  }
}