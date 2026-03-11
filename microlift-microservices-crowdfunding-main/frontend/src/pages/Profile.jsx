import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        fullName: user?.fullName || 'John Doe',
        email: user?.email || 'john.doe@example.com',
        phone: user?.phoneNumber || '9876543210',
        role: user?.role || 'Donor',
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setIsEditing(false);
        // Logic to update user profile via API would go here
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4">My Profile</h2>
            <Row>
                <Col md={4} className="mb-4">
                    <Card className="shadow-sm border-0 text-center p-4">
                        <div className="mb-3">
                            <Image
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=0D6EFD&color=fff&size=150`}
                                roundedCircle
                                width={120}
                                height={120}
                                className="border border-3 border-light shadow-sm"
                            />
                        </div>
                        <h4>{userData.fullName}</h4>
                        <p className="text-muted text-uppercase">{userData.role}</p>
                        <Button variant="outline-danger" className="w-100 mt-2" onClick={logout}>
                            Logout
                        </Button>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white fw-bold d-flex justify-content-between align-items-center py-3">
                            <span>Personal Information</span>
                            {!isEditing && (
                                <Button variant="link" onClick={() => setIsEditing(true)}>Edit</Button>
                            )}
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="fullName"
                                                value={userData.fullName}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={userData.email}
                                                disabled // Email usually can't be changed easily
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={userData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Role</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={userData.role}
                                                disabled
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {isEditing && (
                                    <div className="text-end mt-4">
                                        <Button variant="secondary" className="me-2" onClick={() => setIsEditing(false)}>Cancel</Button>
                                        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                                    </div>
                                )}
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm border-0 mt-4">
                        <Card.Header className="bg-white fw-bold py-3">Security</Card.Header>
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-1">Password</h6>
                                    <p className="text-muted small mb-0">Last changed 3 months ago</p>
                                </div>
                                <Button variant="outline-primary" size="sm">Change Password</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
