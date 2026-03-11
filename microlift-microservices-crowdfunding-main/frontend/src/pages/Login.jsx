import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CaptchaComponent from '../components/CaptchaComponent';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [error, setError] = useState('');
    const { login, logout, user } = useAuth(); // Get user to check if we need to force logout
    const navigate = useNavigate();
    const location = useLocation();
    const message = location.state?.message;

    // If we just registered, we might be auto-logged in by context, but we want to force explicit login.
    // However, if we do that, we might confuse the state.
    // Let's rely on the user just seeing the login screen.
    // If the Context `register` function sets the user, then `user` is not null.
    // If `user` is not null, `Login` page might redirect to Dashboard if we had a protection wrapper.
    // But `Login.jsx` doesn't have a "redirect if logged in" check visible here.

    // Actually, to be safe and satisfy "register then login", we should probably ensure they are logged out when landing here if coming from register.
    // But `useEffect` is better for that.

    React.useEffect(() => {
        // Clear any stale tokens when landing on login page
        // This prevents old tokens from being attached to the login request
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (user) {
            logout();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaVerified) {
            setError('Please verify the CAPTCHA.');
            return;
        }
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch {
            setError('Invalid credentials or server error');
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="shadow">
                        <Card.Body className="p-5">
                            <h2 className="text-center fw-bold mb-4">Welcome Back</h2>
                            {message && <Alert variant="success">{message}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <CaptchaComponent onVerify={setCaptchaVerified} />

                                <div className="text-end mb-3">
                                    <Link to="/forgot-password">Forgot Password?</Link>
                                </div>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 mb-3"
                                    disabled={!captchaVerified}
                                >
                                    Login
                                </Button>

                                <div className="text-center">
                                    <small className="text-muted">Don't have an account? <Link to="/register">Register</Link></small>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
