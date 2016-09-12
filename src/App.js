import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Calendar from './Calendar';
import PostList from './PostList'
import './App.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import 'aws-sdk/dist/aws-sdk';
const aws = window.AWS;

const style = {
	display: 'inline-block',
}
const postit = {
	display: 'inline-block',
	width: '50%',
	padding: '20px'
}
class App extends Component {
	constructor(props) {
		super(props);

		aws.config.update({accessKeyId: 'AKIAJROLVHLQQHOE72HA', secretAccessKey: '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','region': 'sa-east-1'});

		this.state = {
			open: true
		}

		this.onOpen = this.onOpen.bind(this);
		this.onClose = this.onClose.bind(this);
	}

	onOpen() {
		this.setState({open: true});
	}

	onClose() {
		this.setState({open: false});
	}

	render() {
		const dt1 = this.props.date.clone().date(1);
		const dt2 = dt1.clone().add(1, 'month');

		return (
			<div>
				<div className="header" />

				<div className='container' style={style}><Calendar today={dt1} /></div>
				
				<div style={postit}><PostList /></div>

				<div className='container' style={style}><Calendar today={dt2} /></div>

				<div style={postit}><PostList title="Funcionário" /></div>

				{/*<RaisedButton label="Formulário" onTouchTap={this.onOpen} />*/}

				{/*
				<div className='container' style={style}><Form id='af7331bd-900d-497f-90fa-17e46081a6a3' class='org.com.br.empresa' /></div>
				<div className='container' style={style}><Form id='a5df6d82-d4ba-42fa-92b0-5b99a2d90808' class='org.com.br.empresa' /></div>
				<div className='container' style={style}><Form id='5c2d650b-575f-44c2-a6d2-a92f7f13d4a3' class='org.com.br.empresa' /></div>

				<div className='container' style={style}><Form id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' /></div>
				<div className='container' style={style}><Form id='68e8fd98-e948-44bb-8933-a6394ecf99a8' class='hm.funcionario' /></div>
				*/}

				{/*<div className='container' style={style}>

				</div>
				
				<div className='container' style={style}>
					
				</div>

				<div className='container' style={style}>
					
				</div>*/}

	        </div>			
		);
	}
}

export default App;