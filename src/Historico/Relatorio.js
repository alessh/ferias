import React, { Component } from 'react';

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { AppBar, FloatingActionButton } from 'material-ui';

import IconExit from 'material-ui/svg-icons/navigation/close';

import uuid from 'node-uuid';
import moment from 'moment';

export default class Relatorio extends Component {
	constructor(props) {
		super(props);

		this.onOpen = this.onOpen.bind(this);
		this.onClose = this.onClose.bind(this);
	}

	onOpen() {
		this.setState({open: true});
	}

	onClose() {
		if (this.props.onClose) this.props.onClose();
	}

	render() {

		let empresa = '';

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

				    {this.props.list.map( (k, i) => 
				    	
						<table key={uuid.v4()} style={{margin: '40px', width: '90%', borderCollapse: 'collapse'}} >
				    	
					    	<thead key={uuid.v4()} style={{fontSize: '1.2em'}} >
					    				
					    		{k.empresa !== empresa ?
						    		<tr key={uuid.v4()} style={{borderBottom: '2px solid black', color: 'gray', borderTop: '2px solid black', textAlign: 'center'}} >
						    			<td key={uuid.v4()} colSpan="2" style={{fontSize: '2.2em'}} >{(empresa = k.empresa)}</td>
						    		</tr>
						    		: null
						    	}

					    		<tr key={uuid.v4()} style={{borderBottom: '2px solid black', borderTop: '2px solid black'}} >
					    			<td key={uuid.v4()} colSpan="2" style={{fontSize: '2.2em'}} >{k.nome}</td>
					    		</tr>
					    		<tr>
					    			<td key={uuid.v4()} colSpan="2">
					    				<table key={uuid.v4()} > 
					    					<thead key={uuid.v4()} >
					    						<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} style={{backgroundColor: 'lightgray'}} >Data de admissão</td>
					    							<td key={uuid.v4()} >{moment(k.inicial.substr(0, 10)).format('DD/MM/YYYY')}</td>
					    						</tr>
					    						<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} style={{backgroundColor: 'lightgray'}} >Empresa</td>
					    							<td key={uuid.v4()} >{k.empresa}</td>
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
								    			{k.ferias && 
								    				k.ferias.map( (w, y) => (
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
					    							<td key={uuid.v4()} colSpan="4" >Histórico</td>
					    						</tr>
					    						<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} colSpan="4" >Histórico de Lançamentos</td>
					    						</tr>
					    						<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} >Inicial</td>
					    							<td key={uuid.v4()} >Final</td>
					    							<td key={uuid.v4()} >Dias</td>
					    							<td key={uuid.v4()} >Histórico</td>
					    						</tr>
					    					</thead>

					    					<tbody key={uuid.v4()} >
									    		{k.historico && 
									    			k.historico.map( (w, y) => (
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
									    			</tr>))
									    		}
									    	</tbody>
								    	</table>
								    </td>

					    		</tr>
					    	</tbody>
					    </table>
					    	
					)}
					
				</div>
			</MuiThemeProvider>
		)
	}
}