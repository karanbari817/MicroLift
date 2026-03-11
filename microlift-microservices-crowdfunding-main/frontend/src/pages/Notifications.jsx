import React from 'react';
import { Container, Card, ListGroup, Badge } from 'react-bootstrap';
import { FaBell, FaInfoCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Notifications = () => {
    const notifications = [
        { id: 1, type: 'success', message: 'Your donation of ₹5,000 to "Help Rahul Pay Fees" was successful.', time: '2 hours ago', unread: true },
        { id: 2, type: 'info', message: 'New update on "Heart Surgery for Anaya". View the progress now.', time: '1 day ago', unread: false },
        { id: 3, type: 'warning', message: 'Your profile is incomplete. Please add your phone number.', time: '2 days ago', unread: true },
        { id: 4, type: 'info', message: 'Welcome to MicroLift! Start your journey by exploring campaigns.', time: '3 days ago', unread: false },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <FaCheckCircle className="text-success" />;
            case 'warning': return <FaExclamationTriangle className="text-warning" />;
            default: return <FaInfoCircle className="text-info" />;
        }
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4"><FaBell className="me-2 text-primary" /> Notifications</h2>
            <Card className="shadow-sm border-0">
                <ListGroup variant="flush">
                    {notifications.map((notif) => (
                        <ListGroup.Item key={notif.id} className={`d-flex align-items-center py-3 ${notif.unread ? 'bg-light' : ''}`}>
                            <div className="fs-4 me-3">
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-grow-1">
                                <p className={`mb-1 ${notif.unread ? 'fw-bold' : ''}`}>{notif.message}</p>
                                <small className="text-muted">{notif.time}</small>
                            </div>
                            {notif.unread && <Badge bg="primary" pill>New</Badge>}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>
        </Container>
    );
};

export default Notifications;
