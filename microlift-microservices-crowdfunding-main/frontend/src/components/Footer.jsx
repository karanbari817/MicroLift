import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="py-5 mt-auto" style={{ backgroundColor: '#1a1a1a', color: '#b0b0b0' }}>
            <Container>
                <Row className="gy-4">
                    <Col md={4}>
                        <h4 className="fw-bold text-white mb-3">MicroLift</h4>
                        <p className="small mb-4">
                            MicroLift is a community-driven donation platform empowering individuals to support causes they care about.
                            Transparency and trust are our core pillars.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-white fs-5 hover-opacity"><FaFacebook /></a>
                            <a href="#" className="text-white fs-5 hover-opacity"><FaTwitter /></a>
                            <a href="#" className="text-white fs-5 hover-opacity"><FaInstagram /></a>
                            <a href="#" className="text-white fs-5 hover-opacity"><FaLinkedin /></a>
                        </div>
                    </Col>
                    <Col md={2}>
                        <h6 className="text-white fw-bold mb-3">About</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2"><Link to="/" className="text-decoration-none text-light">About Us</Link></li>
                            <li className="mb-2"><Link to="/" className="text-decoration-none text-light">Team</Link></li>
                            <li className="mb-2"><Link to="/" className="text-decoration-none text-light">Careers</Link></li>
                            <li className="mb-2"><Link to="/" className="text-decoration-none text-light">Blog</Link></li>
                        </ul>
                    </Col>
                    <Col md={2}>
                        <h6 className="text-white fw-bold mb-3">Support</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2"><Link to="/" className="text-decoration-none text-light">Help Center</Link></li>
                            <li className="mb-2"><Link to="/" className="text-decoration-none text-light">Trust & Safety</Link></li>
                            <li className="mb-2"><Link to="/" className="text-decoration-none text-light">Terms of Service</Link></li>
                            <li className="mb-2"><Link to="/" className="text-decoration-none text-light">Privacy Policy</Link></li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h6 className="text-white fw-bold mb-3">Contact Us</h6>
                        <p className="small mb-2">Email: support@microlift.com</p>
                        <p className="small mb-2">Phone: +91 8000 9000 10</p>
                        <p className="small">Office: Bangalore, Karnataka, India</p>
                    </Col>
                </Row>
                <div className="border-top border-secondary mt-5 pt-4 text-center small">
                    <p className="mb-1">&copy; {new Date().getFullYear()} MicroLift. All rights reserved.</p>
                    <p className="mb-0 text-muted">Made with <FaHeart className="text-danger mx-1" /> for a better world.</p>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
