import React, { useState, useEffect } from 'react';
import axios from 'axios';
import url from './url';
import { Link } from 'react-router-dom';

const UserContext = React.createContext();

function UserProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [galleries, setGalleries] = useState([]);
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
        label: 'Privacy',
        field: 'privacy',
        sort: 'asc',
      },
      {
        label: 'No. of Images',
        field: 'images',
        sort: 'asc',
      },
      {
        label: 'Edit Gallery',
        field: 'edit',
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

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem('userLoggedIn')
  );

  useEffect(() => {
    // localStorage.setItem('userId', -1);
    if (loggedIn === 'true') {
      getLoginData();
    }
  }, []);

  const userLogout = () => {
    setLoggedIn('false');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('id');
    localStorage.removeItem('jwt');
  };

  async function getSignUpData() {
    try {
      const response = await axios.post(`${url}/api/users/addUser/`, {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
      });
      // console.log(response);
      if (response && response.status === 200) {
        getToken();
      }
      return 'true';
    } catch (e) {
      console.log(e);
      // e.response.data.message
      // alert(e.response.data.message);
      // return false;
      return `${e.response.data}`;
    }
  }

  async function getToken() {
    let token = '';
    let header = 'Bearer ';

    try {
      const response = await axios.post(`${url}/token/`, {
        username: username,
        password: password,
      });
      if (response && response.status === 200) {
        token = response.data.access;
        header = header + token;
        localStorage.setItem('jwt', header);
        getLoginData();
        return true;
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  async function getLoginData() {
    try {
      const response = await axios.get(`${url}/api/users/currentUser/`, {
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          Authorization: localStorage.getItem('jwt'),
        },
      });
      if (response) {
        localStorage.setItem('id', response.data.id);
        localStorage.setItem('userLoggedIn', 'true');
        setUserId(response.data.id);
        if (response.data.first_name) setFirstName(response.data.first_name);
        if (response.data.last_name) setLastName(response.data.last_name);
        setUsername(response.data.username);
        setPassword(response.data.password);
        setEmail(response.data.email);
        if (response.data.bio) setBio(response.data.bio);
        setGalleries(response.data.galleries);

        let newrows = [];

        response.data.galleries.forEach((gallery, index) => {
          newrows.push({
            id: index + 1,
            name: gallery.name,
            privacy: gallery.privacy,
            images: gallery.imagesCount,
            edit: (
              <Link className='link-text' to={`/gallery/${gallery.id}`}>
                Edit
              </Link>
            ),
            view: (
              <Link className='link-text' to={`/gallery/view/${gallery.id}`}>
                View
              </Link>
            ),
          });
        });

        setGalleryData({
          ...galleryData,
          rows: newrows,
        });

        setGalleriesCount(response.data.galleriesCount);
        setImagesCount(response.data.imagesCount);

        setLoggedIn('true');
        setLoading(false);
      }
    } catch (e) {
      // console.log(e);
    }
  }

  async function getUserProfilePic() {
    try {
      const response = await axios.get(
        // `${url}/api/users/getUserPhoto/`
        `${url}/api/users/getUserPhoto/${localStorage.getItem('id')}`
      );
      if (response && response.status === 200) {
        // console.log(response);
        setProfilePic(response.data);
      }
    } catch (e) {
      // console.log(e);
    }
    return true;
  }

  return (
    <UserContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        userLogout,
        getSignUpData,
        getToken,
        getLoginData,
        getUserProfilePic,
        setFirstName,
        setLastName,
        setUsername,
        setPassword,
        setEmail,
        setBio,
        setProfilePic,
        setGalleries,
        setLoading,
        loading,
        userId,
        firstName,
        lastName,
        username,
        password,
        email,
        bio,
        profilePic,
        galleries,
        galleriesCount,
        imagesCount,
        galleryData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
