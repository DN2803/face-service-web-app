import { LOGIN_SUCCESS, SET_API_KEY, LOGOUT, SET_REDIRECT_ROUTE } from '../actions/authActions';

const initialState = {
    user: null,
    apiKey: null,
    redirectRoute: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_REDIRECT_ROUTE:
            return {
                ...state,
                redirectRoute: action.payload,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
            };
        case SET_API_KEY:
            return {
                ...state,
                apiKey: action.payload.apiKey,
            };
        case LOGOUT:
            return {
                ...state,
                user: null,
                apiKey: null,
            };
        
        default:
            return state;
    }
};

export default authReducer;