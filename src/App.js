import React, { Component } from 'react';

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { AppBar, LinearProgress, FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {cyan500} from 'material-ui/styles/colors';

// app
import Calendar from './Calendar';
import PostList from './PostList';
import FormDialog from './Form';
import './App.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import 'aws-sdk/dist/aws-sdk';
const aws = window.AWS;

// This replaces the textColor value on the palette
// and then update the keys for each component that depends on it.
// More on Colors: http://www.material-ui.com/#/customization/colors
const muiTheme = getMuiTheme({
	/*floatingActionButton: {
		color: 'lightgray',
		iconColor: 'rgb(0, 188, 212)'
	}*/
});

class App extends Component {
	constructor(props) {
		super(props);

		aws.config.update({accessKeyId: 'AKIAJROLVHLQQHOE72HA', secretAccessKey: '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','region': 'sa-east-1'});

		this.state = {
			open: false,
			progress: true,
			date: this.props.date.clone().date(1)
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
		const dt1 = this.state.date.clone();

		const style = {
			display: 'inline-block',
		}
		const postit = {
			display: 'inline-block',
			width: '50%',
			padding: '20px'
		}
		const progress = {
			marginTop: '3px',
			visibility: this.state.progress ? 'visible' : 'hidden'
		}
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
			<div>
				<AppBar title="Controle de Férias" iconClassNameRight="muidocs-icon-navigation-expand-more" />
				<div style={{right: '20px', marginRight: 20, top: 42, position: 'absolute', zIndex: 1200}}>
					<FloatingActionButton onTouchTap={this.onOpen} >
			      		<ContentAdd />
			    	</FloatingActionButton>
			    </div>

			    <FormDialog class='hm.funcionario' open={this.state.open} onClose={this.onClose.bind(this)} />

				<LinearProgress mode="indeterminate" style={progress} />

				<div className='container' style={style}><Calendar today={dt1.clone()} /></div>
				
				<div style={postit}><PostList /></div>

				<div className='container' style={style}><Calendar today={dt1.add(1, 'month').clone()} /></div>

				<div style={postit}><PostList title="Funcionário" /></div>

				<div className='container' style={style}><Calendar today={dt1.add(1, 'month').clone()} /></div>
				
				<div style={postit}><PostList /></div>

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
	        </MuiThemeProvider>		
		);
	}
}

export default App;