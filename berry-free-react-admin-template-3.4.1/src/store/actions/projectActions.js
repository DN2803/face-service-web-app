export const setProject = (project) => ({
  type: 'SET_PROJECT',
  payload: project,
});

export const updateProjectName = (newName) => ({
  type: 'UPDATE_PROJECT_NAME',
  payload: newName,
});