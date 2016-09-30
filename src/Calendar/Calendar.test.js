import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';

import Calendar from './Calendar';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

describe("Calendar tests", function() {
	let wrapper;

	let onClick = sinon.spy();

	const props = { id: 'Ax04.D3m1', color: 'red', date: '2016-01-01', author: 'Ingrid dos Santos Alves' };

  	beforeEach(() => {
    	wrapper = shallow(
	      <PostIt onClick={onClick} {...props} />
	    );
  	});

  	afterEach(() => {
  	});

	it('check Calendar note text', () => {
	  	expect(wrapper.find('cite').first().text()).toEqual(props.author);
	});	

	it('check Calendar title', () => {
	  	expect(wrapper.find('span').first().text()).toEqual(props.date);
	});	

	it('check Calendar color', () => {
	  	expect(wrapper.find('blockquote').hasClass(props.color)).toEqual(true);
	});	

	it('check Calendar onClick callback', () => {
		expect(onClick.callCount).toEqual(0);
	    wrapper.find('a').first().simulate('touchTap');
	    expect(onClick.callCount).toEqual(1);
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