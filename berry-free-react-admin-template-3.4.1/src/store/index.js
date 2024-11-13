import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';  // Sử dụng localStorage hoặc sessionStorage
import { thunk } from 'redux-thunk';  // Middleware cho bất đồng bộ
import reducer from './reducer';

// ==============================|| REDUX - MAIN STORE ||============================== //

const persistConfig = {
  key: 'root',  // Tên của key lưu trữ trong localStorage/sessionStorage
  storage,  // Lưu trữ sử dụng localStorage
};

const persistedReducer = persistReducer(persistConfig, reducer);

// Tạo store với middleware redux-thunk và persistReducer
const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)  // Bạn có thể thêm nhiều middleware khác nếu cần
);

// Khởi tạo persister từ redux-persist
const persister = persistStore(store);

export { store, persister };
