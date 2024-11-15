import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { thunk } from 'redux-thunk';
import reducer from './reducer';

// ==============================|| REDUX - MAIN STORE ||============================== //

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, reducer);

// Tạo store với middleware redux-thunk và persistReducer
const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
);

// Khởi tạo persister từ redux-persist
const persister = persistStore(store);

export { store, persister };
