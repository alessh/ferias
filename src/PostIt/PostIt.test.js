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

	const item = { id: 'Ax04.D3m1', color: 'red', date: '2016-01-01', author: 'Ingrid dos Santos Alves' };

  	beforeEach(() => {
  		callback = sinon.spy();
    	wrapper = shallow(
	      <PostIt onClick={callback} id={item.id} color={item.color} title={item.date} note={item.author} />
	    );
  	});

  	afterEach(() => {
    	// Restore the original function.
    	//window.addEventListener.restore();
    	wrapper = null;
    	callback = null;
  	});

	it('check postIt note text', () => {
	  	expect(wrapper.find('cite').first().text()).toEqual(item.author);
	});	

	it('check postIt title', () => {
	  	expect(wrapper.find('span').first().text()).toEqual(item.date);
	});	

	it('check postIt color', () => {
	  	expect(wrapper.find('blockquote').hasClass(item.color)).toEqual(true);
	});	

	it('check postIt onClick callback', () => {

		expect(callback.callCount).toEqual(0);

	    wrapper.find('a').first().simulate('touchTap');

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