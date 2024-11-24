const initialState = {
    collections: [],
    loading: false,
  };
  
  const collectionsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_COLLECTIONS_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_COLLECTIONS_SUCCESS':
        return { ...state, collections: action.payload, loading: false };
      case 'FETCH_COLLECTIONS_FAILURE':
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  
  export default collectionsReducer;