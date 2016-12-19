import React, { Component } from 'react';

import { ListItem } from 'material-ui';

import IconEdit from 'material-ui/svg-icons/content/create';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { 
	Dialog, 
	AppBar, 
	LinearProgress, 
	FloatingActionButton, 
	List
} from 'material-ui';

import IconAdd from 'material-ui/svg-icons/content/add';
import IconSearch from 'material-ui/svg-icons/action/search';
import IconExit from 'material-ui/svg-icons/navigation/close';

import Formsy from 'formsy-react';
import { 
    FormsyText, 
} from 'formsy-material-ui/lib';

import CreateForm from './CreateForm';
import EditForm from './EditForm';

import uuid from 'node-uuid';
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

class Item extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false
		}

		this.onOpen = this.onOpen.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onDelete = this.onDelete.bind(this);
	}
	
	onOpen() {
		this.setState({open: true});
	}

	onClose() {
		if (this.props.onClose) this.props.onClose();
	}

	onSave(value) {
		if (this.props.onSave) this.props.onSave(value);
	}

	onDelete(id) {
		if (this.props.onDelete) this.props.onDelete(id);
	}

	render() {
		return (
			<ListItem key={uuid.v4()} id={this.props.id} primaryText={this.props.nome} onTouchTap={this.onOpen} rightIcon={<IconEdit />} >
				{ this.state.open ? (<EditForm {...this.props} onClose={this.onClose.bind(this)} onSave={this.onSave.bind(this)} onDelete={this.onDelete.bind(this)} label={this.props.nome} />) : (null) }
			</ListItem>
		);
	}
}

export default class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			progress: false,
			nome: '',
			items: []
		}

	    this.onChange = this.onChange.bind(this);
	    this.onSearch = this.onSearch.bind(this);
	    this.onDone = this.onDone.bind(this);

	    // Edit Form Actions
	    this.onOpen = this.onOpen.bind(this);
	    this.onClose = this.onClose.bind(this);
	    this.onSave = this.onSave.bind(this);
	    this.onDelete = this.onDelete.bind(this);
	}

	onSearch() {
		if (this.state.progress) {
			console.log('Requisição pendente, aguarde...');
			return;
		}

		this.setState({progress: true});

	    this.serverRequest = 
	      axios
	        .post("http://localhost:1880/api/v2/rh/funcionarios", {nome: toPrettyCase(this.refs.nome.state.value)})
	        .then(function(result) {   

	        	this.setState({items: result.data, progress: false});

	        }.bind(this))
	        .catch(function(err) {
	        	this.setState({progress: false});
	        	alert(err);
	        }.bind(this))    

	}

	onDone() {
		this.props.onClose();
	}

	onOpen() {
		this.setState({open: true});
	}

	onClose() {
		this.setState({open: false});
	}

	onSave(value) {
		var index = this.state.items.findIndex(function(e, i ,a) {
			return e._id === value._id;
		})
		if (index >= 0) {
			var items = this.state.items;
			items[index] = value;
			this.setState({open: false, items: items});
		} else {
			this.setState({open: false});
		}
	}

	onDelete(id) {
		var index = this.state.items.findIndex(function(e, i ,a) {
			return e.id === id;
		})
		if (index >= 0) {
			var items = this.state.items;
			items.splice(index, 1);
			this.setState({open: false, items: items});
		} else {
			this.setState({open: false});
		}	
	}

	onChange(event) {	
		this.setState({nome: toPrettyCase(event.target.value), items: []});
	}

	errorMessages= {
		wordsError: "Use somente letras"
	}

	render() {
		const items = [];
		const context = this;
		this.state.items.forEach(function(v, k, a) {
			items.push(<Item key={uuid.v4()} id={v._id} nome={v.nome} onClose={context.onClose.bind(context)} onSave={context.onSave.bind(context)} onDelete={context.onDelete.bind(context)} config={context.props.config} />)
		})
		let { 
    		wordsError, 
    		//numericError, 
    		//urlError 
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

			    	<AppBar title={'Busca de Funcionário'} >
				    	<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onOpen.bind(this)} >
					      		<IconAdd />
					    	</FloatingActionButton>
					    </div>
					    <div style={{top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onDone.bind(this)} >
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
					    <div style={{display: 'inline-block', marginTop: 50, width: '100%'}}>
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
								value={this.state.nome}
								style={{width: '93%'}}
				            />

				    		<FloatingActionButton onTouchTap={this.onSearch.bind(this)} mini={true} disabled={!(this.state.nome && this.state.nome.trim().length > 0)} >
					      		<IconSearch />
					    	</FloatingActionButton>

						</div>
				    </Formsy.Form>

					<List style={{marginTop: 50}}>
	      				{items}
	    			</List>

	    			{ this.state.open ? 
	    				(
	    					<CreateForm onClose={this.onClose.bind(this)} onSave={this.onSave.bind(this)} onDelete={this.onDelete.bind(this)} label={'Novo Funcionário'} />
	    				) : (<p></p>)
	    			}

				</Dialog>

			</div>
			</MuiThemeProvider>
		);
	}	
}