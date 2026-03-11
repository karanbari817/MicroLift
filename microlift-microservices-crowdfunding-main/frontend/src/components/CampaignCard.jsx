import React from 'react';
import { Card, ProgressBar, Badge, Button } from 'react-bootstrap';
import { FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CampaignCard = ({ id, image, title, description, category, raised, goal, location, verified, beneficiary }) => {
    const { user } = useAuth();
    const percent = Math.min(100, Math.round((raised / goal) * 100));
    const isAdmin = user?.role === 'ADMIN';

    return (
        <Card className="h-100 overflow-hidden">
            <div className="position-relative">
                <Card.Img
                    variant="top"
                    src={image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY2NjY2NiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+"}
                    onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY2NjY2NiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+"; }}
                    style={{ height: '200px', objectFit: 'cover' }}
                />
                <Badge bg={category === 'EDUCATION' ? 'info' : 'danger'} className="position-absolute top-0 end-0 m-3 shadow-sm">
                    {category}
                </Badge>
            </div>
            <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <small className="text-muted d-flex align-items-center">
                        <FaMapMarkerAlt className="me-1" /> {location}
                    </small>
                    {verified && (
                        <Badge bg="success" pill className="d-flex align-items-center">
                            <FaCheckCircle className="me-1" /> Verified
                        </Badge>
                    )}
                </div>

                {/* Beneficiary Name Display */}
                {beneficiary && (
                    <div className="mb-2">
                        <small className="text-muted">by </small>
                        <small className="fw-bold text-primary">{beneficiary.fullName || beneficiary.username}</small>
                    </div>
                )}

                <Card.Title className="fw-bold mb-2 text-truncate" title={title}>{title}</Card.Title>
                <Card.Text className="text-muted small mb-3 flex-grow-1">
                    {(description || "").length > 80 ? description.substring(0, 80) + '...' : description}
                </Card.Text>

                <div className="mt-auto">
                    <div className="d-flex justify-content-between small fw-bold mb-1">
                        <span>Raised: ₹{(raised || 0).toLocaleString()}</span>
                        <span className="text-muted">Goal: ₹{(goal || 0).toLocaleString()}</span>
                    </div>
                    <ProgressBar now={percent} variant="success" className="mb-3" style={{ height: '8px' }} />

                    <Link to={`/campaigns/${id}`} className="d-block">
                        <Button variant={isAdmin ? "outline-secondary" : "outline-primary"} className="w-100 fw-medium">
                            {isAdmin ? 'View Campaign' : 'Donate Now'}
                        </Button>
                    </Link>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CampaignCard;
