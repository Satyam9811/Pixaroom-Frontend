import React from 'react';
import './ErrorPage.css';
import errorImage from '../../assets/error-image.jpg';

function ErrorPage() {
  return (
    <div className='error-page'>
      <img src={errorImage} alt='' className='error-image' />
    </div>
  );
}

export default ErrorPage;
