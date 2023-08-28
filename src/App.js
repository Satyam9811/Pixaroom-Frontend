import React from 'react';
import './App.css';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Header from './components/header/Header';
import ErrorPage from './pages/errorPage/ErrorPage';
import LandingPage from './pages/landingPage/LandingPage';
import LoginPage from './pages/loginPage/LoginPage';
import SignupPage from './pages/signupPage/SignupPage';
import UserPage from './pages/userPage/UserPage';
import EditProfilePage from './pages/editProfilePage/EditProfilePage';
import OtherUserPage from './pages/otherUserPage/OtherUserPage';
import GalleriesPage from './pages/galleriesPage/GalleriesPage';
import ViewGalleryPage from './pages/viewGalleryPage/ViewGalleryPage';
import EditGalleryPage from './pages/editGalleryPage/EditGalleryPage';
import Footer from './components/footer/Footer';

function App() {
  return (
    <Router>
      <div className='App'>
        <Header></Header>
        <Routes>
          <Route path='/' element={<LandingPage></LandingPage>}></Route>

          <Route path='/login' element={<LoginPage />}></Route>

          <Route path='/signup' element={<SignupPage />}></Route>

          <Route path='/user' element={<UserPage />}></Route>

          <Route path='/user/edit' element={<EditProfilePage />}></Route>

          <Route path='/users/:id' element={<OtherUserPage />}></Route>

          <Route path='/galleries' element={<GalleriesPage />}></Route>

          <Route path='/gallery/:id' element={<EditGalleryPage />}></Route>

          <Route path='/gallery/view/:id' element={<ViewGalleryPage />}></Route>

          {/* <Route path='/image/:id' element={}></Route> */}

          <Route path='*' element={<ErrorPage></ErrorPage>}></Route>
        </Routes>

        <Footer></Footer>
      </div>
    </Router>
  );
}

export default App;
