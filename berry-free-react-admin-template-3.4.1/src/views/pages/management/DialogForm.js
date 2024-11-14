import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const DialogForm = ({ open, onClose, title, children}) => {
  return (
    <>
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx = {{padding: '20px'}}>
        {children} {/* Form content will be passed here */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default DialogForm;
