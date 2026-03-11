import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-white min-vh-100">
            {/* Hero Section */}
            <div className="bg-primary text-white py-5">
                <Container className="text-center py-5">
                    <h1 className="display-3 fw-bold mb-3">About MicroLift</h1>
                    <p className="lead fs-4 opacity-75 mx-auto" style={{ maxWidth: '800px' }}>
                        Empowering individuals and communities to make a difference through the power of micro-donations.
                    </p>
                </Container>
            </div>

            {/* Mission Section */}
            <Container className="py-5 my-5">
                <Row className="align-items-center g-5">
                    <Col lg={6}>
                        <h2 className="fw-bold text-primary mb-4">Our Mission</h2>
                        <p className="fs-5 text-muted lh-lg">
                            The Micro-Donation Platform for School Fees and Medical Bills is designed to enable transparent, secure, and low-cost micro-donations for verified educational and medical needs.
                        </p>
                        <p className="fs-5 text-muted lh-lg">
                            The platform allows beneficiaries to raise requests for financial assistance related to school fees or medical expenses after proper verification. Donors can browse these verified cases and contribute small amounts seamlessly through a user-friendly interface.
                        </p>
                    </Col>
                    <Col lg={6}>
                        <div className="p-5 bg-light rounded-4 shadow-sm text-center">
                            <h3 className="fw-bold mb-3">100+</h3>
                            <p className="text-muted mb-4">Live Campaigns</p>
                            <h3 className="fw-bold mb-3">$50k+</h3>
                            <p className="text-muted mb-0">Funds Raised</p>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Vision Section */}
            <div className="bg-light py-5">
                <Container className="py-5">
                    <Row className="justify-content-center text-center">
                        <Col lg={8}>
                            <h2 className="fw-bold mb-4">Core Values</h2>
                            <p className="fs-5 text-secondary lh-lg">
                                The system focuses on trust, accessibility, and accountability by ensuring that each donation request is validated and fund utilization details are visible to donors. It aims to promote social impact by making financial support more approachable, reliable, and efficient for both donors and beneficiaries.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* CTA Section */}
            <Container className="text-center py-5 my-5">
                <h2 className="fw-bold mb-4">Join Our Community</h2>
                <p className="text-muted mb-4">
                    Be a part of the change. Start a campaign or donate to a cause today.
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <Link to="/campaigns">
                        <Button variant="outline-primary" size="lg" className="px-5 rounded-pill">
                            Explore Campaigns
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="primary" size="lg" className="px-5 rounded-pill shadow">
                            Join Now
                        </Button>
                    </Link>
                </div>
            </Container>
        </div>
    );
};

export default About;
