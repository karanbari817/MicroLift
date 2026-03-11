import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Button, Tabs, Tab, Breadcrumb, Badge, Image } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { campaignService } from '../services/api';
import { FaMapMarkerAlt, FaCheckCircle, FaUserGraduate, FaShareAlt, FaHeart, FaHeartbeat, FaFileInvoiceDollar } from 'react-icons/fa';
import DonationModal from '../components/DonationModal';
import { useAuth } from '../context/AuthContext';

const CampaignDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDonate, setShowDonate] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const data = await campaignService.getCampaignById(id);
                setCampaign(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
            try {
                await campaignService.deleteCampaign(id);
                navigate('/campaigns', { state: { message: 'Campaign deleted successfully' } });
            } catch (err) {
                console.error("Failed to delete campaign", err);
            }
        }
    };

    if (loading) return <Container className="py-5 text-center">Loading...</Container>;

    if (!campaign) {
        return (
            <Container className="py-5 text-center">
                <h2>Campaign Not Found</h2>
                <Link to="/campaigns" className="btn btn-primary mt-3">Back to Campaigns</Link>
            </Container>
        )
    }

    const percent = Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100));

    return (
        <div className="bg-light min-vh-100 py-4">
            <Container>
                <Breadcrumb className="mb-3">
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/campaigns" }}>Campaigns</Breadcrumb.Item>
                    <Breadcrumb.Item active>{campaign.title}</Breadcrumb.Item>
                </Breadcrumb>

                <Row>
                    {/* Left Column: Content */}
                    <Col lg={8}>
                        <h1 className="fw-bold mb-3">{campaign.title}</h1>

                        {/* Beneficiary Name - Prominent Display */}
                        {campaign.beneficiary && (
                            <div className="mb-3 d-flex align-items-center">
                                <span className="text-muted me-2">Campaign by:</span>
                                <strong className="text-primary fs-5">{campaign.beneficiary.fullName || campaign.beneficiary.username}</strong>
                            </div>
                        )}

                        <div className="d-flex align-items-center mb-4 text-muted">
                            <span className="me-3"><FaMapMarkerAlt /> {campaign.location}</span>
                            {/* Assuming verified is true for active public campaigns for now */}
                            <Badge bg="success" className="d-flex align-items-center"><FaCheckCircle className="me-1" /> Verified</Badge>
                            <Badge bg={campaign.category === 'EDUCATION' ? 'info' : 'danger'} className="ms-2">{campaign.category}</Badge>
                        </div>

                        <Card className="mb-4 overflow-hidden border-0 shadow-sm">
                            <Card.Img
                                variant="top"
                                src={campaign.imageUrl}
                                alt={campaign.title}
                                onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY2NjY2NiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+"; }}
                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                            />
                        </Card>

                        <Tabs defaultActiveKey="story" className="mb-4 bg-white rounded shadow-sm px-3 pt-3">
                            <Tab eventKey="story" title="Story" className="bg-white p-4 rounded-bottom shadow-sm">
                                <h4 className="fw-bold mb-3">About the Campaign</h4>
                                <p className="lead">{campaign.description}</p>
                                <p>
                                    Your support will help change lives. Every donation brings us closer to our goal.
                                    We are committed to transparency and will provide regular updates on how the funds are utilized.
                                </p>

                                {campaign.category === 'EDUCATION' && (
                                    <div className="mt-4 p-3 bg-light rounded border">
                                        <h5 className="fw-bold"><FaUserGraduate className="me-2" /> Student Details</h5>
                                        <Row className="mt-2">
                                            <Col sm={6}><strong>Beneficiary:</strong> {campaign.beneficiary?.fullName}</Col>
                                            <Col sm={6}><strong>Location:</strong> {campaign.location}</Col>
                                        </Row>
                                    </div>
                                )}

                                {campaign.category === 'MEDICAL' && (
                                    <div className="mt-4 p-3 bg-light rounded border">
                                        <h5 className="fw-bold"><FaHeartbeat className="me-2" /> Medical Details</h5>
                                        <Row className="mt-2">
                                            <Col sm={6}><strong>Beneficiary:</strong> {campaign.beneficiary?.fullName}</Col>
                                            <Col sm={6}><strong>Location:</strong> {campaign.location}</Col>
                                        </Row>
                                    </div>
                                )}
                            </Tab>
                            <Tab eventKey="documents" title="Documents" className="bg-white p-4 rounded-bottom shadow-sm">
                                <h4 className="fw-bold mb-3">Verified Documents</h4>
                                <Row className="g-3">
                                    <Col md={4}>
                                        <div className="border rounded p-2 text-center">
                                            <FaFileInvoiceDollar size={40} className="text-secondary mb-2" />
                                            <p className="small mb-0">Fee Structure / Medical Bill</p>
                                            <Button variant="link" size="sm">View</Button>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="border rounded p-2 text-center">
                                            <FaCheckCircle size={40} className="text-secondary mb-2" />
                                            <p className="small mb-0">Identity Proof</p>
                                            <Button variant="link" size="sm">View</Button>
                                        </div>
                                    </Col>
                                </Row>
                                <p className="text-muted small mt-3">All documents have been verified by the MicroLift admin team.</p>
                            </Tab>
                        </Tabs>
                    </Col>

                    {/* Right Column: Sticky Donation Panel */}
                    <Col lg={4}>
                        <div className="sticky-top" style={{ top: '100px', zIndex: 100 }}>
                            <Card className="border-0 shadow-sm p-3">
                                <Card.Body>
                                    <h3 className="fw-bold mb-3">₹{(campaign.raisedAmount || 0).toLocaleString()} <span className="text-muted fs-6 fw-normal">raised of ₹{(campaign.goalAmount || 0).toLocaleString()}</span></h3>
                                    <ProgressBar now={percent} variant="success" className="mb-2" style={{ height: '10px' }} />
                                    <div className="d-flex justify-content-between text-muted small mb-4">
                                        <span>{percent}% funded</span>
                                        <span>{campaign.endDate} ends</span>
                                    </div>

                                    {user && user.role === 'ADMIN' && (
                                        <Button variant="danger" className="w-100 mb-3" onClick={handleDelete}>
                                            Delete Campaign
                                        </Button>
                                    )}
                                    <Button variant="primary" size="lg" className="w-100 mb-3 fw-bold" onClick={() => setShowDonate(true)}>
                                        Donate Now
                                    </Button>
                                    <Button variant="outline-secondary" className="w-100 mb-4">
                                        <FaShareAlt className="me-2" /> Share Campaign
                                    </Button>

                                    <div className="d-flex align-items-center p-3 bg-light rounded">
                                        <FaHeart className="text-danger me-3" size={24} />
                                        <div>
                                            <strong className="d-block">Join the cause</strong>
                                            <small className="text-muted">Be the first to help!</small>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            <div className="mt-4 text-center">
                                <small className="text-muted d-block mb-2">Secure Payment • 80G Tax Benefit</small>
                                <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1280px-UPI-Logo-vector.svg.png" height="20" alt="UPI" className="opacity-50" />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            <DonationModal
                show={showDonate}
                onHide={() => setShowDonate(false)}
                campaignTitle={campaign.title}
                campaignId={campaign.id}
            />
        </div>
    );
};

export default CampaignDetail;
