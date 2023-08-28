import React, { useState, useEffect } from 'react';
import './EditGalleryPage.css';
import axios from 'axios';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import url from '../../context/url';
import Loading from '../../components/loading/Loading';
import SnackbarAlert from '../../components/snackbarAlert/SnackbarAlert';
import Paper from '@mui/material/Paper';
import { Backdrop, CircularProgress } from '@mui/material';
import DeleteGallery from '../../components/deleteGallery/DeleteGallery';

function EditGalleryPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState({});
  const [galleryName, setGalleryName] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');

  const [open, setOpen] = React.useState(false);
  const handleAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    async function getGalleryData() {
      try {
        const response = await axios({
          method: 'get',
          url: `${url}/api/galleries/get/${localStorage.getItem('id')}/${
            params.id
          }`,
        });
        if (response && response.status === 200) {
          setGallery(response.data);
          setGalleryName(response.data.name);
          setPrivacy(response.data.privacy);
          setLoading(false);
        }
      } catch (e) {
        navigate('/notFound');
        // console.log(e);
      }
    }
    getGalleryData();
  }, []);

  const updateGallery = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        method: 'put',
        url: `${url}/api/galleries/updateGallery/`,
        data: {
          id: params.id,
          name: galleryName,
          privacy: privacy,
        },
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          Authorization: localStorage.getItem('jwt'),
        },
      });
      if (response && response.status === 200) {
        setSeverity('success');
        setMessage('Gallery Details updated!');
        setOpen(true);
      }
    } catch (e) {
      setSeverity('error');
      setMessage('Gallery Name Already Exists!');
      setOpen(true);
      // console.log(e);
    }
  };

  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleClose = () => {
    setOpenBackdrop(false);
  };
  const handleToggle = () => {
    setOpenBackdrop(!open);
  };

  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    let fileNames = [];
    let images = [...e.target.files].filter((file) => {
      for (let i = 0; i < gallery.images.length; i++) {
        if (gallery.images[i].name === file.name) {
          fileNames.push(file.name);
          return;
        }
      }
      if (file.size > 4048576) {
        setMessage('Max-Size 3 MB Allowed!');
        setSeverity('error');
        setOpen(true);
      } else return file;
    });

    if (fileNames.length > 0) {
      setMessage(`${fileNames.join(', ')} Already Uploaded!`);
      setSeverity('error');
      setOpen(true);
    }

    // console.log(images);
    setFiles(images);
  };

  const uploadImages = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      // console.log('yes');
      setSeverity('error');
      setMessage('Gallery Images Not Updated!');
      setOpen(true);
      return;
    }

    handleToggle();
    let bodyFormData = new FormData();
    files.forEach((file) => {
      bodyFormData.append('images', file);
    });

    try {
      const response = await axios({
        method: 'post',
        url: `${url}/api/images/addImages/${params.id}/`,
        data: bodyFormData,
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          Authorization: localStorage.getItem('jwt'),
        },
      });
      window.location.reload(false);
    } catch (e) {
      // console.log(e);
    }
    handleClose();
  };

  const deleteImage = async (imageId) => {
    setGallery({
      ...gallery,
      images: gallery.images.filter((image) => image.id !== imageId),
    });
    try {
      await axios({
        method: 'delete',
        url: `${url}/api/images/deleteImage/${imageId}`,
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          Authorization: localStorage.getItem('jwt'),
        },
      });
    } catch (e) {
      // console.log(e);
    }
  };

  const deleteAllImages = () => {
    setGallery({
      ...gallery,
      images: [],
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='edit-gallery-container'>
      <h1 className='gallery-name'>{galleryName}</h1>

      <div style={{ textAlign: 'center', padding: '10px 0px 20px 0px' }}>
        <Link to={`/gallery/view/${params.id}`} className='link-text'>
          <h6 style={{ color: 'white' }}>View Gallery</h6>
        </Link>
      </div>

      <Paper
        elevation={6}
        sx={{
          background: 'linear-gradient(to bottom, #d3cce3, #e9e4f0)',
        }}
      >
        <form
          onSubmit={updateGallery}
          className='update-gallery'
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
                    value={galleryName}
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
                    value={privacy}
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
              <span>Update Gallery</span>
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
        <div className='row edit-gallery-images'>
          <div className='col-md-1 col-sm-2'>Images</div>
          <div className='col-md-11 col-sm-10'>
            <div className='row'>
              <form onSubmit={uploadImages} autoComplete='off'>
                <div className='col-md-5'>
                  <input
                    type='file'
                    accept='image/*'
                    className='form-control'
                    id='imageFile'
                    name='imageFile'
                    onChange={handleFileChange}
                    multiple
                    required
                  />
                </div>

                <div
                  className='text-center col-md-5'
                  style={{ marginTop: '20px' }}
                >
                  <button type='submit' className='btn btn-primary button'>
                    <span>Upload</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12 all-images'>
            {gallery.images &&
              gallery.images.map((image, index) => {
                return (
                  <div key={index} className='one-image'>
                    <Link to={`${url}` + image.image}>
                      <img
                        key={index}
                        src={`${url}${image.image}`}
                        // src={'data:image/png;base64,' + image.imageData}
                        className='one-image-image'
                        alt=''
                      />
                    </Link>
                    <div className='text-center' style={{ marginTop: '10px' }}>
                      <button
                        type='submit'
                        className='btn btn-danger button btn-sm'
                        onClick={() => deleteImage(image.id)}
                      >
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Paper>

      <DeleteGallery deleteImages={deleteAllImages} gallery={gallery} />

      <SnackbarAlert
        open={open}
        severity={severity}
        message={message}
        close={handleAlert}
      />

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color='secondary' />
      </Backdrop>
    </div>
  );
}

export default EditGalleryPage;
