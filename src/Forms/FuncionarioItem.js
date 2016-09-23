import React, { Component } from 'react';

import { ListItem } from 'material-ui';

import IconEdit from 'material-ui/svg-icons/content/create';
//import IconAdd from 'material-ui/svg-icons/content/add';
//import IconSave from 'material-ui/svg-icons/action/done';
//import IconExit from 'material-ui/svg-icons/navigation/close';

import Funcionario from './Funcionario';

import uuid from 'node-uuid';

export default class FuncionarioItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false
		}

		this.onOpen = this.onOpen.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onDelete = this.onDelete.bind(this);
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

	onDelete(id) {
		if (this.props.onDelete) this.props.onDelete(id);
	}

	render() {
		return (
			<ListItem key={uuid.v4()} id={this.props.id} primaryText={this.props.nome} onTouchTap={this.onOpen} rightIcon={<IconEdit />} >
				{ this.state.open ? (<Funcionario {...this.props} onClose={this.onClose.bind(this)} onSave={this.onSave.bind(this)} onDelete={this.onDelete.bind(this)} label={this.props.nome} />) : (null) }
			</ListItem>
		);
	}
}
