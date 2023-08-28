import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserPage.css';
import axios from 'axios';
import Loading from '../../components/loading/Loading';
import { UserContext } from '../../context/user';
import Paper from '@mui/material/Paper';
import url from '../../context/url';
import { Modal, Button } from 'react-bootstrap';
import SnackbarAlert from '../../components/snackbarAlert/SnackbarAlert';
import { FaSkullCrossbones } from 'react-icons/fa';
import defaultProfilePic from '../../assets/defaultProfilePic.png';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';

function UserPage() {
  const navigate = useNavigate();
  const {
    username,
    firstName,
    lastName,
    email,
    bio,
    password,
    loggedIn,
    galleriesCount,
    imagesCount,
    profilePic,
    userLogout,
    getUserProfilePic,
  } = useContext(UserContext);

  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [enteredPassword, setEnteredPassword] = useState('');

  const [open, setOpen] = React.useState(false);

  const handleAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const showPassword = () => {
    let x = document.getElementById('password');
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  };

  useEffect(() => {
    if (loggedIn === 'true') {
      async function getUserData() {
        await getUserProfilePic();
        setLoading(false);
      }
      getUserData();
    } else {
      navigate('/login');
    }
  }, []);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleDeleteLoading = () => {
    setDeleteLoading(false);
  };
  const handleToggleLoading = () => {
    setDeleteLoading(!deleteLoading);
  };

  const deleteUser = async (e) => {
    e.preventDefault();
    if (enteredPassword !== password) {
      setOpen(true);
      return;
    }
    handleToggleLoading();
    try {
      const response = await axios({
        method: 'delete',
        url: `${url}/api/users/deleteUser/`,
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          Authorization: localStorage.getItem('jwt'),
        },
      });
      if (response && response.status === 200) {
        userLogout();
        navigate('/');
        window.location.reload(false);
      }
    } catch (e) {
      // console.log(e);
    }
    handleDeleteLoading();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='user-page'>
      <Paper
        elevation={6}
        sx={{
          background: 'linear-gradient(to bottom, #d3cce3, #e9e4f0)',
        }}
      >
        <div className='row user-row'>
          <div className='col-md-4'>
            <div className='edit-profile'>
              <div
                style={{
                  height: '250px',
                  width: '250px',
                  backgroundColor: 'white',
                  borderRadius: '100%',
                }}
              >
                {profilePic ? (
                  <img
                    className='edit-profile-pic'
                    src={profilePic}
                    // src={'data:image/png;base64,' + profilePic}
                  />
                ) : (
                  <img className='edit-profile-pic' src={defaultProfilePic} />
                )}
              </div>
            </div>
          </div>
          <div className='col-md-8'>
            <table className='table table-borderless'>
              <tbody>
                <tr>
                  <th scope='row' className='user-page-heading'>
                    Username
                  </th>
                  <td className='user-page-value'>{username}</td>
                </tr>
                <tr>
                  <th scope='row' className='user-page-heading'>
                    Name
                  </th>
                  <td className='user-page-value'>
                    {firstName + ' ' + lastName}
                  </td>
                </tr>
                <tr>
                  <th scope='row' className='user-page-heading'>
                    Bio
                  </th>
                  <td className='user-page-value'>{bio}</td>
                </tr>
                <tr>
                  <th scope='row' className='user-page-heading'>
                    Email
                  </th>
                  <td className='user-page-value'>{email}</td>
                </tr>
                <tr>
                  <th scope='row' className='user-page-heading'>
                    Total Galleries
                  </th>
                  <td className='user-page-value'>{galleriesCount}</td>
                </tr>
                <tr>
                  <th scope='row' className='user-page-heading'>
                    Total Images
                  </th>
                  <td className='user-page-value'>{imagesCount}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='text-end'>
            <Link to='/user/edit'>
              <button type='submit' className='btn btn-primary button'>
                <span>Edit Profile</span>
              </button>
            </Link>
          </div>
        </div>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          marginTop: '50px',
          background: 'linear-gradient(to bottom, #d3cce3, #e9e4f0)',
        }}
      >
        <div className='delete-user' style={{ padding: '20px' }}>
          <div className='text-center'>
            <button
              type='button'
              className='btn btn-danger button'
              onClick={handleShow}
            >
              <span>
                <FaSkullCrossbones style={{ marginBottom: '3px' }} /> Delete
                Account
              </span>
            </button>
          </div>
        </div>
      </Paper>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter your password to confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={deleteUser} autoComplete='off'>
            <div className='row mb-3'>
              <label htmlFor='password' className='col-sm-3 col-form-label'>
                Password
              </label>
              <div className='col-sm-9'>
                <input
                  type='password'
                  className='form-control'
                  id='password'
                  placeholder='Enter Password'
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className='row mb-3'>
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
          </form>

          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={deleteLoading}
          >
            <Stack sx={{ width: '80%' }} spacing={2}>
              <LinearProgress color='success' />
            </Stack>
          </Backdrop>

          <SnackbarAlert
            open={open}
            severity='error'
            message='Wrong Password!'
            close={handleAlert}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button type='submit' variant='danger' onClick={deleteUser}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserPage;
