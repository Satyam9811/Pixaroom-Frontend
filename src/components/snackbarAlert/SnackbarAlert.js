import React from 'react';
import './SnackbarAlert.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

function SnackbarAlert(props) {
  const open = props.open;
  const message = props.message;
  const severity = props.severity;
  const handleClose = props.close;

  return (
    <Snackbar open={open} autoHideDuration={2500} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarAlert;
