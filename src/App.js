import React, { Component } from 'react';

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Theme from './Theme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { AppBar, LinearProgress, FloatingActionButton, Toggle } from 'material-ui';
import IconHistorico from 'material-ui/svg-icons/notification/event-note';
import IconFuncionario from 'material-ui/svg-icons/social/person-add';
import IconEmpresa from 'material-ui/svg-icons/social/location-city';
import IconFerias from 'material-ui/svg-icons/places/beach-access';

import moment from 'moment';

// app
import Calendar from './Calendar';
import PostList from './PostList';
import FormDialog from './FormDialog';
import LancamentoDialog from './LancDialog';
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
/*const muiTheme = getMuiTheme({
	floatingActionButton: {
		color: 'lightgray',
		iconColor: 'rgb(0, 188, 212)'
	}
});*/

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
			items: [],
			filtered: null
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
						//var date = moment.utc(v.fields.inicial.value);

						//if ((context.state.filter && date.isSame(context.state.date, 'day')) || (date < context.state.date)) {
							context.items = addAndSort2(context.items, v);	
						//}
	            		
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

	    this.onNext = this.onNext.bind(this);
	    this.onPrev = this.onPrev.bind(this); 
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
		this.setState({filter: false, filtered: null})
	}

	onFilter(day) {
		var filter = []
		var dt = this.state.date.clone().date(day);
		this.state.items.forEach(function(v, k, a) {
			if (moment.utc(v.fields.inicial.value).isSame(dt, 'day')) {
				filter.push(v);
			}
		})
		this.setState({filter: true, date: this.state.date.date(day), filtered: filter});
	}

	onNext(event) {
		this.setState({date: this.state.date.add(1, 'month'), filter: false, filtered: null});
	};

	onPrev(event) {
		this.setState({date: this.state.date.subtract(1, 'month'), filter: false, filtered: null});
	};

	render() {
		const dt1 = this.state.date.clone();

		const style = {
			display: 'inline-block',
			toggle: {
				marginBottom: 16,
				top: 50,
				align: 'right'
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
			<MuiThemeProvider muiTheme={getMuiTheme(Theme)} >
				<div>
					<AppBar title="Controle de Férias" iconClassNameRight="muidocs-icon-navigation-expand-more" >

						<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onOpen.bind(this, 'ferias')} >
					      		<IconFerias />
					    	</FloatingActionButton>
					    </div>

						<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onOpen.bind(this, 'empresa')} >
					      		<IconEmpresa />
					    	</FloatingActionButton>
					    </div>

						<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onOpen.bind(this, 'funcionario')} >
					      		<IconFuncionario />
					    	</FloatingActionButton>
					    </div>

						<div style={{top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onOpen.bind(this, 'historico')} >
					      		<IconHistorico />
					    	</FloatingActionButton>
					    </div>

					</AppBar>

				    <FormDialog class='hm.funcionario.ferias' open={this.state.open.ferias} onClose={this.onClose.bind(this)} table={config.table} />

				    <FormDialog class='org.com.br.empresa' open={this.state.open.empresa} onClose={this.onClose.bind(this)} table={config.table} />

				    <FormDialog class='hm.funcionario' open={this.state.open.funcionario} onClose={this.onClose.bind(this)} table={config.table} />

				    <LancamentoDialog class='hm.funcionario.ferias.historico' open={this.state.open.historico} onClose={this.onClose.bind(this)} table={config.table} label={'Histórico de Férias'} />

					<LinearProgress mode="indeterminate" style={progress} />

					<div className='container' style={style}>
						<Calendar items={this.state.filtered || this.state.items} today={dt1.clone()} onFilter={this.onFilter.bind(this)} onNext={this.onNext.bind(this)} onPrev={this.onPrev.bind(this)} />
					</div>
					
					<div style={postit}>
						
						{this.state.filter ? 
							(<div style={{textAlign: 'right'}}><Toggle
							labelPosition="left"
					      	label={this.state.filter ? 'Filtro ativo ' + this.state.date.format('DD MMM YYYY') : ''}
					      	onToggle={this.onToggle} 
					      	style={style.toggle}
					      	toggled={this.state.filter}
					      	/></div>) : 
					      	(<p></p>)
					    }

						<PostList date={dt1.clone()} items={this.state.filtered || this.state.items} table={config.table} />

					</div>

				</div>
	        </MuiThemeProvider>		
		);
	}
}

export default App;