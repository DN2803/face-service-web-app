import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './reducers/customizationReducer';
import authReducer from './reducers/authReducer'
// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  auth: authReducer,
});

export default reducer;
