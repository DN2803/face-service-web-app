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
    case 'UPDATE_PROJECT_NAME':
      return {
        ...state,
        selectedProject: {
          ...state.selectedProject,
          name: action.payload, // Cập nhật tên dự án mới
        },
      };
      case 'LOGOUT':
        return { ...state, selectedProject: null };
    default:
      return state;
  }
};

export default projectReducer;