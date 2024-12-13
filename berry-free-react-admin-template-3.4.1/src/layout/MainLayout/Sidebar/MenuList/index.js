// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { useAdminStatus } from 'hooks';
import { getNavItems } from 'menu-items/pages';
// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const isAdmin = useAdminStatus();
  const navItems = menuItem.items.map((item) => {
    if (item.component) { 
      item = {
        children: getNavItems(isAdmin),
        id: 'pages',
        type: 'group',
        title: 'Pages' 
      }
    }
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
