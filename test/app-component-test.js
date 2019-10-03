import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import { expect } from 'chai';
import thunk from 'redux-thunk';
import App from '../src/App';
import sinon from 'sinon';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import catsReducer from '../src/reducers/catsReducer.js';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const images = [
	{ url: 'www.example.com/cat1' },
	{ url: 'www.example.com/cat2' }
];

describe('<App/>', function() {
	it('should use the componentDidMount lifecycle method to fetchCats', function() {
		sinon.stub(App.prototype, 'componentDidMount');

		const store = createStore(catsReducer, applyMiddleware(thunk));
		const wrapper = mount(
			<Provider store={store}>
				<App />
			</Provider>
		);

		expect(App.prototype.componentDidMount.calledOnce).to.eql(true);
	});
});
