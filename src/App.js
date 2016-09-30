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
import Ferias from './Ferias/EditForm';
import Empresa from './Empresa/CreateForm';
import Historico from './Historico/CreateForm';
import Funcionario from './Funcionario/SearchForm';

import Today from './Calendar/Today';

// icons
import IconHistorico from 'material-ui/svg-icons/notification/event-note';
import IconFuncionario from 'material-ui/svg-icons/social/person-add';
//import IconEmpresa from 'material-ui/svg-icons/social/location-city';
import IconFerias from 'material-ui/svg-icons/places/beach-access';

import axios from 'axios';
import moment from 'moment';
import uuid from 'node-uuid';

import postList from './PostIt/fakeList.json';

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
		this.setState({progress: true}, this.onLoad());
	}

	/*onLoad() {
		this.setState({progress: true}, this.load());
	}*/

	onLoad() {
		var _this = this;
	    this.serverRequest = 
	      axios
	        .post("http://sistema/api/rh/ferias/list", {
	        	page: 1,
	        	per_page: 100
	        })
	        .then(function(result) {   

	        	var items = [];

	        	/*for(var i = 0; i < categories.length; i++){
    
					items = items.concat($.map(categories[i].items,function(elem){
				        return {value:elem.itemId, label:elem.name};
				    }));
				}*/

				//var items = result.data.map(funcionario => funcionario.ferias.map(element => element));


				var items = result.data.map(function(val) {
					val.ferias.forEach(function(e, i, a) {
						e.nome = val.nome;
					})
				  return val.ferias;
				}).reduce(function(pre, cur) {
				   return pre.concat(cur);
				}).map(function(e,i) {
				  return e;
				});

	        	var addAndSort2 = function(arr, val) {
				    arr.push(val);
				    var i = arr.length - 1;
				    var item = moment(arr[i].aquisicao_inicial)
		            try {
					    while (i > 0 && item.diff(moment(arr[i-1].aquisicao_inicial)) < 0) {
					        arr[i] = arr[i-1];
					        i -= 1;
					    }
				    } catch(err) {
				    	console.log(err);
				    }
				    arr[i] = val;
				    return arr;
				}

				var orderItems = [];

	        	result.data.forEach(function(v, k, a) {
					orderItems = addAndSort2(items, v);	
				});

	          	_this.setState({
	            	items: orderItems
	          	});
	        })
	        .catch(function(err) {
	        	alert(err);
	        })
	}

	componentWillUnmount() {
		this.serverRequest.abort();
	}

	onEdit(v) {
		//alert('Edit: ' + v.id + ', ' + v.note);

		this.setState({form: <Ferias id={v.id} onClose={this.onClose.bind(this)} config={this.props.config} />});
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
		this.setState({open: { funcionario: false, ferias: false, empresa: false, historico: false}}, this.onLoad());
	}

	onToggle(event, value) {
		this.setState({filter: false, filtered: null})
	}

	onFilter(day) {
		var filter = []
		var dt = this.state.date.clone().date(day);
		this.state.items.forEach(function(v, k, a) {
			if (moment.utc(v.inicial).isSame(dt, 'day')) {
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
			width: '50%'
		}
		const progress = {
			marginTop: '3px',
			visibility: this.state.progress ? 'visible' : 'hidden'
		}

		var toPrettyCase = function(str) {
		    return str.replace(/\w\S*/g, function(txt){
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

		const postIts = postList.map(function(p) {
			p.note = toPrettyCase(p.note);

			return p;
		})
		/*const postList = this.state.items.map(function(v) {
			var today = moment.utc();
			var date = moment.utc(v.aquisicao_inicial);
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
    			color: color
    		}
		})*/

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(Theme)} >
				<div>
					<AppBar title="Controle de Férias" iconClassNameRight="muidocs-icon-navigation-expand-more" >

						<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onOpen.bind(this, 'ferias')} >
					      		<IconFerias />
					    	</FloatingActionButton>
					    </div>

						{/*<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onOpen.bind(this, 'empresa')} >
					      		<IconEmpresa />
					    	</FloatingActionButton>
					    </div>*/}

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

					{this.state.form}

				    {this.state.open.ferias ? (<Ferias onClose={this.onClose.bind(this)} />) : (null) }

				    {this.state.open.empresa ? (<Empresa onClose={this.onClose.bind(this)} />) : (null) }

				    {this.state.open.funcionario ? (<Funcionario onClose={this.onClose.bind(this)} />) : (null) }

				    {this.state.open.historico ? (<Historico onClose={this.onClose.bind(this)} />) : (null) }

					{this.state.progress ? (<LinearProgress mode="indeterminate" style={progress} />) : ('') }

					<Today date={dt1.clone()} today={true} onNext={this.onNext.bind(this)} onPrev={this.onPrev.bind(this)} />

					<div className='container' style={style}>
						<Calendar items={this.state.items} filter={this.state.filtered} date={dt1.clone()} onFilter={this.onFilter.bind(this)} onNext={this.onNext.bind(this)} onPrev={this.onPrev.bind(this)} />
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

						<PostList items={this.state.filtered || postIts } onClick={this.onEdit.bind(this)} />

					</div>

				</div>
	        </MuiThemeProvider>		
		);
	}
}

export default App;