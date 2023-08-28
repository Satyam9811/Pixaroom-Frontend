import React, { useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import { UserContext } from '../../context/user';
import { MdSettings, MdPerson, MdLogout } from 'react-icons/md';
import pixaroom from '../../assets/pixaroom.svg';

function Header() {
  const navigate = useNavigate();
  const { loggedIn, userLogout, username } = React.useContext(UserContext);
  const [expanded, setExpanded] = useState(false);

  const logOut = () => {
    userLogout();
    navigate('/');
    window.location.reload(false);
  };

  return (
    <div className='header'>
      <Navbar
        expanded={expanded}
        collapseOnSelect
        expand='lg'
        bg='dark'
        variant='dark'
      >
        <Container>
          <Navbar.Brand as={Link} to={'/'} className='me-5'>
            <img
              src={pixaroom}
              alt='pixaroom-logo'
              style={{ height: '30px' }}
              className='d-inline-block align-top'
            />
          </Navbar.Brand>

          <Navbar.Toggle
            onClick={() => setExpanded(expanded ? false : 'expanded')}
            aria-controls='responsive-navbar-nav'
          />

          <Navbar.Collapse
            id='responsive-navbar-nav'
            className='collapse-navbar-on-mobile'
          >
            <Nav className='me-auto'>
              {loggedIn === 'true' && (
                <Nav.Link
                  // as={Link}
                  // to={'/galleries'}
                  href='/galleries'
                  onClick={() => setExpanded(false)}
                >
                  Galleries
                </Nav.Link>
              )}
            </Nav>

            <Nav>
              {loggedIn === 'true' ? (
                <NavDropdown
                  className='me-5'
                  title={username}
                  id='collasible-nav-dropdown'
                >
                  <NavDropdown.Item href='/user'>
                    <MdPerson size={'25px'} color={'blue'} /> Profile
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as={Link}
                    to={'/user/edit'}
                    onClick={() => setExpanded(false)}
                  >
                    <MdSettings size={'22px'} color={'red'} /> Account Settings
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={logOut}>
                    <MdLogout size={'20px'} color={'green'} /> Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <React.Fragment>
                  <Nav.Link
                    as={Link}
                    to={'/login'}
                    className='me-4'
                    onClick={() => setExpanded(false)}
                  >
                    Log In
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to={'/signup'}
                    onClick={() => setExpanded(false)}
                  >
                    Sign Up
                  </Nav.Link>
                </React.Fragment>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
