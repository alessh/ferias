import React from 'react';

import { MenuItem, SelectField, CircularProgress } from 'material-ui';

import uuid from 'node-uuid';

import Field from './Field';

import 'aws-sdk/dist/aws-sdk';
const aws = window.AWS;

aws.config.update({accessKeyId: 'AKIAJROLVHLQQHOE72HA', secretAccessKey: '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','region': 'sa-east-1'});

const dynamodb = new aws.DynamoDB.DocumentClient();

const config = {
	table: 'altamira'
}

export default class Select extends Field {
	constructor(props) {
		super(props);

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
	            ":pk": 'r:' + this.props.class,
	            ":f": "00000000-0000-0000-0000-000000000000"
	        },
	        FilterExpression: "#f <> :f",
	        Projection: 'id, fields',
	        ExclusiveStartKey: null,
	        Limit: 10
	    }

	    var result = function(err, data) {
	    	const context = this;

	        if (err) {
	            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
	            context.setState({items: []});
	        } else {
	            
	            if (data.Count > 0) {
	            	data.Items.forEach(function(v, k, a) {
	            		context.items.push({id: v.id, nome: v.fields.nome.value});
	            	})
	            }
	            if (data.LastEvaluatedKey) {
	              	context.params.ExclusiveStartKey = data.LastEvaluatedKey
	              	dynamodb.query(context.params, result.bind(context))
	            } else {
	            	context.setState({items: context.items});
	            }
	        }
	    }

	    dynamodb.query(this.params, result.bind(this));		            		
	}

	/*componentWillMount() {
		this.state.loc = this.props.loc || null;
		this.state.mask = this.props.mask || null;
		this.state.lang = this.props.lang || null;
		console.log('Component will mount: ' + this.state.id + ':' + this.state.type);
	}*/

	//onChange = (event, index, value) => this.setState({value: value});

	render() {
		const progress = {
			visibility: this.state.progress ? 'visible' : 'hidden', position: 'absolute'
		}
		const items = [];
		this.items.forEach(function(v, k, a) {
			items.push(<MenuItem key={uuid.v4()} value={v.id} primaryText={v.nome} />)
		})
		return (
			<div>
				<SelectField 
					key={uuid.v4()} 
					onChange={this.onChange} 
					value={this.state.value} 
					fullWidth={true} 
					floatingLabelText={this.state.label}
					floatingLabelFixed={true}
				>
					{items}
		        </SelectField>
				<CircularProgress size={0.5} style={progress} />
			</div>
		);
	}
}
