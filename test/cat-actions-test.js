import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../src/actions/catActions'
import { expect } from 'chai'
import nock from 'nock'
import fetch from 'isomorphic-fetch';


// change to redux thunk
const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const catPics = [{url: "www.example.com/cat1"}, {url: 'www.example.com/cat2'}]

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('uses redux and thunk to create an action object with type of "ADD_CATS" and a payload of cat images', async () => {
    window.fetch = fetch

    const scope = nock('https://learn-co-curriculum.github.io')
      .get('/cat-api/cats.json')
      .reply(200, { images: [{url: "www.example.com/cat1"}, {url: 'www.example.com/cat2'}] })
    
    const expectedActions = [
      { type: 'LOADING_CATS' },
      { type: "ADD_CATS", cats: catPics }
    ]

    const store = mockStore({})
    await store.dispatch(actions.fetchCats())
    await sleep(2000)
    expect(store.getActions()).to.eql(expectedActions)
  })
})
