import React from 'react';

import { MenuItem, SelectField } from 'material-ui';

import uuid from 'node-uuid';

import Field from './Field';

import 'aws-sdk/dist/aws-sdk';
const aws = window.AWS;

aws.config.update({accessKeyId: 'AKIAJROLVHLQQHOE72HA', secretAccessKey: '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','region': 'sa-east-1'});

//const dynamodb = new aws.DynamoDB.DocumentClient();

/*const config = {
	table: 'altamira'
}*/

export default class Select extends Field {
	constructor(props) {
		super(props);

		this.state = {
			text: this.props.text,
			items: []
		}
	}

	/*componentWillMount() {
		this.items = [];

	    this.params = {
	        TableName: config.table,
	        IndexName: "type-id-index",
	        KeyConditionExpression: "#pk = :pk",   
	        ExpressionAttributeNames: {
	            "#pk": "type"
	        },
	        ExpressionAttributeValues: { 
	            ":pk": this.props.type
	        },
	        Projection: 'id, ' + this.state.text,
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
	            		context.items.push({id: v.id, text: v[context.state.text]});
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
	}*/

	render() {
		const items = [];
		items.forEach(function(v, k, a) {
			items.push(<MenuItem key={uuid.v4()} value={v.id} primaryText={v.text} />)
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
			</div>
		);
	}
}
