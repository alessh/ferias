import React, { Component } from 'react';

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { AppBar, FloatingActionButton } from 'material-ui';

import IconExit from 'material-ui/svg-icons/navigation/close';

import uuid from 'node-uuid';
import moment from 'moment';

export default class List extends Component {
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

				    {this.props.list.map( (k, i) => (
					    	
				    <table key={uuid.v4()} style={{margin: '40px', width: '90%', borderCollapse: 'collapse'}} >
				    	
					    	<thead key={uuid.v4()} style={{fontSize: '1.2em'}} >
					    		<tr key={uuid.v4()} style={{borderBottom: '2px solid black', borderTop: '2px solid black'}} >
					    			<td key={uuid.v4()} colSpan="3" rowSpan={k.ferias.length+k.historico.length+1} style={{fontSize: '2.2em'}} >{k.nome}</td>
					    		</tr>
					    	</thead>

					    	<tbody key={uuid.v4()} style={{align: 'center', verticalAlign: 'top', fontSize: '1.2em', textAlign: 'center'}} >

					    		<tr key={uuid.v4()} >

					    			<td key={uuid.v4()} >
					    				<table key={uuid.v4()} style={{width: '100%'}} >

					    					<thead key={uuid.v4()} style={{backgroundColor: 'lightgray'}} >
					    						<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} colSpan="3" >Férias</td>
					    						</tr>
					    						<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} colSpan="3" >Período Aquisitivo</td>
					    						</tr>
					    						<tr key={uuid.v4()} >
					    							<td key={uuid.v4()} >Inicial</td>
					    							<td key={uuid.v4()} >Final</td>
					    							<td key={uuid.v4()} >Dias</td>
					    						</tr>
					    					</thead>

					    					<tbody key={uuid.v4()} >
								    			{k.ferias.map( (w, y) => (
									    			<tr key={uuid.v4()} >
									    				<td key={uuid.v4()} >
									    					{w.inicial.format('DD/MM/YYYY')}
									    				</td>
									    				<td key={uuid.v4()} >
									    					{w.final.format('DD/MM/YYYY')}
									    				</td>
									    				<td key={uuid.v4()} >
									    					{w.dias}
									    				</td>
									    				<td key={uuid.v4()}></td>
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
									    		{k.historico.map( (w, y) => (
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
					))}
					
				</div>
			</MuiThemeProvider>
		)
	}
}