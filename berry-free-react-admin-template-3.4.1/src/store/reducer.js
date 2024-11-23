import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './reducers/customizationReducer';
import authReducer from './reducers/authReducer'
import projectReducer from './reducers/projectReducer';
import collectionsReducer from './reducers/collectionsReducer';
// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  auth: authReducer,
  project: projectReducer,
  collections: collectionsReducer
});

export default reducer;
