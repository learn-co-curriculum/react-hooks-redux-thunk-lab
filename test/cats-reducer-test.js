import catsReducer from '../src/reducers/catsReducer'
import {expect} from 'chai'

describe('cats reducer', () => {
  it('should return the initial state', () => {
    expect(
      catsReducer(undefined, {})
    ).to.eql({loading: false, cats: []})
  })

  it('should handle the ADD_CATS action', () => {
    const catPics = [{url: "www.example.com/cat1"}, {url: 'www.example.com/cat2'}]
    expect(
      catsReducer([], {
        type: 'ADD_CATS',
        cats:  catPics
      })
    ).to.eql({loading: false, cats: catPics})
  })
})
