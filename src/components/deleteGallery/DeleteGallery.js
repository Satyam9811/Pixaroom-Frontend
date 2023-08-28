import React, { useState, useContext } from 'react';
import './DeleteGallery.css';
import axios from 'axios';
import SnackbarAlert from '../snackbarAlert/SnackbarAlert';
import { Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import url from '../../context/url';
import { FaSkullCrossbones } from 'react-icons/fa';
import { UserContext } from '../../context/user';
import { Modal, Button } from 'react-bootstrap';

function DeleteGallery(props) {
  const deleteImages = props.deleteImages;
  const gallery = props.gallery;
  const params = useParams();
  const navigate = useNavigate();
  const { password } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (newwork) => {
    setWork(newwork);
    setShow(true);
  };

  const [enteredPassword, setEnteredPassword] = useState('');

  const [open, setOpen] = React.useState(false);
  const [work, setWork] = useState();

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

  const deleteAllImages = async (e) => {
    e.preventDefault();
    if (enteredPassword !== password) {
      setMessage('Wrong password!');
      setSeverity('error');
      setOpen(true);
      return;
    }
    deleteImages();
    try {
      const response = await axios({
        method: 'delete',
        url: `${url}/api/images/deleteAllImages/${params.id}`,
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          Authorization: localStorage.getItem('jwt'),
        },
      });
      if (response && response.status === 200) {
        setMessage('All Images deleted!');
        setSeverity('success');
        setOpen(true);
      }
    } catch (e) {
      // console.log(e);
    }
    handleClose();
  };

  const deleteGallery = async (e) => {
    e.preventDefault();
    if (enteredPassword !== password) {
      setMessage('Wrong password!');
      setSeverity('error');
      setOpen(true);
      return;
    }
    try {
      const response = await axios({
        method: 'delete',
        url: `${url}/api/galleries/deleteGallery/${params.id}/`,
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          Authorization: localStorage.getItem('jwt'),
        },
      });
      if (response && response.status === 200) {
        navigate('/galleries');
        window.location.reload(false);
      }
    } catch (e) {
      // console.log(e);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        background: 'linear-gradient(to bottom, #d3cce3, #e9e4f0)',
        marginTop: '40px',
      }}
    >
      <div className='row delete-images-and-gallery'>
        <div className='text-center'>
          <button
            type='button'
            className='btn btn-danger button del-gal-btn'
            onClick={() => handleShow('deleteAllImages')}
            disabled={gallery.images && gallery.images.length === 0}
          >
            <span>
              <FaSkullCrossbones style={{ marginBottom: '3px' }} /> Delete All
              Images
            </span>
          </button>
          <button
            type='button'
            className='btn btn-danger button del-gal-btn'
            onClick={() => handleShow('deleteGallery')}
          >
            <span>
              <FaSkullCrossbones style={{ marginBottom: '3px' }} /> Delete
              Gallery
            </span>
          </button>
        </div>
      </div>

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
          <form
            onSubmit={
              work === 'deleteGallery' ? deleteGallery : deleteAllImages
            }
            autoComplete='off'
          >
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
          <Button
            type='submit'
            variant='danger'
            onClick={work === 'deleteGallery' ? deleteGallery : deleteAllImages}
          >
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <SnackbarAlert
        open={open}
        severity={severity}
        message={message}
        close={handleAlert}
      />
    </Paper>
  );
}

export default DeleteGallery;
