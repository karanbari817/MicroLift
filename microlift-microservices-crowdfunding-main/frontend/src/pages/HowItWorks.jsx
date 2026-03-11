import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaHandHoldingHeart, FaShareAlt, FaMoneyBillWave, FaSmile } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaHandHoldingHeart size={50} className="text-primary mb-3" />,
            title: "1. Start a Campaign",
            description: "Create a fundraising campaign for a cause you care about. Tell your story, set a goal, and add pictures to make it compelling."
        },
        {
            icon: <FaShareAlt size={50} className="text-success mb-3" />,
            title: "2. Share with Everyone",
            description: "Share your campaign on social media, WhatsApp, and email to reach as many people as possible. The more you share, the more you raise."
        },
        {
            icon: <FaMoneyBillWave size={50} className="text-warning mb-3" />,
            title: "3. Collect Funds",
            description: "Accept donations securely from around the world. Track your progress in real-time on your dashboard."
        },
        {
            icon: <FaSmile size={50} className="text-info mb-3" />,
            title: "4. Make a Difference",
            description: "Withdraw funds directly to your bank account and use them to execute your cause. Update your donors on the impact."
        }
    ];

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                <div className="text-center mb-5">
                    <h1 className="fw-bold display-4 mb-3">How MicroLift Works</h1>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                        MicroLift makes it easy to raise funds for the people and causes you care about.
                        Follow these simple steps to start your journey.
                    </p>
                </div>

                <Row className="g-4">
                    {steps.map((step, index) => (
                        <Col md={6} lg={3} key={index}>
                            <Card className="h-100 border-0 shadow-sm text-center py-4 px-3 hover-scale transition-all">
                                <Card.Body>
                                    <div className="mb-3">{step.icon}</div>
                                    <Card.Title className="fw-bold fs-5 mb-3">{step.title}</Card.Title>
                                    <Card.Text className="text-muted small">
                                        {step.description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div className="text-center mt-5">
                    <h3 className="fw-bold mb-4">Ready to start your fundraising journey?</h3>
                    <Link to="/register">
                        <Button variant="primary" size="lg" className="px-5 rounded-pill shadow">
                            Start a Campaign
                        </Button>
                    </Link>
                    <div className="mt-3">
                        <span className="text-muted">Already have an account? </span>
                        <Link to="/login" className="text-decoration-none fw-bold">Login</Link>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default HowItWorks;
