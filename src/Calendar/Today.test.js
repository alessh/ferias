import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';

import { FloatingActionButton } from 'material-ui';

import moment from 'moment';

import Today from './Today';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

describe("Today tests", function() {
	const props = { date: moment.utc([2016, 8, 29]), today: true };

  	beforeEach(() => {
    	
  	});

  	afterEach(() => {

  	});

	it('Check Today\'s title', () => {
		const wrapper = shallow(
	      <Today {...props} />
	    );
	  	expect(wrapper.find('div').last().text()).toEqual('29 de Setembro de 2016');
	  	wrapper.setProps({today: false});
	  	expect(wrapper.find('div').last().text()).toEqual('Setembro de 2016');
	});	

	it('Check Today\'s without onPrev callback', () => {
		const wrapper = shallow(
	      <Today {...props} />
	    );
	    wrapper.find(FloatingActionButton).first().simulate('touchTap');
	  	expect(wrapper.find('div').last().text()).toEqual('29 de Agosto de 2016');
	  	wrapper.setProps({today: false});
	  	expect(wrapper.find('div').last().text()).toEqual('Agosto de 2016');
	});

	it('Check Today\'s without onNext callback', () => {
		const wrapper = shallow(
	      <Today {...props} />
	    );
	    wrapper.find(FloatingActionButton).last().simulate('touchTap');
	  	expect(wrapper.find('div').last().text()).toEqual('29 de Outubro de 2016');
	  	wrapper.setProps({today: false});
	  	expect(wrapper.find('div').last().text()).toEqual('Outubro de 2016');
	});

	it('Check Today\'s with onPrev callback', () => {
		const onPrev = sinon.spy();
		const wrapper = shallow(
	      <Today {...props} onPrev={onPrev} />
	    );
	    wrapper.find(FloatingActionButton).first().simulate('touchTap');
	    expect(onPrev.calledOnce).toEqual(true);
	    expect(onPrev.exceptions[0]).toBeUndefined();
	    expect(onPrev.args[0][0]).not.toBeUndefined();
	    expect(onPrev.args[0][0].diff(props.date.clone().subtract(1, 'month'))).toEqual(0);
	});

	it('Check Today\'s with onNext callback', () => {
		const onNext = sinon.spy();
		const wrapper = shallow(
	      <Today {...props} onNext={onNext} />
	    );
	    wrapper.find(FloatingActionButton).last().simulate('touchTap');
	    expect(onNext.calledOnce).toEqual(true);
	    expect(onNext.exceptions[0]).toBeUndefined();
	    expect(onNext.args[0][0]).not.toBeUndefined();
	    expect(onNext.args[0][0].diff(props.date.clone().add(1, 'month'))).toEqual(0);
	});

});