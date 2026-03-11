import React from 'react';
import { Navbar, Container, Nav, Button, NavDropdown } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaHandHoldingHeart, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Navbar expand="lg" className="py-3 sticky-top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold text-primary fs-4">
                    <FaHandHoldingHeart className="me-2" size={30} />
                    MicroLift
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={NavLink} to="/" className="mx-2 fw-medium">Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/campaigns" className="mx-2 fw-medium">Campaign</Nav.Link>
                        <Nav.Link as={NavLink} to="/how-it-works" className="mx-2 fw-medium">How it's work</Nav.Link>
                        <Nav.Link as={NavLink} to="/about" className="mx-2 fw-medium">About</Nav.Link>
                        {user && <Nav.Link as={NavLink} to="/dashboard" className="mx-2 fw-medium">Dashboard</Nav.Link>}

                        <div className="mx-4 vr d-none d-lg-block"></div>

                        {!user ? (
                            <>
                                <Nav.Link as={NavLink} to="/register" className="mx-2">
                                    <Button variant="primary" className="px-4 rounded-pill">Register</Button>
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/login" className="mx-2">
                                    <Button variant="outline-primary" className="px-4 rounded-pill">Login</Button>
                                </Nav.Link>
                            </>
                        ) : (
                            <NavDropdown title={<><FaUserCircle className="me-2" />{user.fullName}</>} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => navigate('/dashboard')}>My Dashboard</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
