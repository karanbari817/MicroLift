import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CaptchaComponent from '../components/CaptchaComponent';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!captchaVerified) {
            setError('Please complete the CAPTCHA verifcation.');
            return;
        }
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            setError('');
        }, 1000);
    };

    if (submitted) {
        return (
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="shadow text-center p-5">
                            <div className="mb-4">
                                <span className="display-4 text-success">✉️</span>
                            </div>
                            <h3>Check Your Email</h3>
                            <p className="text-muted">
                                We have sent a password reset link to <strong>{email}</strong>.
                                Please check your inbox and follow the instructions.
                            </p>
                            <div className="mt-4">
                                <Link to="/login" className="btn btn-primary">Back to Login</Link>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="shadow">
                        <Card.Body className="p-5">
                            <h2 className="text-center fw-bold mb-3">Forgot Password</h2>
                            <p className="text-center text-muted mb-4">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter registered email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <CaptchaComponent onVerify={setCaptchaVerified} />

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 mb-3"
                                    disabled={!captchaVerified}
                                >
                                    Send Reset Link
                                </Button>

                                <div className="text-center">
                                    <Link to="/login" className="text-decoration-none">Back to Login</Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;
