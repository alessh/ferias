import React, { Component } from 'react';

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Theme from './Theme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { AppBar, LinearProgress, FloatingActionButton, Chip } from 'material-ui';

// app
import './App.css';
import Calendar from './Calendar/Calendar';
import PostList from './PostIt/PostList';
import List from './Funcionario/List';
import Ferias from './Ferias/EditForm';
import Empresa from './Empresa/CreateForm';
import Historico from './Historico/Lancamento';
import Funcionario from './Funcionario/SearchForm';

// icons
import IconHistorico from 'material-ui/svg-icons/notification/event-note';
import IconFuncionario from 'material-ui/svg-icons/social/person-add';
//import IconEmpresa from 'material-ui/svg-icons/social/location-city';
//import IconFerias from 'material-ui/svg-icons/places/beach-access';

import axios from 'axios';
import moment from 'moment';
import uuid from 'node-uuid';
import { noop, orderBy } from 'lodash';

//import postIts from './PostIt/fakeList.json';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

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
			progress: false,
			filter: false,
			date: moment.utc(),
			items: [],
			filtered: null,
			form: null
		}

		this.onOpen = this.onOpen.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onToggle = this.onToggle.bind(this);

	    this.onNext = this.onNext.bind(this);
	    this.onPrev = this.onPrev.bind(this); 

	    this.onLoad = this.onLoad.bind(this);
	    this.onEdit = this.onEdit.bind(this);

	}

	componentDidMount() {
		this.onLoad();
	}

	onLoad() {
		this.setState({progress: true});

	    this.serverRequest = 
	      axios
	        .get("http://sistema/api/v2/rh/funcionarios")
	        .then(function(result) {   

	        	if (result.data instanceof Array && result.data.length > 0) {
					// acrescenta o nome do funcionário em cada período de férias
					var items = result.data.map(function(val, i) {

						let desconto = val.historico ? val.historico.reduce( (total, historico) => total + historico.dias, 0 ) : 0;

						let inicial = moment.utc(new Date(val.inicial.substr(0, 10))).clone().add(1, 'year');

						let ferias = [];

					    while(inicial.diff(moment(new Date()), 'days') < 0) {
					    	var final = inicial.clone().add(1, 'year').subtract(1, 'day');

					    	if (desconto < 30) {
								ferias.push({  
						        	_id: uuid.v4(),
						        	type: 'Ferias',
						        	nome: val.nome,
						        	inicial: inicial.clone(),
						        	final: final.clone(),
						        	dias: 30 - desconto
					            });	
					            desconto = 0;
					    	} else {
					    		desconto -= 30;	
					    	}
					    	
				            inicial.add(1, 'year');    	
					    }
					    result.data[i].ferias = ferias;
					  return ferias;
					}).reduce(function(pre, cur) {
					   return pre.concat(cur);
					}).map(function(e,i) {
					  return e;
					});

					var orderedItems = [];

					orderedItems = orderBy(items, ['inicial'], ['asc']);

		          	this.setState({list: result.data, items: orderedItems, progress: false});
		        } else {
		        	this.setState({progress: false});
		        }
	        }.bind(this))
	        .catch(function(err) {
	        	alert(err);
	        	this.setState({progress: false})
	        }.bind(this))
	}

	onEdit(v) {
		this.setState({form: <List list={this.state.list} onClose={this.onClose.bind(this)} />});
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
		this.setState({form: null, open: { funcionario: false, ferias: false, empresa: false, historico: false}}, this.onLoad());
	}

	onToggle(event, value) {
		this.setState({filter: false, filtered: null})
	}

	onFilter(dt) {
		var filter = this.state.items.filter(
			(k, y) => 
			k.inicial.clone().add(12, 'months').isSame(dt, 'day') ||
			k.inicial.clone().add(11, 'months').isSame(dt, 'day') ||
            k.inicial.isSame(dt, 'day')
        )

		this.setState({filter: true, date: dt, filtered: filter});
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
			},
			chip: {
				marginRight: 5
			},
			wrapper: {
				marginTop: 50,
				width: '100%',
			},
		}
		const postit = {
			display: 'inline-block',
			marginTop: '40px',
			width: '50%'
		}
		const progress = {
			marginTop: '3px',
			visibility: this.state.progress ? 'visible' : 'hidden'
		}

		var toPrettyCase = function(str) {
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

		let items = this.state.filtered || this.state.items;
		const postIts = items.map(function(v) {
			var today = moment(new Date());
			var date = moment(v.inicial);
			var color = '';

			if (date.clone().add(12, 'months').diff(today, 'days') <= 0) {
				color = 'gray';
			} else if (date.clone().add(11, 'months').diff(today, 'days') <= 0) {
				color = 'red';
			} else if (date.diff(today, 'days') <= 0) {
				color = 'yellow';
			}

			return {
				key: uuid.v4(),
				id: uuid.v4(),
				title: date.format('DD/MM/YYYY'),
    			note: toPrettyCase(v.nome),
    			cite: v.dias + (v.dias > 1 ? ' dias' : 'dia'),
    			color: color
    		}
		})

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(Theme)} >
				<div>
					<AppBar title="Controle de Férias" iconClassNameRight="muidocs-icon-navigation-expand-more" >

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

					{this.state.progress ? (<LinearProgress mode="indeterminate" style={progress} />) : noop() }

				    {this.state.open.ferias ? (<Ferias onClose={this.onClose.bind(this)} />) : noop() }

				    {this.state.open.empresa ? (<Empresa onClose={this.onClose.bind(this)} />) : noop() }

				    {this.state.open.funcionario ? (<Funcionario onClose={this.onClose.bind(this)} />) : noop() }

					{this.state.form ? this.state.form : this.state.open.historico ? 

						(<Historico onClose={this.onClose.bind(this)} />) :

						(	
							<div style={{marginTop: '30px'}}>
								<div className='container' style={style}>
									<Calendar 
										items={this.state.items} 
										filter={this.state.filtered} 
										date={dt1.clone()} 
										onFilter={this.onFilter.bind(this)} 
										onNext={this.onNext.bind(this)} 
										onPrev={this.onPrev.bind(this)} 
									/>
								</div>
								
								<div style={postit}>
									
									{this.state.filter ? 
										(<div style={style.wrapper}>
								      	<Chip
								          onRequestDelete={this.onToggle.bind(this)}
								          onTouchTap={this.onToggle.bind(this)}
								          style={style.chip}
								        >
								          {this.state.filter ? 'Filtro ativo ' + this.state.date.format('DD MMM YYYY') : ''}
								        </Chip></div>
								      	) : null
								      	
								    }

									{postIts.length > 0 ? (<PostList items={postIts} onClick={this.onEdit.bind(this)} />) : noop()}

								</div>
							</div>
						)
					}

				</div>
	        </MuiThemeProvider>		
		);
	}
}

export default App;