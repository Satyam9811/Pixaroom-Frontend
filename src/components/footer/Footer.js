import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer>
      <div
        className='text-center p-3'
        style={{ backgroundColor: 'rgb(34, 37, 41)', color: 'white' }}
      >
        Copyright © {new Date().getFullYear()} Pixaroom by{' '}
        <a
          href='https://www.linkedin.com/in/satyampandey9811/'
          target='_blank'
          rel='noopener noreferrer'
          className='link-text'
          style={{ color: 'cyan' }}
        >
          Satyam Pandey
        </a>
      </div>
    </footer>
  );
}

export default Footer;
