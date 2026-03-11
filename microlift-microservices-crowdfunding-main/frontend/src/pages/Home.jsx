import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import { FaGraduationCap, FaHeartbeat, FaSearchDollar, FaShieldAlt } from 'react-icons/fa';
import { campaignService } from '../services/api';

const Home = () => {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const data = await campaignService.getPublicCampaigns();
                setCampaigns(data.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch campaigns", err);
            }
        };
        fetchCampaigns();
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="bg-light py-5 py-lg-6 position-relative overflow-hidden">
                <Container className="py-5">
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-5 mb-lg-0">
                            <h1 className="display-4 fw-bold mb-3 text-primary">
                                Small Donations. <br />
                                <span className="text-success">Big Impact.</span>
                            </h1>
                            <p className="lead text-muted mb-4">
                                Join India's most trusted micro-donation platform. Help students pursue their dreams and families overcome medical emergencies.
                            </p>
                            <div className="d-flex gap-3">
                                <Link to="/campaigns?category=Education">
                                    <Button variant="primary" size="lg" className="rounded-pill px-4 shadow-sm">
                                        <FaGraduationCap className="me-2" /> Support Education
                                    </Button>
                                </Link>
                                <Link to="/campaigns?category=Medical">
                                    <Button variant="success" size="lg" className="rounded-pill px-4 shadow-sm">
                                        <FaHeartbeat className="me-2" /> Medical Help
                                    </Button>
                                </Link>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <img
                                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                alt="Helping hands"
                                className="img-fluid rounded-4 shadow-lg"
                            />
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="py-5 bg-white">
                <Container>
                    <Row className="text-center g-4">
                        <Col md={3}>
                            <div className="p-4 rounded-3 bg-light">
                                <h2 className="fw-bold text-primary">2,500+</h2>
                                <p className="mb-0 text-muted">Lives Impacted</p>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="p-4 rounded-3 bg-light">
                                <h2 className="fw-bold text-success">₹1.2 Cr</h2>
                                <p className="mb-0 text-muted">Funds Raised</p>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="p-4 rounded-3 bg-light">
                                <h2 className="fw-bold text-primary">150+</h2>
                                <p className="mb-0 text-muted">Partner Hospitals</p>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="p-4 rounded-3 bg-light">
                                <h2 className="fw-bold text-success">100%</h2>
                                <p className="mb-0 text-muted">Verified Campaigns</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Featured Campaigns */}
            <section className="py-5 bg-light">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">Featured Campaigns</h2>
                        <Link to="/campaigns" className="text-decoration-none fw-bold">View All &rarr;</Link>
                    </div>
                    <Row className="g-4">
                        {campaigns.map(camp => (
                            <Col md={6} lg={4} key={camp.id}>
                                <CampaignCard {...camp} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* How it Works / Features */}
            <section className="py-5 bg-white">
                <Container>
                    <h2 className="text-center fw-bold mb-5">Why Choose MicroLift?</h2>
                    <Row className="text-center g-4">
                        <Col md={4}>
                            <div className="mb-3 text-primary">
                                <FaShieldAlt size={50} />
                            </div>
                            <h4>100% Verified</h4>
                            <p className="text-muted">Every case is verified with valid documents and hospital/college checks.</p>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3 text-success">
                                <FaSearchDollar size={50} />
                            </div>
                            <h4>Transparent Progress</h4>
                            <p className="text-muted">Track every rupee you donate and see exactly how it is used.</p>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3 text-primary">
                                <FaHeartbeat size={50} />
                            </div>
                            <h4>Direct Impact</h4>
                            <p className="text-muted">Funds are transferred directly to the educational institution or hospital.</p>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default Home;
