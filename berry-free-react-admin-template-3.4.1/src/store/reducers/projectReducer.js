const initialState = {
    selectedProject: null,
  };
  
  const projectReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_PROJECT':
        return {
          ...state,
          selectedProject: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default projectReducer;