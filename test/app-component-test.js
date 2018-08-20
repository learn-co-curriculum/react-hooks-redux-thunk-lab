import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import expect, { createSpy, spyOn, isSpy } from 'expect';
import thunk from 'redux-thunk';
import App from '../src/App';
import CatList from '../src/CatList';
import sinon from 'sinon';
import { createStore, applyMiddleware, compose } from 'redux';
import * as actions from '../src/actions/catActions';
import configureMockStore from 'redux-mock-store';

import configureStore from 'redux-mock-store';
import { Provider, connect } from 'react-redux';
import rootReducer from '../src/reducers/index';
import nock from 'nock';
import fetch from 'isomorphic-fetch';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const images = [
	{ url: 'www.example.com/cat1' },
	{ url: 'www.example.com/cat2' }
];

describe('<App/>', function() {
	it('should use the componentDidMount lifecycle method to fetchCats', function() {
		sinon.stub(App.prototype, 'componentDidMount');
		nock('http://localhost:4000')
			.get('/db')
			.reply(200, {
				images: [
					{ url: 'www.example.com/cat1' },
					{ url: 'www.example.com/cat2' }
				]
			});
		global.fetch = fetch;

		const props = {
			catPics: images
		};

		const mockStore = configureStore([]);
		const initialState = { cats: { loading: false, cats: [] } };
		const store = createStore(rootReducer, applyMiddleware(thunk));
		const wrapper = mount(
			<Provider store={store}>
				<App />
			</Provider>
		);

		expect(App.prototype.componentDidMount.calledOnce).toEqual(true);
	});
});
