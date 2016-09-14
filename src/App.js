import React, { Component } from 'react';

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { AppBar, LinearProgress, FloatingActionButton, Toggle } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

import moment from 'moment';

// app
import Calendar from './Calendar';
import PostList from './PostList';
import FormDialog from './FormDialog';
import './App.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import 'aws-sdk/dist/aws-sdk';
const aws = window.AWS;

aws.config.update({accessKeyId: 'AKIAJROLVHLQQHOE72HA', secretAccessKey: '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','region': 'sa-east-1'});

const dynamodb = new aws.DynamoDB.DocumentClient();

const config = {
	table: 'altamira'
}

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

		this.state = {
			open: {
				empresa: false,
				funcionario: false,
				ferias: false,
				lancamentos: false,
				historico: false
			},
			progress: true,
			filter: false,
			date: this.props.date.clone(),
			items: []
		}

		this.items = [];

	    this.params = {
	        TableName: config.table,
	        IndexName: "cid-index",
	        KeyConditionExpression: "#pk = :pk",   
	        ExpressionAttributeNames: {
	            "#pk": "cid",
	            "#f": "id"
	        },
	        ExpressionAttributeValues: { 
	            ":pk": "r:hm.funcionario.ferias",
	            ":f": "00000000-0000-0000-0000-000000000000"
	        },
	        FilterExpression: "#f <> :f",
	        Projection: 'id, fields',
	        ExclusiveStartKey: null,
	        Limit: 10
	    }

	    var result = function(err, data) {
	    	const context = this;
	        //console.log(data)
	        if (err) {
	            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
	            context.setState({items: []});
	        } else {
	            //console.log("Query succeeded.");
	            
	            if (data.Count > 0) {
	            	//console.log(JSON.stringify(data.Items))

	            	data.Items.forEach(function(v, k, a) {

	            		/* outra forma de lista ordenada
            			var index = function(array, elem, data) {
						    var low = 0,
						        high = array.length;

						    while (low < high) {
						        var mid = (low + high) >>> 1;
						        var dt = array[mid].fields.inicial.value;
						        if (moment(dt.value).diff(data) < 0) {
						        	low = mid + 1;
						        } else {
						        	high = mid;
						        }
						    }
						    return low;
						}
            			var insert = function(elem, array) {
            				var data = elem.fields.inicial.value;
				            if (data) {
						  		array.splice(index(array, elem, moment(data.value)) + 1, 0, elem);
						  	}
						  	return array;
						}
	            		//context.items = insert(v, context.items);
	            		*/

						var addAndSort2 = function(arr, val) {
						    arr.push(val);
						    var i = arr.length - 1;
						    var item = moment(arr[i].fields.inicial.value)
				            try {
							    while (i > 0 && item.diff(moment(arr[i-1].fields.inicial.value)) < 0) {
							        arr[i] = arr[i-1];
							        i -= 1;
							    }
						    } catch(err) {
						    	console.log(err);
						    }
						    arr[i] = val;
						    return arr;
						}
	            		context.items = addAndSort2(context.items, v);
	              	})
	            }
	            if (data.LastEvaluatedKey) {
	              	context.params.ExclusiveStartKey = data.LastEvaluatedKey
	              	dynamodb.query(context.params, result.bind(context))
	            } else {
	            	//context.items.sort(function(a, b){return b-a});
	            	context.setState({items: context.items});
	              	//console.log('Fim do scan'); 
	            }
	        }
	    }

	    dynamodb.query(this.params, result.bind(this));	

		this.onOpen = this.onOpen.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onToggle = this.onToggle.bind(this);

	}

	onOpen(form) {
		var open = { funcionario: false, empresa: false, ferias: false, historico: false};
		if (form === 'empresa') open.empresa = true;
		if (form === 'funcionario') open.funcionario = true;
		if (form === 'ferias') open.ferias = true;
		if (form === 'historico') open.historico = true;
		this.setState({open: open});
	}

	onClose(form) {
		this.setState({open: { funcionario: false, ferias: false, empresa: false, historico: false}});
	}

	onToggle(event, value) {
		this.setState({filter: value})
	}

	render() {
		const dt1 = this.state.date.clone();

		const style = {
			display: 'inline-block',
			toggle: {
				marginBottom: 16,
			}
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

					<div style={{right: 20, marginRight: 230, top: 42, position: 'absolute', zIndex: 1200}}>
						<FloatingActionButton onTouchTap={this.onOpen.bind(this, 'ferias')} >
				      		<ContentAdd />
				    	</FloatingActionButton>
				    </div>

				    <FormDialog class='hm.funcionario.ferias' open={this.state.open.ferias} onClose={this.onClose.bind(this)} table={config.table} />

					<div style={{right: 20, marginRight: 160, top: 42, position: 'absolute', zIndex: 1200}}>
						<FloatingActionButton onTouchTap={this.onOpen.bind(this, 'empresa')} >
				      		<ContentAdd />
				    	</FloatingActionButton>
				    </div>

				    <FormDialog class='org.com.br.empresa' open={this.state.open.empresa} onClose={this.onClose.bind(this)} table={config.table} />

					<div style={{right: 20, marginRight: 90, top: 42, position: 'absolute', zIndex: 1200}}>
						<FloatingActionButton onTouchTap={this.onOpen.bind(this, 'funcionario')} >
				      		<ContentAdd />
				    	</FloatingActionButton>
				    </div>

				    <FormDialog class='hm.funcionario' open={this.state.open.funcionario} onClose={this.onClose.bind(this)} table={config.table} />

					<div style={{right: 20, marginRight: 20, top: 42, position: 'absolute', zIndex: 1200}}>
						<FloatingActionButton onTouchTap={this.onOpen.bind(this, 'historico')} >
				      		<ContentAdd />
				    	</FloatingActionButton>
				    </div>

				    <FormDialog class='hm.funcionario.ferias.historico' open={this.state.open.historico} onClose={this.onClose.bind(this)} table={config.table} />

					<LinearProgress mode="indeterminate" style={progress} />

					<div className='container' style={style}>
						<Calendar items={this.state.items} today={dt1.clone()} />
						<Toggle
							labelPosition="right"
					      	label={this.state.filter ? 'Filtro ativo :' + this.state.date.format('DD MMM YYYY') : ''}
					      	onToggle={this.onToggle} 
					      	style={style.toggle}
					    />
					</div>
					
					<div style={postit}><PostList date={dt1.clone()} items={this.state.items} table={config.table} /></div>

					{/*<div className='container' style={style}><Calendar items={this.state.items} today={dt1.add(1, 'month').clone()} /></div>

					<div style={postit}><PostList date={dt1.clone()} items={this.state.items} table={config.table} /></div>

					<div className='container' style={style}><Calendar items={this.state.items} today={dt1.add(1, 'month').clone()} /></div>
					
					<div style={postit}><PostList date={dt1.clone()} items={this.state.items} table={config.table} /></div>*/}

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