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

    case 'ADD_COLLECTION':
      return { ...state, collections: [...state.collections, action.payload] };
    case 'REMOVE_COLLECTION':
      return {
        ...state,
        collections: state.collections.filter(
          (collection) => collection.id !== action.payload.id
        ),
      };
    case 'UPDATE_COLLECTION':
      return {
        ...state,
        collections: state.collections.map((collection) =>
          collection.id === action.payload.id
            ? { ...collection, ...action.payload.data }
            : collection
        ),
      };
      case 'LOGOUT':
        return { ...state, collections: [] };
    default:
      return state;
  }
};

export default collectionsReducer;