import { combineReducers } from 'redux';
import catsReducer from './cats_reducer';


const rootReducer =  combineReducers({
  cats: catsReducer
});


export default rootReducer;
