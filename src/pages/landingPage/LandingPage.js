import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import featuredImage1 from '../../assets/featured-image-1.svg';
import featuredImage2 from '../../assets/featured-image-2.svg';
import featuredImage3 from '../../assets/featured-image-3.svg';
import featuredImage4 from '../../assets/featured-image-4.svg';
import url from '../../context/url';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import SnackbarAlert from '../../components/snackbarAlert/SnackbarAlert';

function LandingPage() {
  const navigate = useNavigate();
  const [userNames, setUserNames] = useState([]);
  const [galleryNames, setGalleryNames] = useState([]);

  const [message, setMessage] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleAlert = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    async function getUserNames() {
      try {
        const response = await axios.get(`${url}/api/users/usernames/`);
        if (response && response.status === 200) {
          setUserNames(response.data);
        }
      } catch (e) {
        // console.log(e);
      }
    }
    getUserNames();

    async function getGalleryNames() {
      try {
        const response = await axios.get(
          `${url}/api/galleries/gallerynames/${
            localStorage.getItem('id') === null
              ? 'public'
              : localStorage.getItem('id')
          }`
        );
        if (response && response.status === 200) {
          setGalleryNames(response.data);
        }
      } catch (e) {
        // console.log(e);
      }
    }
    getGalleryNames();
  }, []);

  const [searchedUser, setSearchedUser] = useState('');
  const [searchedGallery, setSearchedGallery] = useState('');

  const searchUser = async (e) => {
    e.preventDefault();
    try {
      let response;
      response = await axios.get(`${url}/api/users/search/${searchedUser}`);
      if (response.data !== 'Not found') {
        navigate(`/users/${response.data}`);
        window.location.reload(false);
      } else {
        setMessage('User Not Found!');
        setOpen(true);
      }
    } catch (e) {
      // console.log(e);
    }
  };

  const searchGallery = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.get(
        `${url}/api/galleries/search/${searchedGallery}/${
          localStorage.getItem('id') === null
            ? 'public'
            : localStorage.getItem('id')
        }/`
      );
      if (response.data !== 'Not found') {
        navigate(`/gallery/view/${response.data}`);
        window.location.reload(false);
      } else {
        setMessage('Gallery Not Found!');
        setOpen(true);
      }
    } catch (e) {
      // console.log(e);
    }
  };

  return (
    <div className='landing-page'>
      <Carousel pause='false'>
        <Carousel.Item className='carousel' interval={5000}>
          <img
            className='d-block w-100'
            src={featuredImage1}
            alt='First slide'
          />
        </Carousel.Item>
        <Carousel.Item className='carousel' interval={2000}>
          <img
            className='d-block w-100'
            src={featuredImage2}
            alt='Second slide'
          />
        </Carousel.Item>
        <Carousel.Item className='carousel' interval={2000}>
          <img
            className='d-block w-100'
            src={featuredImage3}
            alt='Third slide'
          />
        </Carousel.Item>
        <Carousel.Item className='carousel' interval={2000}>
          <img
            className='d-block w-100'
            src={featuredImage4}
            alt='Third slide'
          />
        </Carousel.Item>
      </Carousel>

      <div className='search-container'>
        <h1 style={{ fontFamily: 'monospace' }}>View Users and Galleries</h1>
        <form onSubmit={searchUser} className='search-user'>
          <Autocomplete
            disablePortal
            id='combo-box-demo'
            options={userNames}
            // inputValue={inputValue}
            onInputChange={(e, newInputValue) => {
              setSearchedUser(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder='Search User...'
                label='Users'
              />
            )}
          />
          <div className='text-center'>
            <button className='btn btn-primary button' type='submit'>
              <span>Search</span>
            </button>
          </div>
        </form>
        <form onSubmit={searchGallery} className='search-gallery'>
          <Autocomplete
            disablePortal
            id='combo-box-demo'
            options={galleryNames}
            onInputChange={(e, newInputValue) => {
              setSearchedGallery(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder='Search Gallery...'
                label='Galleries'
              />
            )}
          />
          <div className='text-center'>
            <button className='btn btn-primary button' type='submit'>
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>

      <SnackbarAlert
        open={open}
        severity='error'
        message={message}
        close={handleAlert}
      />
    </div>
  );
}

export default LandingPage;
