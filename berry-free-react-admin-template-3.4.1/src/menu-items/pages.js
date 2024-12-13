import React from 'react';
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

import { useAdminStatus } from 'hooks';

// Hàm để tạo navItems độc lập
export const getNavItems = (isAdmin) => {
  return [
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
      id: 'search',
      title: 'Searchs',
      type: 'item',
      url: 'pages/search',
      icon: icons.Search
    },
    isAdmin && {
      id: 'developer',
      title: 'Developers',
      type: 'item',
      url: 'pages/app/developer-keys',
      icon: icons.IconCode
    }
  ].filter(Boolean);
};

// Component MenuList
const MenuList = () => {
  const { isAdmin } = useAdminStatus();
  const navItems = getNavItems(isAdmin);

  return <>{navItems}</>;
};

export default MenuList;
