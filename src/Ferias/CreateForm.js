import React, { Component } from 'react';

import uuid from 'node-uuid';
import moment from 'moment';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { 
	Dialog, 
	AppBar, 
	LinearProgress, 
	FloatingActionButton, 
	MenuItem  
} from 'material-ui';

import IconSearch from 'material-ui/svg-icons/action/search';
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
			funcionarios: [],
		}

		this.onStartDateChange = this.onStartDateChange.bind(this);
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

	onStartDateChange(n, date) {
		var inicial = moment.utc(date);
		var final = inicial.add(1, 'year').subtract(1, 'day')
		this.refs.form.inputs[2].setState({value: final.toDate()});
	}

	onSave(callback) {	
		this.refs.form.submit();
	}

	onSearch() {
		this.setState({search: true});
	}

	onSelect() {
		this.setState({search: false});
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
		if (this.state.progress) {
			console.log('Requisição pendente, aguarde...');
			return;
		}

	    this.setState({progress: true});

		var params = {
	        'TableName': table,
	        'Item': {
	        	id: uuid.v4(),
	        	type: 'Ferias',
	        	funcionario: data.funcionario,
	        	inicial: moment.utc(data.inicial).toJSON().substr(0, 10),
	        	final: moment.utc(data.final).toJSON().substr(0, 10),
	        	dias: data.dias,
	        	realizado: data.realizado
	        }
	    }

	    var result = function(err, data) {
	    	var context = this; 
	    	if (err) {
	    		console.log('Erro on create/update.');
	    		alert('Erro ao gravar os dados: ' + err);
	    	} else {
	    		console.log('Create/update OK.');
	    		if (context.props.onClose) context.props.onClose();
	    	}
	    }

	    dynamodb.put(params, result.bind(this));	
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
    	} = this.errorMessages;

		const items = [];
		items.forEach(function(v, k, a) {
			items.push(<MenuItem key={uuid.v4()} value={v.id} primaryText={v.text} />)
		})

		const funcionarios = [];
		this.state.funcionarios.forEach(function(v, k, a) {
			funcionarios.push(<MenuItem key={uuid.v4()} value={v} primaryText={v.nome} />)
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
			              name="funcionario"
			              required
			              floatingLabelText="Funcionário"
			              value={this.state.funcionario ? this.state.funcionario.nome : ''}
			              fullWidth={true}
			            >
			              {funcionarios}
			            </FormsySelect>
			            <FormsyDate
			              key="inicial"
			              name="inicial"
			              defaultDate={new Date()}
			              required
			              floatingLabelText="Data Inicial"
			              value={this.state.inicial}
			              onChange={this.onStartDateChange.bind(this)}
			            />
			            <FormsyDate
			              key="final"
			              name="final"
			              defaultDate={new Date()}
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
			              required
			              validations="isNumeric"
			              validationError={numericError}
			              hintText="Dias de direito"
			              floatingLabelText="Dias de direito"
			              value={30} 
			            />
			        </Formsy.Form>

				</Dialog>
			</div>
			</MuiThemeProvider>
		);
	}	
}