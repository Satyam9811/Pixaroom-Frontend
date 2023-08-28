import React, { useState, useEffect } from 'react';
import './OtherUserPage.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/loading/Loading';
import Paper from '@mui/material/Paper';
import url from '../../context/url';
import defaultProfilePic from '../../assets/defaultProfilePic.png';
import { MDBDataTableV5 } from 'mdbreact';

function OtherUserPage() {
  const params = useParams();
  const navigate = useNavigate();

  // useEffect(() => {
  if (params.id === localStorage.getItem('id')) {
    navigate('/user');
    // window.location.reload(false);
  }
  // }, []);

  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState('');
  // const [data, setData] = useState({});
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [galleriesCount, setGalleriesCount] = useState(0);
  const [imagesCount, setImagesCount] = useState(0);

  const [galleryData, setGalleryData] = useState({
    columns: [
      {
        label: '#',
        field: 'id',
        sort: 'asc',
      },
      {
        label: 'Gallery Name',
        field: 'name',
        sort: 'asc',
      },
      {
        label: 'No. of Images',
        field: 'images',
        sort: 'asc',
      },
      {
        label: 'View Gallery',
        field: 'view',
        sort: 'asc',
      },
    ],
    rows: [],
  });

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await axios.get(`${url}/api/users/user/${params.id}`);
        if (response && response.status === 200) {
          let data = response.data;
          setUsername(data.username);
          if (data.first_name) setFirstName(data.first_name);
          if (data.last_name) setLastName(data.last_name);
          setBio(data.bio);
          setGalleriesCount(data.galleriesCount);
          setImagesCount(data.imagesCount);
          // setData(response.data);

          let newrows = [];

          response.data.galleries.forEach((gallery, index) => {
            if (gallery.privacy === 'public') {
              newrows.push({
                id: index + 1,
                name: gallery.name,
                images: gallery.imagesCount,
                view: (
                  <Link
                    className='link-text'
                    to={`/gallery/view/${gallery.id}`}
                  >
                    View
                  </Link>
                ),
              });
            }
          });

          setGalleryData({
            ...galleryData,
            rows: newrows,
          });

          getUserProfilePic();
        }
      } catch (e) {
        navigate('/userNotFound');
        // console.log(e);
      }
    }
    getUserData();

    async function getUserProfilePic() {
      try {
        const response = await axios.get(
          `${url}/api/users/getUserPhoto/${params.id}`
        );
        if (response && response.status === 200) {
          setProfilePic(response.data.profilePic);
          setLoading(false);
        }
      } catch (e) {
        // console.log(e);
        setLoading(false);
      }
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='other-user'>
      <Paper
        elevation={6}
        sx={{
          background: 'linear-gradient(to bottom, #d3cce3, #e9e4f0)',
          marginBottom: '40px',
        }}
      >
        <div className='row user-row'>
          <div className='col-md-4 user-page-left'>
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
                    src={'data:image/png;base64,' + profilePic}
                    alt=''
                  />
                ) : (
                  <img
                    className='edit-profile-pic'
                    src={defaultProfilePic}
                    alt=''
                  />
                )}
              </div>
            </div>
          </div>
          <div className='col-md-8 user-page-right'>
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
        </div>
      </Paper>

      <Paper
        elevation={6}
        sx={{
          background: 'linear-gradient(to bottom, #d3cce3, #e9e4f0)',
        }}
      >
        <div className='table-responsive other-user-galleries'>
          <MDBDataTableV5
            striped
            bordered
            hover
            data={galleryData}
            entriesOptions={[25, 50, 100]}
            entries={25}
            pagingTop
            searchTop
            searchBottom={false}
            fullPagination
            searchLabel='Search...'
            noBottomColumns={true}
          />

          {/* <table
            className='table table-hover caption-top table-bordered'
            style={{ textAlign: 'center' }}
          >
            <caption>List of galleries</caption>
            <thead>
              <tr style={{ backgroundColor: '#337ab7', color: 'white' }}>
                <th scope='col'>#</th>
                <th scope='col'>Gallery Name</th>
                <th scope='col'>Number of Images</th>
                <th scope='col'>View Gallery</th>
              </tr>
            </thead>
            <tbody>
              {data.galleries.map((gallery, index) => {
                if (gallery.privacy === 'public') {
                  return (
                    <tr key={index}>
                      <td scope='row'>{index + 1}</td>
                      <td>{gallery.galleryName}</td>
                      <td>{gallery.imagesCount}</td>
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
                }
              })}
            </tbody>
          </table> */}
        </div>
      </Paper>
    </div>
  );
}

export default OtherUserPage;
