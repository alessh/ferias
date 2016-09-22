import React, { Component } from 'react';

import uuid from 'node-uuid';
import moment from 'moment';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Dialog, AppBar, LinearProgress, FloatingActionButton, DatePicker, TextField } from 'material-ui';
import { Step, Stepper, StepButton, StepContent } from 'material-ui/Stepper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import IconNext from 'material-ui/svg-icons/navigation/chevron-right';
import IconPrevious from 'material-ui/svg-icons/navigation/chevron-left';
import IconSave from 'material-ui/svg-icons/action/done';
import IconExit from 'material-ui/svg-icons/navigation/close';

import 'aws-sdk/dist/aws-sdk';
const aws = window.AWS;

const table = 'altamira';

aws.config.update({accessKeyId: 'AKIAJROLVHLQQHOE72HA', secretAccessKey: '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','region': 'sa-east-1'});

const dynamodb = new aws.DynamoDB.DocumentClient();

export default class LancDialog extends Component {
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
    		stepIndex: 0,

    		startDate: this.props.value === undefined || this.props.value === null || this.props.value.trim() === '' ? moment.utc().format() : this.props.value,
    		endDate: this.props.value === undefined || this.props.value === null || this.props.value.trim() === '' ? moment.utc().format() : this.props.value,
    		historico: '',
    	 	items: []

		}

		this.items = [];

	    this.params = {
	        TableName: table,
	        IndexName: "type-id-index",
	        KeyConditionExpression: "#pk = :pk",   
	        ExpressionAttributeNames: {
	            "#pk": "type"
	        },
	        ExpressionAttributeValues: { 
	            ":pk": 'Funcionario'
	        },
	        Projection: 'ALL',
	        ExclusiveStartKey: null,
	        Limit: 10
	    }

	    var result = function(err, data) {
	    	const context = this;

	        if (err) {
	            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
	            context.setState({items: []});
	        } else {
	            
	            if (data.Count > 0) {
	            	data.Items.forEach(function(v, k, a) {
	            		context.items.push({id: v.id, empresa: 'ALTAMIRA', nome: v.nome, status: 'ok', selected: true});
	            	})
	            }
	            if (data.LastEvaluatedKey) {
	              	context.params.ExclusiveStartKey = data.LastEvaluatedKey
	              	dynamodb.query(context.params, result.bind(context))
	            } else {
	            	context.setState({items: context.items, progress: false});
	            }
	        }
	    }

	    dynamodb.query(this.params, result.bind(this));		            		

		this.onClose = this.onClose.bind(this);
		this.onSave = this.onSave.bind(this);

	    this.onNext = this.onNext.bind(this);
	    this.onPrev = this.onPrev.bind(this);	

	    this.onToggle = this.onToggle.bind(this);
	    this.onChange = this.onChange.bind(this);	

	}

	onClose() {
		this.props.onClose();
	}

	onSave() {
		this.setState({progress: true}, function() {
			this.props.onClose();
	    }.bind(this));
	}

	onNext = () => {
		const {stepIndex} = this.state;
		if (stepIndex < 2) {
		  	this.setState({stepIndex: stepIndex + 1});
		}
	};

	onPrev = () => {
		const {stepIndex} = this.state;
		if (stepIndex > 0) {
		  	this.setState({stepIndex: stepIndex - 1});
		}
	};

	onChangeStartDate = (event, date) => {
	    this.setState({
	      startDate: date.getTimezoneOffset() > 0 ? moment(date).subtract(date.getTimezoneOffset() / 60, 'h').toJSON() : moment(date).add(date.getTimezoneOffset() / 60, 'h').toJSON()
	    });
	};

	onChangeEndDate = (event, date) => {
	    this.setState({
	      endDate: date.getTimezoneOffset() > 0 ? moment(date).subtract(date.getTimezoneOffset() / 60, 'h').toJSON() : moment(date).add(date.getTimezoneOffset() / 60, 'h').toJSON()
	    });
	};

	onToggle = (event, toggled) => {
		this.setState({
			[event.target.name]: toggled,
		});
	};

	onChange = (event) => {
		this.setState({height: event.target.value});
	};

	render() {
		const progress = {
			marginTop: '3px',
			visibility: this.state.progress ? 'visible' : 'hidden'
		}

		const {stepIndex} = this.state;

    	const utc1 = moment.utc(this.state.startDate);
		const startDate = new Date(utc1.year(), utc1.month(), utc1.date(), utc1.toDate().getTimezoneOffset() / 60, 0, 0);

		const utc2 = moment.utc(this.state.endDate);
		const endDate = new Date(utc2.year(), utc2.month(), utc2.date(), utc2.toDate().getTimezoneOffset() / 60, 0, 0);

		return (
			<MuiThemeProvider>
				<div>
					<Dialog	
						modal={false}
						open={this.props.open}
						onRequestClose={this.props.onClose}
						autoScrollBodyContent={true}
						{...this.props} 
					>

				    	<AppBar title={this.props.label || this.state.label} >
					    	<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
								<FloatingActionButton onTouchTap={this.onNext.bind(this)} disabled={stepIndex === 1} >
						      		<IconNext />
						    	</FloatingActionButton>
						    </div>
					    	<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
								<FloatingActionButton onTouchTap={this.onPrev.bind(this)} disabled={stepIndex === 0}  >
						      		<IconPrevious />
						    	</FloatingActionButton>
						    </div>
					    	<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
								<FloatingActionButton onTouchTap={this.onSave.bind(this)} disabled={stepIndex === 0}  >
						      		<IconSave />
						    	</FloatingActionButton>
						    </div>
						    <div style={{top: 35, position: 'relative', zIndex: 1200}}>
								<FloatingActionButton onTouchTap={this.onClose.bind(this)} >
						      		<IconExit />
						    	</FloatingActionButton>
						    </div>
					    </AppBar>

					    <LinearProgress mode="indeterminate" style={progress} />

				        <Stepper activeStep={stepIndex} linear={false} orientation="vertical">
				          	<Step>
					            <StepButton onTouchTap={() => this.setState({stepIndex: 0})}>
					              	Detalhes do lançamento
					            </StepButton>
					            <StepContent>
					              	<div style={{display: 'inline-block'}}>
						            	<div style={{width: '50%'}}>
								            <DatePicker 
												id={uuid.v4()} 
												onChange={this.onChangeStartDate} 
												value={startDate} 
												formatDate={this.formatDate} 
												fullWidth={true}
												floatingLabelText={'Período Inicial'}
												floatingLabelFixed={true}
											/>
										</div>
										<div style={{width: '50%', align: 'right'}}>
											<DatePicker 
												id={uuid.v4()} 
												onChange={this.onChangeEndDate} 
												value={endDate} 
												formatDate={this.formatDate} 
												fullWidth={true}
												floatingLabelText={'Período Final'}
												floatingLabelFixed={true}
											/>
										</div>		
										<TextField 
											id={uuid.v4()} 
											onChange={(e) => this.setState({historico: e.target.value})} 
											value={this.state.historico} 
											fullWidth={true} 
											floatingLabelText={'Histórico'}
											floatingLabelFixed={true}
										/>							
									</div>
					            </StepContent>
				          	</Step>
				          	<Step>
					            <StepButton onTouchTap={() => this.setState({stepIndex: 1})}>
					              	Selecione os funcionários
					            </StepButton>
					            <StepContent>
					              	<Table
										height={this.state.height}
										fixedHeader={this.state.fixedHeader}
										fixedFooter={this.state.fixedFooter}
										selectable={this.state.selectable}
										multiSelectable={this.state.multiSelectable}
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
										  <TableRow key={index} selected={row.selected}>
										    <TableRowColumn>{row.empresa}</TableRowColumn>
										    <TableRowColumn>{row.nome}</TableRowColumn>
										    <TableRowColumn>{row.status}</TableRowColumn>
										  </TableRow>
										  ))}
										</TableBody>
									</Table>

				            	</StepContent>
				          	</Step>
				          	<Step>
					            <StepButton onTouchTap={() => this.setState({stepIndex: 2})}>
					              	Processamento
					            </StepButton>
					            <StepContent>
					            	<p>Processando...</p>
					            </StepContent>
					           </Step>
						</Stepper>				        

					</Dialog>
				</div>
			</MuiThemeProvider>
		);
	}	
}
