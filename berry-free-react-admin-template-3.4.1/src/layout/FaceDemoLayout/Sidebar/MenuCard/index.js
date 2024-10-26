import React from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Avatar, Grid } from '@mui/material';

const StyledCard = styled(Card)(({ theme, expanded }) => ({
  background: theme.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s',
  transform: expanded ? 'scale(1.05)' : 'scale(1)',
  transformOrigin: 'bottom',
  '&:hover': {
    boxShadow: theme.shadows[5],
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '157px',
    height: '157px',
    background: theme.palette.primary[200],
    borderRadius: '50%',
    top: '-105px',
    right: '-96px',
  },
}));

const ExpandableCard = ({ label, IconComponent, expanded, onClick }) => {
  const theme = useTheme();

  return (
    <StyledCard expanded={expanded} onClick={onClick} role="button" aria-expanded={expanded}>
      <CardContent padding={'4px'}>
        <Grid container style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
          <Avatar
            sx={{
              backgroundColor: theme.palette.primary.light,
              mb: 2,
              width: 56,
              height: 56,
            }}
          >
            {IconComponent && <IconComponent fontSize="small" />}
          </Avatar>
          <Typography variant="h3" padding={2}>{label}</Typography>
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

ExpandableCard.propTypes = {
  label: PropTypes.string.isRequired,
  IconComponent: PropTypes.elementType,
  expanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

ExpandableCard.defaultProps = {
  IconComponent: null,
};

export default ExpandableCard;
