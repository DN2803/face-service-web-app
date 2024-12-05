// assets
import { IconKey, IconCode } from '@tabler/icons';
import PersonIcon from '@mui/icons-material/Person';
import { Search } from '@mui/icons-material';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

// constant
const icons = {
  IconKey, 
  PersonIcon,
  FolderSharedIcon, 
  IconCode, 
  Search
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const getPersistedState = () => {
  // Retrieve the persisted state from localStorage
  const persistedState = localStorage.getItem('persist:root');

  if (persistedState) {
    try {
      // Parse the persisted state to access the project value
      const parsedState = JSON.parse(persistedState);
      
      // Parse the stringified `project` field to get the actual object
      const project = parsedState.project ? JSON.parse(parsedState.project) : null;
      
      // Now access selectedProject
      if (project && project.selectedProject) {
        return project.selectedProject.role === 'admin';
      }
    } catch (error) {
      console.error('Error parsing persisted state:', error);
    }
  }

  // Default to false if not found or an error occurs
  return false;
};


const isAdmin = getPersistedState();


const pages = {
  id: 'pages',
  title: 'Management',
  type: 'group',
  children: [
    {
      id: 'person', 
      title: 'Persons',
      type: 'item', 
      url: 'pages/poi-management',
      icon: icons.PersonIcon
    },
    {
      id: 'collection', 
      title: 'Collections',
      type: 'item', 
      url: 'pages/collection-management',
      icon: icons.FolderSharedIcon
    },
    isAdmin && {
      id: 'developer', 
      title: 'Developers',
      type: 'item', 
      url: 'pages/app/developer-keys',
      icon: icons.IconCode
    },
    {
      id: 'search', 
      title: 'Searchs',
      type: 'item', 
      url: 'pages/search',
      icon: icons.Search
    }
  ].filter(Boolean) // Remove any undefined values if isAdmin is false
};

export default pages;
