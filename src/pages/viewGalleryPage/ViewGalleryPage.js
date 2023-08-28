import React, { useState, useEffect } from 'react';
import './ViewGalleryPage.css';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import url from '../../context/url';
import Loading from '../../components/loading/Loading';
import { Paper } from '@mui/material';

function ViewGalleryPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState({});

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
          setLoading(false);
        }
      } catch (e) {
        navigate('/notFound');
        // console.log(e);
      }
    }
    getGalleryData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='view-gallery-container'>
      <h1 className='view-gallery-name'>{gallery.name}</h1>

      {gallery.images && gallery.images.length > 0 ? (
        // <Paper
        //   elevation={6}
        //   sx={{
        //     backgroundColor: '#cdd4d4',
        //     backgroundImage: 'linear-gradient(62deg, #cdd4d4 0%, #e0d8d0 100%)',
        //   }}
        // >
        <div className='row'>
          <div className='col-sm-12 view-images'>
            {gallery.images.map((image, index) => {
              return (
                <div key={index} className='view-image'>
                  <Link to={`${url}` + image.image}>
                    <img
                      key={index}
                      src={`${url}` + image.image}
                      // src={'data:image/png;base64,' + image.imageData}
                      className='view-image-image'
                      alt=''
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // </Paper>
        <div className='no-images'>
          <h3>No images uploaded yet!</h3>
        </div>
      )}
    </div>
  );
}

export default ViewGalleryPage;
