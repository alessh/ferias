import React, { Component } from 'react';


import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Dialog, AppBar, LinearProgress, FloatingActionButton } from 'material-ui';

import IconDelete from 'material-ui/svg-icons/action/delete';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconSave from 'material-ui/svg-icons/action/done';
import IconExit from 'material-ui/svg-icons/navigation/close';

import Form from './Form';

export default class FormDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			progress: false
		}

		this.onClose = this.onClose.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onProgress = this.onProgress.bind(this);
	}

	onClose() {
		this.props.onClose();
	}

	onSave() {
		this.setState({progress: true}, function() {
			this.refs['form'].onSave(this.props.onClose.bind(this));
	    }.bind(this));
		
	}

	onProgress(event, progress) {

		switch(progress) {
			case 'start':
				this.setState({progress: true})
				break;
			default:
				this.setState({progress: false})
		}

	}

	render() {
		var style = {
			progress: {
				marginTop: '3px',
				visibility: this.state.progress ? 'visible' : 'hidden'
			}
		}
		return (
			<MuiThemeProvider>
			<div>
				<Dialog	
					modal={false}
					open={true}
					onRequestClose={this.props.onClose}
					autoScrollBodyContent={true}
					{...this.props} 
				>

			    	<AppBar title={this.props.label || this.state.label} >
				    	<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onSave.bind(this)} >
					      		<IconDelete />
					    	</FloatingActionButton>
					    </div>
				    	<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onSave.bind(this)} >
					      		<IconAdd />
					    	</FloatingActionButton>
					    </div>
				    	<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onSave.bind(this)} >
					      		<IconSave />
					    	</FloatingActionButton>
					    </div>
					    <div style={{top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onClose.bind(this)} >
					      		<IconExit />
					    	</FloatingActionButton>
					    </div>
				    </AppBar>

				    <LinearProgress mode="indeterminate" style={style.progress} />

				    <Form ref={'form'} onProgress={this.onProgress.bind(this)} {...this.props} />

				</Dialog>
			</div>
			</MuiThemeProvider>
		);
	}	
}
