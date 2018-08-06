export default function catsReducer(state= {loading: false, pictures: []}, action) {
  switch ( action.type ) {
    case 'LOADING_CATS':
      return Object.assign({}, state, {loading: true})
    case 'FETCH_CATS':
      return {loading: false, pictures: action.payload}
    default:
      return state;
  }

}
