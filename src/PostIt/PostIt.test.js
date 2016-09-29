import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';

import PostIt from './PostIt';
import EditForm from './../Funcionario/EditForm';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

describe("PostIt tests", function() {
	// This replaces the window.addEventListener with our spy.
	//let callback = sinon.spy(window, 'addEventListener');
	let callback, wrapper;

	const item = { id: 'Ax04.D3m1', color: 'red', date: '2016-01-01', author: 'ingrid dos santos alves' };

  	beforeEach(() => {
  		callback = sinon.spy();
    	wrapper = shallow(
	      <PostIt onClick={callback} id={item.id} color={item.color} title={item.date} note={item.author} >
	      	<div id='mockChildren' />
	      </PostIt>
	    );
  	});

  	afterEach(() => {
    	// Restore the original function.
    	//window.addEventListener.restore();
    	wrapper = null;
    	callback = null;
  	});

	it('pretty case', () => {
	  expect(wrapper.find('cite').first().text()).toEqual('Ingrid dos Santos Alves');
	});	

	it('check title', () => {
	  expect(wrapper.find('span').first().text()).toEqual('2016-01-01');
	});	

	it('check color', () => {
	  expect(wrapper.find('blockquote').hasClass(item.color)).toEqual(true);
	});	

	it('check onClick', () => {
		expect(callback.callCount).toEqual(0);
	    expect(wrapper.state('focus')).toEqual(false);
	    expect(wrapper.find('#mockChildren').length).toEqual(0);

	    wrapper.find('a').first().simulate('touchTap');

	    expect(wrapper.find('#mockChildren').length).toEqual(1);
	    expect(wrapper.state('focus')).toEqual(true);
	    expect(callback.callCount).toEqual(1);

	});

	/*it('testing open postIt', () => {
	    const wrapper = shallow(
	      <PostIt id={item.id} color={item.color} title={item.date} note={item.author} />
	    );

	    console.log('PostIt state before open: ' + wrapper.state().open);
	    expect(wrapper.state('open')).toEqual(false);
	    wrapper.find('a').simulate('click');
	    console.log('PostIt state after open: ' + wrapper.state().open);
	    expect(wrapper.state('open')).toEqual(true);

	});*/

});