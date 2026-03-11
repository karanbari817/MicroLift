import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { emailService } from '../services/emailService';
import CaptchaComponent from '../components/CaptchaComponent';

const Register = () => {
    const [key, setKey] = useState('donor');
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phoneNumber: '' });
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaVerified) {
            setError('Please verify the CAPTCHA.');
            return;
        }
        try {
            await register({ ...formData, role: key.toUpperCase() });

            // Send Welcome Email
            emailService.sendWelcomeEmail({ username: formData.fullName, email: formData.email });

            // User requested explicit login flow
            navigate('/login', { state: { message: 'Registration successful! Please login to continue.' } });
        } catch (err) {
            console.error("Registration Error:", err);
            const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Registration failed. Please try again.';
            setError(errorMessage);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="shadow">
                        <Card.Body className="p-5">
                            <h2 className="text-center fw-bold mb-4">Join MicroLift</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                                className="mb-4 text-center justify-content-center"
                                fill
                            >
                                <Tab eventKey="donor" title="As Donor">
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control name="fullName" type="text" placeholder="Enter full name" onChange={handleChange} required />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control name="email" type="email" placeholder="Enter email" onChange={handleChange} required />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control name="password" type="password" placeholder="Password" onChange={handleChange} required />
                                        </Form.Group>
                                        <CaptchaComponent onVerify={setCaptchaVerified} />
                                        <Button variant="primary" type="submit" className="w-100 mb-3" disabled={!captchaVerified}>
                                            Register as Donor
                                        </Button>
                                    </Form>
                                </Tab>
                                <Tab eventKey="beneficiary" title="As Beneficiary">
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control name="fullName" type="text" placeholder="Enter full name" onChange={handleChange} required />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control name="email" type="email" placeholder="Enter email" onChange={handleChange} required />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Mobile Number</Form.Label>
                                            <Form.Control name="phoneNumber" type="tel" placeholder="Enter mobile number" onChange={handleChange} required />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control name="password" type="password" placeholder="Password" onChange={handleChange} required />
                                        </Form.Group>
                                        <CaptchaComponent onVerify={setCaptchaVerified} />
                                        <Button variant="success" type="submit" className="w-100 mb-3" disabled={!captchaVerified}>
                                            Register as Beneficiary
                                        </Button>
                                    </Form>
                                </Tab>
                            </Tabs>

                            <div className="text-center">
                                <small className="text-muted">Already have an account? <Link to="/login">Login</Link></small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
