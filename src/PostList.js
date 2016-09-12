import React, { Component } from 'react';

import './PostList.css';

import { FlatButton } from 'material-ui';

import FormDialog from './Form';

import uuid from 'node-uuid';
//import async from 'async';
import 'aws-sdk/dist/aws-sdk';
const aws = window.AWS;

const table = 'altamira';

aws.config.update({accessKeyId: 'AKIAJROLVHLQQHOE72HA', secretAccessKey: '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','region': 'sa-east-1'});

const dynamodb = new aws.DynamoDB.DocumentClient();

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function toTitleCase(str)
{
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

class PostIt extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false
		}

		this.onOpen = this.onOpen.bind(this);
		this.onClose = this.onClose.bind(this);
	}

	onOpen() {
		this.setState({open: true});
	}

	onClose() {
		this.setState({open: false});
	}

	render() {
		const range = [2, -2, 2, -2, 2, -2, 2, -2, 2, 2, -2, -2, 2, -2, 2, -2];
		const degre = range.randomElement();
 		const style = {
			'WebkitTransform': 'rotate(' + degre + 'deg)',
			'MozTransform': 'rotate(' + degre + 'deg)',
			'OTransform': 'rotate(' + degre + 'deg)',
			'MsTransform': 'rotate(' + degre + 'deg)',
			'transform': 'rotate(' + degre + 'deg)'
		}
		const actions = [
		  <FlatButton
		    label="Cancelar"
		    primary={true}
		    onTouchTap={this.onClose}
		  />,
		  <FlatButton
		    label="Gravar"
		    primary={true}
		    keyboardFocused={true}
		    onTouchTap={this.onClose}
		  />,
		];
		return (
			
			<a href='#' onTouchTap={this.onOpen}>
				<div className="quote-container">
					<i className="pin"></i>
					<blockquote className={"note " + this.props.color} style={style} >
						{this.props.date}
						<cite className="author">{toTitleCase(this.props.author)}</cite>
					</blockquote>
					<FormDialog 
						actions={actions}
						modal={false}
						open={this.state.open}
						onRequestClose={this.onClose}
						autoScrollBodyContent={true}
						{...this.props} 
					/>

				</div>
			</a>
		);
	}
}

class PostList extends Component {
	render() {
		const style = {
			display: 'inline-block',
			width: '100%'
		}
		return(
			<div style={style}>
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'yellow'} date={'09/10/2016'} author={'MARIA PEREIRA DA SILVA'} {...this.props} />
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'red'} date={'10/10/2016'} author={'jose carlos pereira'} {...this.props} />
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'gray'} date={'12/10/2016'} author={'edmilson dos santos'} {...this.props} />
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'yellow'} date={'13/10/2016'} author={'marcelo parra'} {...this.props} />
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'yellow'} date={'09/10/2016'} author={'ana paula da silva'} {...this.props} />
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'gray'} date={'09/10/2016'} author={'vanessa forestiero'} {...this.props} />
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'red'} date={'09/10/2016'} author={'jose augusto dos santos'} {...this.props} />
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'gray'} date={'09/10/2016'} author={'haroldo xavier'} {...this.props} />
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'red'} date={'09/10/2016'} author={'paulo miranda'} {...this.props} />
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'yellow'} date={'09/10/2016'} author={'carlos prazeres'} {...this.props} />
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'gray'} date={'09/10/2016'} author={'anderson silva'} {...this.props} />
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'red'} date={'09/10/2016'} author={'neuci bavato'} {...this.props} />
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'gray'} date={'09/10/2016'} author={'rita de cassia miranda'} {...this.props} />
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'red'} date={'09/10/2016'} author={'silvia toda tandelo'} {...this.props} />
			</div>
		);
	}
}

export default PostList;