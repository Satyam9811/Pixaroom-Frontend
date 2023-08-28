import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/loading/Loading';
import url from '../../context/url';
import { UserContext } from '../../context/user';
import './GalleriesPage.css';
import { Modal, Button } from 'react-bootstrap';
import SnackbarAlert from '../../components/snackbarAlert/SnackbarAlert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { FaSkullCrossbones } from 'react-icons/fa';
import { MDBDataTableV5, MDBTable } from 'mdbreact';
import { Paper } from '@mui/material';

function GalleriesPage() {
  const navigate = useNavigate();
  const { loading, loggedIn, galleries, password, galleryData } =
    useContext(UserContext);
  const [galleryName, setGalleryName] = useState('');
  const [privacy, setPrivacy] = useState('private');

  useEffect(() => {
    if (loggedIn !== 'true') {
      navigate('/pageNotFound');
    }
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [enteredPassword, setEnteredPassword] = useState('');
  const [message, setMessage] = useState('');

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

  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleToggleBackdrop = () => {
    setOpenBackdrop(!open);
  };

  const createGallery = async (e) => {
    e.preventDefault();
    // handleToggleBackdrop();
    try {
      const response = await axios({
        method: 'post',
        url: `${url}/api/galleries/addGallery/`,
        data: {
          name: galleryName,
          privacy: privacy,
        },
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          Authorization: localStorage.getItem('jwt'),
        },
      });
      if (response && response.status === 200) {
        setGalleryName('');
        window.location.reload(false);
      }
    } catch (e) {
      setMessage('Gallery Name already taken!');
      setOpen(true);
      // console.log(e);
    }
    // handleCloseBackdrop();
  };

  const deleteAllGalleries = async (e) => {
    e.preventDefault();
    if (enteredPassword !== password) {
      setMessage('Wrong Password!');
      setOpen(true);
      return;
    }
    try {
      const response = await axios({
        method: 'delete',
        url: `${url}/api/galleries/deleteAllGalleries/`,
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          Authorization: localStorage.getItem('jwt'),
        },
      });
      if (response && response.status === 200) {
        window.location.reload(false);
      }
    } catch (e) {
      // console.log(e);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='galleries-container'>
      {galleries.length < 1 && (
        <div className='not-created-gallery'>
          <h1>You have not created a gallery</h1>
          <h3 style={{ marginBottom: '20px' }}>{`Create one`}</h3>
        </div>
      )}

      <Paper
        elevation={6}
        sx={{
          background: 'linear-gradient(to bottom, #d3cce3, #e9e4f0)',
        }}
      >
        <form
          onSubmit={createGallery}
          className='create-gallery'
          autoComplete='off'
        >
          <div className='row'>
            <div className='col-md-6'>
              <div className='row mb-3'>
                <label
                  htmlFor='galleryName'
                  className='col-sm-3 col-form-label'
                >
                  Gallery Name
                </label>
                <div className='col-sm-9'>
                  <input
                    type='text'
                    className='form-control'
                    id='galleryName'
                    placeholder='Enter gallery name'
                    onChange={(e) => setGalleryName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='row mb-3'>
                <label htmlFor='privacy' className='col-sm-2 col-form-label'>
                  Privacy
                </label>
                <div className='col-sm-10'>
                  <select
                    className='form-select'
                    aria-label='Default select example'
                    required
                    onChange={(e) => setPrivacy(e.target.value)}
                  >
                    <option value='private'>Private</option>
                    <option value='public'>Public</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className='text-center' style={{ marginTop: '10px' }}>
            <button type='submit' className='btn btn-primary button'>
              <span>Create Gallery</span>
            </button>
          </div>
        </form>
      </Paper>

      <Paper
        elevation={6}
        sx={{
          background: 'linear-gradient(to bottom, #d3cce3, #e9e4f0)',
        }}
      >
        <div className='table-responsive gallery-table'>
          {/* <MDBTable */}
          <MDBDataTableV5
            striped
            bordered
            hover
            responsive
            data={galleryData}
            entries={3}
            entriesOptions={[3, 5, 10, 25, 50, 100]}
            searchTop
            searchBottom={false}
            fullPagination
            searchLabel='Search...'
            noBottomColumns={true}
            // pagingTop
          />

          {/* <table
            className='table table-hover caption-top table-bordered'
            style={{ textAlign: 'center' }}
          >
            <caption style={{ color: 'black' }}>List of galleries</caption>
            <thead>
              <tr style={{ backgroundColor: '#337ab7', color: 'white' }}>
                <th scope='col'>#</th>
                <th scope='col'>Gallery Name</th>
                <th scope='col'>Privacy</th>
                <th scope='col'>Number of Images</th>
                <th scope='col'>Edit</th>
                <th scope='col'>View</th>
              </tr>
            </thead>
            <tbody>
              {galleries.map((gallery, index) => {
                return (
                  <tr key={index}>
                    <td scope='row'>{index + 1}</td>
                    <td>{gallery.galleryName}</td>
                    <td>{gallery.privacy}</td>
                    <td>{gallery.imagesCount}</td>
                    <td>
                      <Link
                        className='link-text'
                        to={`/gallery/${gallery.galleryId}`}
                      >
                        Edit
                      </Link>
                    </td>
                    <td>
                      <Link
                        className='link-text'
                        to={`/gallery/view/${gallery.galleryId}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table> */}
        </div>
      </Paper>

      <Paper
        elevation={6}
        sx={{
          background: 'linear-gradient(to bottom, #d3cce3, #e9e4f0)',
        }}
      >
        <div
          className='text-center'
          style={{ marginTop: '40px', padding: '20px' }}
        >
          <button
            type='button'
            className='btn btn-danger button'
            onClick={handleShow}
            disabled={galleries.length < 1}
          >
            <span>
              <FaSkullCrossbones style={{ marginBottom: '3px' }} /> Delete All
              Galleries
            </span>
          </button>
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
          <form onSubmit={deleteAllGalleries} autoComplete='off'>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button type='submit' variant='danger' onClick={deleteAllGalleries}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <SnackbarAlert
        open={open}
        severity='error'
        message={message}
        close={handleAlert}
      />

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        // onClick={handleClose}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </div>
  );
}

export default GalleriesPage;

// for mdb react bootstrap table
