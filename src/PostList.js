import React, { Component } from 'react';

import './PostList.css';

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
			open: false,
			degre: [2, -2, 2, -2, 2, -2, 2, -2, 2, 2, -2, -2, 2, -2, 2, -2].randomElement()
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
 		const style = {
			'WebkitTransform': 'rotate(' + this.state.degre + 'deg)',
			'MozTransform': 'rotate(' + this.state.degre + 'deg)',
			'OTransform': 'rotate(' + this.state.degre + 'deg)',
			'MsTransform': 'rotate(' + this.state.degre + 'deg)',
			'transform': 'rotate(' + this.state.degre + 'deg)'
		}

		return (
			
			<a href='#' onTouchTap={this.onOpen}>
				<div className="quote-container">
					<i className="pin"></i>
					<blockquote className={"note " + this.props.color} style={style} >
						{this.props.date}
						<cite className="author">{toTitleCase(this.props.author)}</cite>
					</blockquote>
					<FormDialog {...this.props} open={this.state.open} onClose={this.onClose.bind(this)} />
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
				<PostIt id='68e8fd98-e948-44bb-8933-a6394ecf99a8' class='hm.funcionario' color={'yellow'} date={'09/10/2016'} author={'MARIA PEREIRA DA SILVA'} {...this.props} />
				<PostIt id='530c5fb5-048c-4a3f-88cd-b57e70dbe6b7' class='hm.funcionario' color={'red'} date={'10/10/2016'} author={'jose carlos pereira'} {...this.props} />
				<PostIt id='5c2d650b-575f-44c2-a6d2-a92f7f13d4a3' class='org.com.br.empresa' color={'gray'} date={'12/10/2016'} author={'edmilson dos santos'} {...this.props} />
				<PostIt id='a5df6d82-d4ba-42fa-92b0-5b99a2d90808' class='org.com.br.empresa' color={'yellow'} date={'13/10/2016'} author={'marcelo parra'} {...this.props} />
				<PostIt id='af7331bd-900d-497f-90fa-17e46081a6a3' class='org.com.br.empresa' color={'yellow'} date={'13/10/2016'} author={'marcelo parra'} {...this.props} />
				{/*
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
				*/}
			</div>
		);
	}
}

export default PostList;