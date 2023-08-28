import React, { useState, useEffect, useContext } from 'react';
import Loading from '../../components/loading/Loading';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/user';
import './EditProfilePage.css';
import url from '../../context/url';
import SnackbarAlert from '../../components/snackbarAlert/SnackbarAlert';
import defaultProfilePic from '../../assets/defaultProfilePic.png';
import { Backdrop, Paper, CircularProgress } from '@mui/material';

function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [imageChanged, setImageChanged] = useState(false);
  const [message, setMessage] = useState('');
  const {
    loggedIn,
    firstName,
    lastName,
    email,
    bio,
    setFirstName,
    setLastName,
    setEmail,
    setBio,
    profilePic,
    setProfilePic,
    getLoginData,
    getUserProfilePic,
  } = useContext(UserContext);

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

  const confirmEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios({
        method: 'put',
        url: `${url}/api/users/updateUser/`,
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          bio: bio,
        },
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          Authorization: localStorage.getItem('jwt'),
        },
      });
      if (response && response.status === 200) {
        setMessage('Details Updated!');
        setSeverity('success');
        setOpen(true);
        navigate('/user');
      }
    } catch (e) {
      // console.log(e);
      setMessage('Email Already Exists!');
      setSeverity('error');
      setOpen(true);
    }
  };

  const [profilePicOnChange, setProfilePicOnChange] = useState();

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
    setProfilePicOnChange(URL.createObjectURL(e.target.files[0]));
    setImageChanged(true);
    if (e.target.files[0].size > 1048576) {
      setMessage('File size exceeds 1 Mb');
      setSeverity('error');
      setOpen(true);
    }
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    if (profilePic?.size > 1048576) {
      setMessage('File size exceeds 1 Mb');
      setSeverity('error');
      setOpen(true);
      return;
    }
    let bodyFormData = new FormData();
    bodyFormData.append('image', profilePic);
    handleToggle();

    try {
      const response = await axios({
        method: 'post',
        url: `${url}/api/users/uploadUserPhoto/`,
        // url: `${url}/api/users/userPhoto/${localStorage.getItem('userId')}`,
        data: bodyFormData,
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Access-Control-Allow-Origin': '*',
          Authorization: localStorage.getItem('jwt'),
        },
      });
      if (response && response.status === 200) {
        setMessage('Profile Picture Uploaded!');
        setSeverity('success');
        setOpen(true);
        setImageChanged(true);
      }
    } catch (e) {
      // console.log(e);
    }
    handleClose();
  };

  const removeUserProfilePic = async () => {
    handleToggle();
    try {
      const response = await axios.delete(`${url}/api/users/deleteUserPhoto/`, {
        headers: {
          Authorization: localStorage.getItem('jwt'),
        },
      });
      if (response && response.status === 200) {
        setMessage('Profile Picture Removed!');
        setSeverity('success');
        setOpen(true);
        setProfilePic('');
        // setProfilePicOnChange(null);
      }
    } catch (e) {
      // console.log(e);
    }
    handleClose();
    return true;
  };

  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = useState('');

  const handleAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleClose = () => {
    setOpenBackdrop(false);
  };
  const handleToggle = () => {
    setOpenBackdrop(!open);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='edit-profile-page'>
      <Paper
        elevation={12}
        sx={{
          background: 'linear-gradient(to bottom, #d3cce3, #e9e4f0)',
        }}
      >
        <div className='row' style={{ padding: '30px' }}>
          <div className='col-md-6 edit-profile-left'>
            <div className='edit-profile'>
              <div className='edit-profile-div'>
                {profilePic ? (
                  !imageChanged ? (
                    <img
                      className='edit-profile-pic'
                      src={profilePic}
                      // src={'data:image/png;base64,' + profilePic}
                    />
                  ) : (
                    <img
                      className='edit-profile-pic'
                      src={profilePicOnChange}
                    />
                  )
                ) : (
                  <img className='edit-profile-pic' src={defaultProfilePic} />
                )}
              </div>
            </div>
            <div>
              <form
                onSubmit={uploadImage}
                className='edit-profile-image-form'
                autoComplete='off'
              >
                <div className='row mb-3'>
                  <label
                    htmlFor='imageFile'
                    className='col-sm-2 col-form-label'
                  >
                    Image File
                  </label>
                  <div className='col-sm-8'>
                    <input
                      type='file'
                      accept='image/*'
                      className='form-control'
                      id='imageFile'
                      name='imageFile'
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>

                <div className='text-center'>
                  <button type='submit' className='btn btn-primary button'>
                    <span>Update Image</span>
                  </button>
                </div>
              </form>
              <div className='text-center' style={{ marginTop: '15px' }}>
                <button
                  onClick={removeUserProfilePic}
                  className='btn btn-danger button'
                  disabled={profilePic === ''}
                >
                  <span>Remove Image</span>
                </button>
              </div>
            </div>
          </div>

          <div className='col-md-6 edit-profile-right'>
            <form onSubmit={confirmEdit} autoComplete='off'>
              <div className='row mb-3'>
                <label htmlFor='firstName' className='col-sm-3 col-form-label'>
                  First Name
                </label>
                <div className='col-sm-8'>
                  <input
                    type='text'
                    className='form-control form-control-lg mb-2'
                    id='firstName'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className='row mb-3'>
                <label htmlFor='lastName' className='col-sm-3 col-form-label'>
                  Last Name
                </label>
                <div className='col-sm-8'>
                  <input
                    type='text'
                    className='form-control form-control-lg mb-2'
                    id='lastName'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    // required
                  />
                </div>
              </div>

              <div className='row mb-3'>
                <label htmlFor='email' className='col-sm-3 col-form-label'>
                  Email
                </label>
                <div className='col-sm-8'>
                  <input
                    type='text'
                    className='form-control form-control-lg mb-2'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className='row mb-3'>
                <label htmlFor='bio' className='col-sm-3 col-form-label'>
                  Bio
                </label>
                <div className='col-sm-8'>
                  <input
                    type='text'
                    className='form-control form-control-lg mb-2'
                    id='bio'
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>

              <div className='text-center'>
                <button type='submit' className='btn btn-primary button'>
                  <span>Confirm Edit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Paper>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color='secondary' />
      </Backdrop>

      <SnackbarAlert
        open={open}
        severity={severity}
        close={handleAlert}
        message={message}
      />
    </div>
  );
}

export default EditProfile;
