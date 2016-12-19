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
import Historico from './Historico/Edit';
import Ferias from './Ferias/EditForm';
import Empresa from './Empresa/CreateForm';
import Lancamento from './Historico/Lancamento';
import Funcionario from './Funcionario/SearchForm';
import Relatorio from './Historico/Relatorio';

// icons
import IconHistorico from 'material-ui/svg-icons/notification/event-note';
import IconFuncionario from 'material-ui/svg-icons/social/person-add';
import IconRelatorio from 'material-ui/svg-icons/action/print';
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
	        .get("http://localhost:1880/api/v2/rh/funcionarios")
	        .then(function(result) {   

	        	if (result.data instanceof Array && result.data.length > 0) {
					// acrescenta o nome do funcionário em cada período de férias
					var items = result.data.map(function(val, i) {

						let desconto = val.historico ? val.historico.reduce( (total, historico) => total + historico.dias, 0 ) : 0;

						let inicial = moment.utc(new Date(val.inicial.substr(0, 10))).clone();
						let final = inicial.clone().add(1, 'year').subtract(1, 'day');

						let ferias = [];

						let endDate = moment([new Date().getFullYear() + 1, 12, 31]);

					    while(final.diff(endDate, 'days') <= 0) {
				    	
				    		let d = 30 - Math.min(desconto, 30);

							ferias.push({  
					        	id: uuid.v4(),
					        	_id: val._id,
					        	type: 'Ferias',
					        	nome: val.nome,
					        	inicial: inicial.clone(),
					        	final: final.clone(),
					        	aquisicao: final.clone().add(1, 'days'),
					        	limite: final.clone().add(11, 'months').subtract(1, 'days'),
					        	dias: 30,
					        	saldo: d
				            });	

							if (desconto > 30) {
								desconto -= 30;		
							} else {
								desconto = 0;
							}				    		
					    	
				            inicial.add(1, 'year');    	
					    	final = inicial.clone().add(1, 'year').subtract(1, 'day');
					    }
					    result.data[i].ferias = ferias;
					  return ferias;
					}).reduce(function(pre, cur) {
					   return pre.concat(cur);
					}).map(function(e,i) {
					  return e;
					});

					let orderedItems = [];

					orderedItems = orderBy(items, ['inicial'], ['asc']);

					let orderedHistorico = result.data.map( (k, i) => {
						k.historico = orderBy(k.historico, ['inicio'], ['asc']);
						return k;
					})

					let orderedList = orderBy(orderedHistorico, ['empresa', 'nome'], ['asc']);

		          	this.setState({list: orderedList, items: orderedItems, progress: false});
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
		let item= this.state.list.find( (k) => k._id === v.id);
		this.setState({form: <Historico item={item} onClose={this.onClose.bind(this)} />});
	}

	onOpen(form) {
		if (form === 'empresa') this.setState({form: <Empresa onClose={this.onClose.bind(this)} />})
		if (form === 'funcionario') this.setState({form: <Funcionario onClose={this.onClose.bind(this)} />})
		if (form === 'ferias') this.setState({form: <Ferias onClose={this.onClose.bind(this)} />})
		if (form === 'historico') this.setState({form: <Lancamento onClose={this.onClose.bind(this)} />})
		if (form === 'relatorio') this.setState({form: <Relatorio list={this.state.list} onClose={this.onClose.bind(this)} />})
	}

	onClose(form) {
		this.setState({form: null}, this.onLoad());
	}

	onToggle(event, value) {
		this.setState({filter: false, filtered: null})
	}

	onFilter(dt) {
		var filter = this.state.items.filter(
			(k, y) => 
			k.final.clone().add(12, 'months').isSame(dt, 'day') ||
			k.final.clone().add(11, 'months').subtract(1, 'days').isSame(dt, 'day') ||
            k.final.clone().add(1, 'days').isSame(dt, 'day')
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
			var date = moment(v.final);
			var color = '';

			if (date.clone().add(12, 'months').diff(today, 'days') <= 0) {
				date.add(12, 'months');
				color = 'gray';
			} else if (date.clone().add(11, 'months').subtract(1, 'days').diff(today, 'days') <= 0) {
				date.add(11, 'months').subtract(1, 'days');
				color = 'red';
			} else if (date.clone().add(1, 'days').diff(today, 'days') <= 0) {
				date.add(1, 'days');
				color = 'yellow';
			} else {
				date.add(1, 'days');
			}

			return {
				key: uuid.v4(),
				id: v._id,
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
							<FloatingActionButton onTouchTap={this.onOpen.bind(this, 'relatorio')} >
					      		<IconRelatorio />
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

					{this.state.progress ? (<LinearProgress mode="indeterminate" style={progress} />) : noop() }

					{this.state.form ? this.state.form :

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