import React, { Component } from 'react';

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { AppBar, FloatingActionButton } from 'material-ui';

import IconExit from 'material-ui/svg-icons/navigation/close';
	
import uuid from 'node-uuid';
import moment from 'moment';
import axios from 'axios';

import { noop } from 'lodash';

import Confirm from './Confirm';

export default class List extends Component {
	constructor(props) {
		super(props);

		this.state = {
			confirm: false
		}

		this.onOpen = this.onOpen.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onDelete = this.onDelete.bind(this);

		this.onConfirm = this.onConfirm.bind(this);
		this.onCancel = this.onCancel.bind(this);
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

	onCancel() {
		this.setState({confirm: false})
	}

	onConfirm(id) {
		this.setState({confirm: true, id: id});
	}

	onDelete(index) {
		this.setState({progress: true});

		this.props.item.historico.splice([index], 1);

	    this.serverRequest = 
	      axios
	        .post("http://localhost:1880/api/v2/rh/funcionario/", this.props.item)
	        .then(function(result) {   
	        	this.setState({progress: false, confirm: false});
	        }.bind(this))
	        .catch(function(err) {
	        	this.setState({progress: false, confirm: false});
	        	alert(err);
	        }.bind(this)) 
	}

	render() {

		return (
			<MuiThemeProvider>
				<div>
					<AppBar style={{marginTop: '83px', height: '2px'}} iconClassNameRight="muidocs-icon-navigation-expand-more" >
					    <div style={{top: -30, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.props.onClose} >
					      		<IconExit />
					    	</FloatingActionButton>
					    </div>
				    </AppBar>

				    {this.state.confirm ? 
				    	(<Confirm label={(<div><p>Confirma a exclusão do lançamento ?</p></div>)} onCancel={this.onCancel.bind(this)} onConfirm={this.onDelete.bind(this, this.state.id)} />) : noop()
				    }

				    <table key={uuid.v4()} style={{margin: '40px', width: '90%', borderCollapse: 'collapse'}} >
				    	
					    	<thead key={uuid.v4()} style={{fontSize: '1.2em'}} >
					    		<tr key={uuid.v4()} style={{borderBottom: '2px solid black', borderTop: '2px solid black'}} >
					    			<td key={uuid.v4()} colSpan="2" style={{fontSize: '2.2em'}} >{this.props.item.nome}</td>
					    		</tr>
					    		<tr>
					    			<td key={uuid.v4()} colSpan="2">
					    				<table key={uuid.v4()} > 
					    					<thead key={uuid.v4()} >
					    						<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} style={{backgroundColor: 'lightgray'}} >Data de admissão</td>
					    							<td key={uuid.v4()} >{moment(this.props.item.inicial.substr(0, 10)).format('DD/MM/YYYY')}</td>
					    						</tr>
					    						<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} style={{backgroundColor: 'lightgray'}} >Empresa</td>
					    							<td key={uuid.v4()} >{this.props.item.empresa}</td>
					    						</tr>
					    					</thead>
					    				</table>
					    			</td>
					    		</tr>
					    	</thead>

					    	<tbody key={uuid.v4()} style={{align: 'center', verticalAlign: 'top', fontSize: '1.2em', textAlign: 'center'}} >

					    		<tr key={uuid.v4()} >

					    			<td key={uuid.v4()} >
					    				<table key={uuid.v4()} style={{width: '100%'}} >

					    					<thead key={uuid.v4()} style={{backgroundColor: 'lightgray'}} >
					    						<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} colSpan="5" >Férias</td>
					    						</tr>
					    						<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} colSpan="5" >Período Aquisitivo</td>
					    						</tr>
					    						<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} >Inicial</td>
					    							<td key={uuid.v4()} >Final</td>
					    							<td key={uuid.v4()} >Adquirido Em</td>
					    							<td key={uuid.v4()} >Limite</td>
					    							<td key={uuid.v4()} >Saldo</td>
					    						</tr>
					    					</thead>

					    					<tbody key={uuid.v4()} >
								    			{this.props.item.ferias && 
								    				this.props.item.ferias.map( (w, y) => (
									    			<tr key={uuid.v4()} >
									    				<td key={uuid.v4()} >
									    					{w.inicial.format('DD/MM/YYYY')}
									    				</td>
									    				<td key={uuid.v4()} >
									    					{w.final.format('DD/MM/YYYY')}
									    				</td>
									    				<td key={uuid.v4()} >
									    					{w.final.clone().add(1, 'days').format('DD/MM/YYYY')}
									    				</td>
									    				<td key={uuid.v4()} >
									    					{w.limite.format('DD/MM/YYYY')}
									    				</td>
									    				<td key={uuid.v4()} >
									    					{w.saldo}
									    				</td>
									    			</tr>))
								    			}
								    		</tbody>

								    	</table>
								    </td>

					    			<td key={uuid.v4()} >
					    				<table key={uuid.v4()} style={{width: '100%'}}>

											<thead key={uuid.v4()} style={{backgroundColor: 'lightgray'}}>
												<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} colSpan="5" >Histórico</td>
					    						</tr>
					    						<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} colSpan="5" >Histórico de Lançamentos</td>
					    						</tr>
					    						<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} >Inicial</td>
					    							<td key={uuid.v4()} >Final</td>
					    							<td key={uuid.v4()} >Dias</td>
					    							<td key={uuid.v4()} >Histórico</td>
					    							<td key={uuid.v4()} style={{width: '1%'}} ></td>
					    						</tr>
					    					</thead>

					    					<tbody key={uuid.v4()} >
									    		{this.props.item.historico && 
									    			this.props.item.historico.map( (w, y) => (
									    			<tr key={uuid.v4()} >
									    				<td key={uuid.v4()} >
									    					{moment.utc(w.inicio).format('DD/MM/YYYY')}
									    				</td>
									    				<td key={uuid.v4()} >
									    					{moment.utc(w.final).format('DD/MM/YYYY')}
									    				</td>
									    				<td key={uuid.v4()} >
									    					{w.dias}
									    				</td>
									    				<td key={uuid.v4()} >
									    					{w.historico}
									    				</td>
									    				<td key={uuid.v4()} style={{width: '5%'}} >
									    					<FloatingActionButton mini={true} onTouchTap={this.onConfirm.bind(this, y)} >
													      		<IconExit />
													    	</FloatingActionButton>
									    				</td>
									    			</tr>))
									    		}
									    	</tbody>
								    	</table>
								    </td>

					    		</tr>
					    	</tbody>
					    </table>
				
				</div>
			</MuiThemeProvider>
		)
	}
}