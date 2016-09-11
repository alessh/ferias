import React, { Component } from 'react';
import './Calendar.css';

import moment from 'moment';

import uuid from 'node-uuid';
import async from 'async';
import 'aws-sdk/dist/aws-sdk';
const aws = window.AWS;

class Today extends Component {
  render() {
    const month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    return (
      <div className='today'>{month[this.props.date.month()] + ' ' + this.props.date.year()}</div>
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
  render() {
    console.log('Day:' + JSON.stringify(this.props));

    var classNames = 'cell ';

    if (this.props.selected) {
      classNames += 'selected ';
    }
    if (this.props.day % 5 === 0) {
      classNames += 'warning ';
    }
    if (this.props.day % 9 === 0) {
      classNames += 'critical ';
    }
    if (this.props.day % 27 === 0) {
      classNames += 'deadline ';
    }

    if (this.props.weekday === 0 || this.props.weekday === 6) {
      classNames += 'weekend ';
    } else {
      classNames += 'day ';
    }

    return (
      <div className={classNames} >
        <div>
          <p>{this.props.day}</p>
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
  render() {
    const days = [];
    console.log('Days: starting ' + this.props.date.format('YYYY-MM-DD'));
    for (var d = 0; d < 7; d++) {
      if (d === this.props.date.weekday() && 
        this.props.month === this.props.date.month()) {
        days.push(<div className='gap' key={'gap-' + d} />);
        days.push(<Day day={this.props.date.date()} weekday={this.props.date.weekday()} selected={false} key={'day-' + d} />);
        this.props.date.add(1, 'day');
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
      date: this.props.date.clone()
    }
  }
  render() {
    console.log('Props date: ' + this.props.date.format('DD MMMM YYYY'))
    const body = [];
    for (var week = 0; week < 6; week++) {
      console.log('Count: ' + week + ', State month:' + this.state.date.format('YYYY-MM-DD'))
      body.push(<Days {...this.state} month={this.props.date.month()} key={'week-' + week} />);
    }
    return (
      <div className='body'>
        {body}
      </div>
    );
  }  
}

class List extends Component {
  render() {
    const items = [];
    return (
      <ul>
        {items}
      </ul>
    );
  }
}

class Calendar extends Component {
  constructor(props) {
    super(props);

    var dynamodb = new aws.DynamoDB.DocumentClient();

    var list = [];

    var params = {
        TableName: "altamira",
        IndexName: "cid-index",
        KeyConditionExpression: "#pk = :pk",   
        ExpressionAttributeNames: {
            "#pk": "cid"
        },
        ExpressionAttributeValues: { 
            ":pk": "a:id.nom.nome:nome"
        },
        Projection: 'id, value',
        ExclusiveStartKey: null,
        Limit: 10
    }

    var result = function(err, data) {
        console.log(data)
        if (err) {
            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            
            if (data.Count > 0) {
              console.log(JSON.stringify(data.Items))
              data.Items.forEach(function(v, k, a) {
                list.push(v);
              })
            }
            if (data.LastEvaluatedKey) {
              this.ExclusiveStartKey = data.LastEvaluatedKey
              dynamodb.query(this, result.bind(this))
            } else {
              console.log('Fim do scan'); 
            }

        }
    }

    dynamodb.query(params, result.bind(params));

  }
  render() {
    return (
      <div className='calendar' >
        <Today date={this.props.today || this.props.date || moment().utc()} />
        <WeekDays />
        <Body date={this.props.today || this.props.date || moment().utc()} />
        <List items={this.props.today || this.props.date || moment().utc()} {...this.state} />
      </div>
    );
  }
}

export default Calendar;
