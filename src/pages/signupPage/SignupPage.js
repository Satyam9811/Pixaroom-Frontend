import React, { useState, useEffect } from 'react';
import './SignupPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/user';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import SnackbarAlert from '../../components/snackbarAlert/SnackbarAlert';

function SignupPage() {
  const navigate = useNavigate();
  const {
    loggedIn,
    getSignUpData,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    setUsername,
  } = React.useContext(UserContext);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (loggedIn === 'true') {
      navigate('/user');
    }
  }, []);

  const showPassword = () => {
    let x = document.getElementById('inputPassword3');
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  };

  const [openAlert, setOpenAlert] = React.useState(false);

  const handleAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleToggle();
    let value = await getSignUpData();
    if (value === 'true') {
      navigate('/');
    } else {
      setMessage(value);
      setOpenAlert(true);
    }
    handleClose();
  };

  return (
    <div className='signup-page'>
      <h1 className='signup-text'>Sign Up</h1>
      <form className='signup-form' onSubmit={handleSubmit} autoComplete='off'>
        {/* <div className='row mb-3'>
          <label htmlFor='inputFirstName3' className='col-sm-2 col-form-label'>
            First Name
          </label>
          <div className='col-sm-10'>
            <input
              type='text'
              className='form-control'
              id='inputFirstName3'
              placeholder='Enter first name'
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className='row mb-3'>
          <label htmlFor='inputLastName3' className='col-sm-2 col-form-label'>
            Last Name
          </label>
          <div className='col-sm-10'>
            <input
              type='text'
              className='form-control'
              id='inputLastName3'
              placeholder='Enter last name'
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div> */}

        <div className='row mb-4'>
          <label htmlFor='inputUserName3' className='col-sm-2 col-form-label'>
            Username
          </label>
          <div className='col-sm-10'>
            <input
              type='text'
              className='form-control'
              id='inputUserName3'
              placeholder='Enter username'
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div className='row mb-4'>
          <label htmlFor='inputEmail3' className='col-sm-2 col-form-label'>
            Email Address
          </label>
          <div className='col-sm-10'>
            <input
              type='email'
              className='form-control'
              id='inputEmail3'
              placeholder='Enter email'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className='row mb-4'>
          <label htmlFor='inputPassword3' className='col-sm-2 col-form-label'>
            Password
          </label>
          <div className='col-sm-10'>
            <input
              type='password'
              className='form-control'
              id='inputPassword3'
              placeholder='Enter password'
              // pattern='[]{8,40}'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className='row mb-4'>
          <div className='col-sm-10 offset-sm-2'>
            <div className='form-check'>
              <input
                className='form-check-input'
                type='checkbox'
                id='gridCheck1'
                onClick={showPassword}
              />
              <label className='form-check-label' htmlFor='gridCheck1'>
                Show Password
              </label>
            </div>
          </div>
        </div>

        <div className='text-center'>
          <button type='submit' className='btn btn-primary button'>
            <span>Create Account</span>
          </button>
        </div>
      </form>

      <div style={{ textAlign: 'center' }}>
        Already a member?{' '}
        <Link className='link-text' to='/login'>
          Sign In
        </Link>
      </div>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <Stack sx={{ width: '80%' }} spacing={2}>
          <LinearProgress color='success' />
        </Stack>
      </Backdrop>

      <SnackbarAlert
        open={openAlert}
        severity='error'
        message={message}
        close={handleAlert}
      />
    </div>
  );
}

export default SignupPage;
