import React, { Component } from 'react';

import uuid from 'node-uuid';
import axios from 'axios';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { 
	Dialog, 
	AppBar, 
	LinearProgress, 
	FloatingActionButton, 
	MenuItem 
} from 'material-ui';

import Formsy from 'formsy-react';
import { 
	FormsyDate, 
    FormsySelect, 
    FormsyText, 
} from 'formsy-material-ui/lib';

import IconSave from 'material-ui/svg-icons/action/done';
import IconExit from 'material-ui/svg-icons/navigation/close';

function toPrettyCase(str)
{
    return !str ? '' : str.replace(/\w\S*/g, function(txt){
    	switch(txt.toLowerCase()) {
    		case 'da':
    		case 'do':
    		case 'de':
    		case 'e':
    		case 'das':
    		case 'dos':
    			return txt.toLowerCase();
    		default:
    			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    	}
    });
}

export default class Funcionario extends Component {
	constructor(props) {
		super(props);

		this.state = {
			progress: false,
		}

		this.onChange = this.onChange.bind(this);
	    this.onSave = this.onSave.bind(this);
	    this.onClose = this.onClose.bind(this);
	    this.enableButton = this.enableButton.bind(this);
	    this.disableButton = this.disableButton.bind(this);
	    this.onSubmit = this.onSubmit.bind(this);
	    this.notifyFormError = this.notifyFormError.bind(this);

	}

	onChange(event) {
		this.refs.nome.setState({value: toPrettyCase(event.target.value)});
	}

	onClose() {
		this.props.onClose();
	}

	onSave(callback) {	
		this.refs.form.submit();
	}

	errorMessages= {
		wordsError: "Use somente letras",
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

	notifyFormError(data) {
		console.error('Form error:', data);
		alert('Form error:' + data);
	}

	onSubmit(data) {
		if (this.state.progress) {
			console.log('Gravando Funcionario...');
			return;
		}

	    this.setState({progress: true});

	    this.funcionario = {
	    	_id: uuid.v4(),
        	type: 'Funcionario',
        	empresa: data.empresa,
        	nome: toPrettyCase(data.nome),
        	inicial: data.inicial.toISOString(),
        	situacao: data.situacao,
        	historico: []
	    }

	    this.serverRequest = 
	      axios
	        .post("http://localhost:1880/api/v2/rh/funcionario", this.funcionario)
	        .then(function(result) {   

	        	this.setState({progress: false}, this.props.onSave.bind(null, this.funcionario));

	        }.bind(this))
	        .catch(function(err) {
	        	this.setState({progress: false})
	        	alert(err);
	        }.bind(this))    
	}

	render() {
    	let { 
    		wordsError, 
    	} = this.errorMessages;

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

			    	<AppBar title={this.props.label} >
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
			            onValidSubmit={this.onSubmit}
			            onInvalidSubmit={this.notifyFormError}
			            ref='form'
			          >
			          	<FormsySelect
			              name="empresa"
			              required
			              floatingLabelText="Empresa"
			              value={'Altamira'}
			            >
			              <MenuItem value={'Altamira'} primaryText="Altamira" />
			              <MenuItem value={'Tecnequip'} primaryText="Tecnequip" />
			              <MenuItem value={'Proalta'} primaryText="Proalta" />
			            </FormsySelect>
			          	<FormsyText
			              name="nome"
			              ref="nome"
			              validations="isWords"
			              validationError={wordsError}
			              required
			              hintText="Nome do funcionário"
			              floatingLabelText="Nome do Funcionário"
			              fullWidth={true} 
			              onChange={this.onChange.bind(this)}
			            /> 
			            <FormsyDate
			              name="inicial"
			              required
			              floatingLabelText="Data Admissão ou Data Inicial"
			              hintText="Data Admissão ou Data Inicial"
			              value={new Date()}
			              formatDate={(e) => e.toLocaleDateString()}
			            />
			            <FormsySelect
			              name="situacao"
			              required
			              floatingLabelText="Situação"
			              hintText="Situação"
			              value={'ativo'}
			            >
			              <MenuItem value={'ativo'} primaryText="Ativo" />
			              <MenuItem value={'afastado'} primaryText="Afastado" />
			              <MenuItem value={'demitido'} primaryText="Demitido" />
			            </FormsySelect>
			        </Formsy.Form>

				</Dialog>
			</div>
			</MuiThemeProvider>
		);
	}	
}