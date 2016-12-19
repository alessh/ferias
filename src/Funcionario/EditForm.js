import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { 
	Dialog, 
	AppBar, 
	LinearProgress, 
	FloatingActionButton, 
	MenuItem 
} from 'material-ui';

import IconDelete from 'material-ui/svg-icons/action/delete';
import IconSave from 'material-ui/svg-icons/action/done';
import IconExit from 'material-ui/svg-icons/navigation/close';

import Formsy from 'formsy-react';
import { 
	FormsyDate, 
    FormsySelect, 
    FormsyText, 
} from 'formsy-material-ui/lib';

import DeleteForm from './DeleteForm';

import axios from 'axios';

function toPrettyCase(str)
{
    return str ? str.replace(/\w\S*/g, function(txt){
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
    }) : '';
}

export default class Funcionario extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			progress: false,
		}

		this.onChange = this.onChange.bind(this);
		this.onOpen = this.onOpen.bind(this);
	    this.onSave = this.onSave.bind(this);
	    this.onDelete = this.onDelete.bind(this);
	    this.onClose = this.onClose.bind(this);
	    this.onCancel = this.onCancel.bind(this);
	    this.enableButton = this.enableButton.bind(this);
	    this.disableButton = this.disableButton.bind(this);
	    this.onSubmit = this.onSubmit.bind(this);
	    this.notifyFormError = this.notifyFormError.bind(this);

	    this.onLoad = this.onLoad.bind(this);

	}

	componentDidMount() {
		this.onLoad();
	}

	onLoad() {

		this.setState({progress: true});

	    this.serverRequest = 
	      axios
	        .get("http://localhost:1880/api/v2/rh/funcionario/" + this.props.id)
	        .then(function(result) { 
	        	let newState = result.data;
				newState.open = false;
				newState.progress = false;
				newState.inicial = new Date(newState.inicial);
				this.setState(newState);
	        }.bind(this))
	        .catch(function(err) {
	        	this.setState({progress: false})
	        	alert('Form error: ' + err);
	        }.bind(this))

	}

	onChange(event) {
		this.refs.nome.setState({value: toPrettyCase(event.target.value)});
	}

	onOpen() {
		this.setState({open: true});
	}

	onClose() {
		this.props.onClose();
	}

	onSave(callback) {	
		this.refs.form.submit();
	}

	onDelete(id) {
		if (this.props.onDelete)
			this.props.onDelete(id)
		else
			this.setState({open: true});
	}

	onCancel() {
		this.setState({open: false});
	}

	onSearch() {
		this.setState({search: true})
	}

	onSelect(funcionario) {
		this.setState({search: false})
	}

	errorMessages = {
		wordsError: "Use somente letras",
		numericError: "Use somente números",
		urlError: "Please provide a valid URL",
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

	onSubmit(data) {
		if (this.state.progress) {
			console.log('Requisição pendente, aguarde...');
			return;
		}

	    this.setState({progress: true});

	    this.funcionario = {
	    	_id: this.props.id,
        	type: 'Funcionario',
        	empresa: data.empresa,
        	nome: toPrettyCase(data.nome),
        	inicial: data.inicial.toISOString(),
        	situacao: data.situacao,
        	historico: []
	    }

		/*this.inicial = moment.utc(data.inicial);

	    while(this.inicial.diff(moment.utc(), 'days') < 0) {
	    	var final = this.inicial.clone().add(1, 'year').subtract(1, 'day');

			this.funcionario.ferias.push({  
	        	_id: uuid.v4(),
	        	type: 'Ferias',
	        	inicial: this.inicial.toISOString(),
	        	final: final.toISOString(),
	        	dias: 30,
	        	realizado: false
            });	

            this.inicial.add(1, 'year');    	
	    }*/

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

	notifyFormError(data) {
		console.error('Form error:', data);
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
				    	{ this.props.id ? (
				    		<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
								<FloatingActionButton onTouchTap={this.onOpen.bind(this)} >
						      		<IconDelete />
						    	</FloatingActionButton>
						    </div>
						) : (null)}

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
			              value={this.state.empresa}
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
			              value={toPrettyCase(this.state.nome)}
			              onChange={this.onChange.bind(this)}
			            /> 
			            <FormsyDate
			              name="inicial"
			              required
			              floatingLabelText="Data Admissão ou Data Inicial"
			              hintText="Data Admissão ou Data Inicial"
			              value={this.state.inicial}
			              formatDate={(e) => e.toLocaleDateString()}
			            />
			            <FormsySelect
			              name="situacao"
			              required
			              floatingLabelText="Situação"
			              hintText="Situação"
			              value={this.state.situacao}
			            >
			              <MenuItem value={'ativo'} primaryText="Ativo" />
			              <MenuItem value={'afastado'} primaryText="Afastado" />
			              <MenuItem value={'demitido'} primaryText="Demitido" />
			            </FormsySelect>
			        </Formsy.Form>

			        { this.state.open ? (<DeleteForm id={this.props.id} type={'Funcionario'} label={(<div><p>Tem certeza de excluir este Funcionario ?</p><p>{this.state.nome}</p></div>)} onDelete={this.onDelete.bind(this)} onCancel={this.onCancel.bind(this)} />) : (null) }

				</Dialog>
			</div>
			</MuiThemeProvider>
		);
	}	
}