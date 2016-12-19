import React, { Component } from 'react';

import uuid from 'node-uuid';
import moment from 'moment';
import axios from 'axios';
import async from 'async';
import { omit, noop } from 'lodash';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { AppBar, FloatingActionButton, DatePicker, TextField } from 'material-ui';
import { Step, Stepper, StepButton } from 'material-ui/Stepper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import IconSave from 'material-ui/svg-icons/action/done';
import IconExit from 'material-ui/svg-icons/navigation/close';

import Confirm from './Confirm';
import Continue from './Continue';

export default class Historico extends Component {
	constructor(props) {
		super(props);

		this.state = {
			
			fixedHeader: true,
			fixedFooter: true,
			stripedRows: true,
			showRowHover: true,
			selectable: true,
			multiSelectable: true,
			enableSelectAll: true,
			deselectOnClickaway: false,
			showCheckboxes: true,
			height: '300px',

			progress: false,
			confirm: false,
			continue: false,
    		stepIndex: 0,

    		inicial: new Date(),
    		final: new Date(),
    		historico: '',
    		descricao: '',
    		dias: 1,

    	 	items: [],

		}

		this.onClose = this.onClose.bind(this);
		this.onSave = this.onSave.bind(this);

		this.onConfirm = this.onConfirm.bind(this);
		this.onCancel = this.onCancel.bind(this);

	    this.onLoad = this.onLoad.bind(this);	

	    this.onStartDateChange = this.onStartDateChange.bind(this);
		this.onEndDateChange = this.onEndDateChange.bind(this);

		this.onRowSelection = this.onRowSelection.bind(this);

	}

	componentWillMount() {
		this.onLoad();
	}

	onLoad() {

		this.setState({progress: true});

	    this.serverRequest = 
	      axios
	        .get("http://localhost:1880/api/v2/rh/funcionarios")
	        .then(function(result) {   


	        	this.setState({items: result.data.map( (k, i) => Object.assign(k, {selected: false})), progress: false});

	        }.bind(this))
	        .catch(function(err) {
	        	this.setState({progress: false});
	        	alert(err);
	        }.bind(this)) 

	}

	onClose() {
		this.props.onClose();
	}

	onConfirm() {
		this.setState({confirm: true});
	}

	onContinue() {
		this.setState({continue: false});
	}

	onCancel() {
		this.setState({confirm: false});
	}

	onSave() {
		if (this.state.progress) {
			console.log('Requisição pendente, aguarde...');
			return;
		}

	    this.setState({progress: true, confirm: false});

	    let context = this;

	    var inicial = moment.utc(context.state.inicial);
		var final = moment.utc(context.state.final);
		if (inicial.diff(final, 'days') > 0) { 
			alert('Data inicial não pode ser maior que data final.')
			return;
		}

	    async.eachSeries(
	    	this.state.items.filter( key => key.selected), 
	    	function(funcionario, callback) {

			    if (funcionario.historico === undefined || !(funcionario.historico instanceof Array)) {
			    	funcionario.historico = [];
			    }

			    funcionario.historico.push({
			    	id: uuid.v4(),
			    	type: 'Historico',
			    	inicio: moment.utc(context.state.inicial).toJSON().substr(0, 10),
			    	final: moment.utc(context.state.final).toJSON().substr(0, 10),
			    	historico: context.state.historico,
			    	dias: parseInt(context.state.dias, 10)
			    })

			    context.serverRequest = 
			      axios
			        .post("http://localhost:1880/api/v2/rh/funcionario", omit(funcionario, 'selected'))
			        .then(function(result) {   

			        	callback(null)

			        })
			        .catch(function(err) {
			        	callback(err);
			        })   

			}, function(err) {
			    if( err ) {
			      	alert('Erro no lancamento dos descontos: ', err);
			      	context.setState({progress: false, continue: false});
			    } else {
			    	context.setState({progress: false, continue: true});	
			    }
			}
		);			
	}

	onRowSelection(rows) {
		let newItems = this.state.items.map(
			(key, index) => Object.assign(key, {
				selected: (rows === 'all')
			})
		)
		if (rows instanceof Array) {
			rows.map( (key, index) => newItems[key].selected = true)
		}
		this.setState({ 
			items: newItems
		});
	}

	onStartDateChange = (event, date) => {

		var inicial = moment.utc(date);
		var final = moment.utc(this.refs.endDate.state.date);

		this.setState({
			inicial: date,
			final: this.state.final,
			dias: final.diff(inicial, 'days') + 1
		});	

	}

	onEndDateChange = (event, date) => {

		var inicial = moment.utc(this.refs.startDate.state.date);
		var final = moment.utc(date);
		
		this.setState({
			inicial: this.state.inicial,
			final: date,
			dias: final.diff(inicial, 'days') + 1
		});
	
	}

	render() {
		const { stepIndex } = this.state;

		return (
			<MuiThemeProvider>
				<div>
					<AppBar style={{marginTop: '83px', height: '2px'}} iconClassNameRight="muidocs-icon-navigation-expand-more" >
				    	<div style={{marginRight: 20, top: -30, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton 
								onTouchTap={this.onConfirm.bind(this)} 
								disabled={
									!this.state.historico.length || 
									!this.state.items.find( it => it.selected ) || 
									Number.isNaN(parseInt(this.state.dias, 10))
								} 
							>
					      		<IconSave />
					    	</FloatingActionButton>
					    </div>
					    <div style={{top: -30, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onClose.bind(this)} >
					      		<IconExit />
					    	</FloatingActionButton>
					    </div>
				    </AppBar>

				    {this.state.confirm ? 
				    	(<Confirm label={(<div><p>Confirma o lançamento do histórico ?</p></div>)} onCancel={this.onCancel.bind(this)} onConfirm={this.onSave.bind(this)} />) : noop()
				    }

				    {this.state.continue ? 
				    	(<Continue label={(<div><p>Os lançamentos do do histórico foram realizados com sucesso !</p><p>Deseja fazer mais lançamentos ?</p></div>)} onYes={this.onContinue.bind(this)} onNo={this.onClose.bind(this)} />) : noop()
				    }

					<div style={{width: '100%'}} >
				        <Stepper activeStep={stepIndex} style={{marginTop: '40px'}} linear={false}>
				          	<Step style={{width: '50%'}} >
					            <StepButton onTouchTap={() => this.setState({stepIndex: 0})}>
					              	Detalhes do lançamento
					            </StepButton>
				          	</Step>
				          	<Step style={{width: '50%'}} > 
					            <StepButton onTouchTap={() => this.setState({stepIndex: 1})}>
					              	Selecione os funcionários
					            </StepButton>
				          	</Step>
						</Stepper>		
					</div>
					<div style={{padding: '20px', minHeight: '300px', display: 'flex'}} >
						<div style={{width: '50%'}} >

			              	<div style={{display: 'inline-block'}}>
				            	<div style={{width: '50%'}}>
						            <DatePicker 
										id={uuid.v4()} 
										ref="startDate"
										onChange={this.onStartDateChange.bind(this)} 
										value={this.state.inicial} 
										formatDate={(e) => e.toLocaleDateString()}
										floatingLabelText={'Período Inicial'}
										floatingLabelFixed={true}
										fullWidth={true}
									/>
								</div>
								<div style={{width: '50%', align: 'right'}}>
									<DatePicker 
										id={uuid.v4()} 
										ref="endDate"
										onChange={this.onEndDateChange.bind(this)} 
										value={this.state.final} 
										formatDate={(e) => e.toLocaleDateString()} 
										floatingLabelText={'Período Final'}
										floatingLabelFixed={true}
										fullWidth={true}
									/>
								</div>
								<TextField 
									id={uuid.v4()} 
									onChange={(e) => this.setState({historico: e.target.value})} 
									value={this.state.historico} 
									floatingLabelText={'Histórico'}
									floatingLabelFixed={true}
									fullWidth={true}
								/>	
								<TextField 
									id={uuid.v4()} 
									onChange={(e) => this.setState({descricao: e.target.value})} 
									value={this.state.descricao} 
									floatingLabelText={'Descrição'}
									floatingLabelFixed={true}
									fullWidth={true}
									multiLine={true}
								/>		
								<TextField 
									id={uuid.v4()} 
									ref="dias"
									onChange={(e) => this.setState({dias: e.target.value})} 
									value={this.state.dias} 
									fullWidth={true} 
									floatingLabelText={'Dias'}
									floatingLabelFixed={true}
								/>						
							</div>

		
					    </div>
					    <div style={{width: '50%'}} >

			              	<Table
								height={this.state.height}
								fixedHeader={this.state.fixedHeader}
								fixedFooter={this.state.fixedFooter}
								selectable={this.state.selectable}
								multiSelectable={this.state.multiSelectable}
								onRowSelection={this.onRowSelection}>
								>
								<TableHeader
								displaySelectAll={this.state.showCheckboxes}
								adjustForCheckbox={this.state.showCheckboxes}
								enableSelectAll={this.state.enableSelectAll}
								>
								<TableRow>
								  <TableHeaderColumn colSpan="3" tooltip="Funcionários" style={{textAlign: 'center'}}>
								    Funcionários
								  </TableHeaderColumn>
								</TableRow>
								<TableRow>
								  <TableHeaderColumn tooltip="Empresa">Empresa</TableHeaderColumn>
								  <TableHeaderColumn tooltip="Nome">Nome</TableHeaderColumn>
								  <TableHeaderColumn tooltip="Status">Status</TableHeaderColumn>
								</TableRow>
								</TableHeader>
								<TableBody
								displayRowCheckbox={this.state.showCheckboxes}
								deselectOnClickaway={this.state.deselectOnClickaway}
								showRowHover={this.state.showRowHover}
								stripedRows={this.state.stripedRows}
								>
								{this.state.items.map( (row, index) => (
								  <TableRow key={index} selected={row.selected} >
								    <TableRowColumn>{row.empresa}</TableRowColumn>
								    <TableRowColumn>{row.nome}</TableRowColumn>
								    <TableRowColumn>{row.situacao}</TableRowColumn>
								  </TableRow>
								  ))}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</MuiThemeProvider>
		);
	}	
}
