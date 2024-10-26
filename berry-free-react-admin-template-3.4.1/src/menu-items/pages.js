// assets
import { IconKey, IconCode } from '@tabler/icons';
import PersonIcon from '@mui/icons-material/Person';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

// constant
const icons = {
  IconKey, 
  PersonIcon,
  FolderSharedIcon, 
  IconCode
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

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
    {
      id: 'developer', 
      title: 'Developers',
      type: 'item', 
      url: 'pages/app/developer-keys',
      icon: icons.IconCode
    }
  ]
};

export default pages;
