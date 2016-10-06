import React, { Component } from 'react';

import uuid from 'node-uuid';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { 
	Dialog, 
	AppBar, 
	LinearProgress, 
	FloatingActionButton, 
	MenuItem 
} from 'material-ui';

import IconDelete from 'material-ui/svg-icons/action/delete';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconSave from 'material-ui/svg-icons/action/done';
import IconExit from 'material-ui/svg-icons/navigation/close';

import Formsy from 'formsy-react';
import { 
	FormsyDate, 
    FormsySelect, 
    FormsyText, 
    FormsyToggle 
} from 'formsy-material-ui/lib';

export default class Ferias extends Component {
	constructor(props) {
		super(props);

		this.state = {
			canSubmit: false,
			progress: false,
		}

		this.onChange = this.onChange.bind(this);
	    this.onSave = this.onSave.bind(this);
	    this.onClose = this.onClose.bind(this);
	    this.enableButton = this.enableButton.bind(this);
	    this.disableButton = this.disableButton.bind(this);
	    this.submitForm = this.submitForm.bind(this);
	    this.notifyFormError = this.notifyFormError.bind(this);

	    this.onLoad = this.onLoad.bind(this);
	}

	componentDidMount() {
		this.onLoad();
	}

	onLoad() {

	}

	onClose() {
		this.props.onClose();
	}

	onChange(path, value) {
		var newState = this.state;
		newState[path] = value;
		this.setState(newState);
	}

	onSave(callback) {	
		this.refs.form.submit();
	}

	errorMessages= {
		wordsError: "Use somente letras",
		numericError: "Use somente números",
		urlError: "Please provide a valid URL",
	}

	styles= {
		switchStyle: {
			marginBottom: 16,
		},
	}

	enableButton() {
		this.setState({
			canSubmit: true,
		});
	}

	disableButton() {
		this.setState({
			canSubmit: false,
		});
	}

	submitForm(data) {

	}

	notifyFormError(data) {
		console.error('Form error:', data);
	}

	render() {
		let { 
			switchStyle, 
		} = this.styles;
    	let { 
    		wordsError, 
    		numericError, 
    		//urlError 
    	} = this.errorMessages;

		const items = [];
		items.forEach(function(v, k, a) {
			items.push(<MenuItem key={uuid.v4()} value={v.id} primaryText={v.text} />)
		})
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

			    	<AppBar title={'Controle de Férias'} >
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
				    	<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}} >
							<FloatingActionButton onTouchTap={this.onSave.bind(this)} disabled={!this.state.canSubmit} >
					      		<IconSave />
					    	</FloatingActionButton>
					    </div>
					    <div style={{top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onClose.bind(this)} >
					      		<IconExit />
					    	</FloatingActionButton>
					    </div>
				    </AppBar>

				    <LinearProgress mode="indeterminate" style={{marginTop: '3px', visibility: this.state.progress ? 'visible' : 'hidden'}} />

					<Formsy.Form
			            onValid={this.enableButton}
			            onInvalid={this.disableButton}
			            onValidSubmit={this.submitForm}
			            onInvalidSubmit={this.notifyFormError}
			            ref='form'
			          >
			          	<FormsySelect
			              name="empresa"
			              required
			              floatingLabelText="Empresa"
			              value={this.state.empresa}
			            >
			              <MenuItem value={'Altamira'} primaryText="Altamira" />
			              <MenuItem value={'Tecnequip'} primaryText="Tecnequip" />
			              <MenuItem value={'Proalta'} primaryText="Proalta" />
			            </FormsySelect>
			          	<FormsyText
			              name="nome"
			              validations="isWords"
			              validationError={wordsError}
			              required
			              hintText="Nome do funcionário"
			              floatingLabelText="Nome do Funcionário"
			              fullWidth={true} 
			              value={this.state.nome}
			            />          
			            <FormsyDate
			              name="inicial"
			              required
			              floatingLabelText="Data Inicial"
			              value={this.state.inicial}
			            />
			            <FormsyDate
			              name="final"
			              required
			              floatingLabelText="Data Final"
			              value={this.state.final}
			            />
			            <FormsyToggle
			              name="realizado"
			              label="Realizado"
			              style={switchStyle}
			              value={this.state.realizado}
			            />
			            <FormsyText
			              name="dias"
			              validations="isNumeric"
			              validationError={numericError}
			              hintText="Dias de direito"
			              floatingLabelText="Dias de direito"
			              value={this.state.dias}
			            />
			        </Formsy.Form>

				</Dialog>
			</div>
			</MuiThemeProvider>
		);
	}	
}