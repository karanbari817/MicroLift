import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { campaignService, authService, donationService } from '../../services/api';

const BeneficiaryDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [donations, setDonations] = useState([]);
    const [donorNames, setDonorNames] = useState({});
    const [message, setMessage] = useState(null);

    const handleUploadKyc = async (file) => {
        setUploading(true);
        try {

            await authService.uploadKyc(currentUser.email, file);
            setMessage({ type: 'success', text: 'Document uploaded successfully! Verification pending.' });
            // Manually update local state to reflect change immediately, including the fact that a doc exists
            // We use a placeholder string if we don't have the full URL, just to trigger the "Doc: YES" logic
            setCurrentUser(prev => ({ ...prev, kycStatus: 'PENDING', isVerified: false, kycDocumentUrl: 'uploaded-pending-save' }));
            // Also update context/localStorage if possible, but local state is priority
        } catch (error) {
            console.error(error);
            setMessage({ type: 'danger', text: 'Upload failed: ' + (error.response?.data?.message || error.message) });
        } finally {
            setUploading(false);
        }
    };

    const [currentUser, setCurrentUser] = useState(user);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.id) {
                try {
                    // Fetch fresh user data to get updated KYC status
                    const userData = await authService.getUserById(user.id);

                    setCurrentUser(userData);

                    const campaignData = await campaignService.getCampaignsByBeneficiary(user.id);
                    setCampaigns(campaignData);

                    // Fetch donations for all campaigns
                    const allDonations = await Promise.all(
                        campaignData.map(c => donationService.getCampaignDonations(c.id))
                    );
                    const sortedDonations = allDonations.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setDonations(sortedDonations);

                    // Fetch donor names
                    const uniqueDonorIds = [...new Set(sortedDonations.filter(d => !d.anonymous && d.donorId).map(d => d.donorId))];
                    const names = {};
                    await Promise.all(uniqueDonorIds.map(async (id) => {
                        try {
                            const u = await authService.getUserById(id);
                            names[id] = u.fullName;
                        } catch {
                            names[id] = 'Unknown';
                        }
                    }));
                    setDonorNames(names);

                } catch (err) {
                    console.error("Failed to fetch data", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [user]);

    const totalRaised = campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);

    // Helper to check verification status across possible property names
    const isVerified = currentUser.verified || currentUser.isVerified === true;

    return (
        <div>
            <h2 className="mb-4 fw-bold">My Beneficiary Dashboard</h2>

            {message && <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>{message.text}</Alert>}

            <Row className="mb-4">
                <Col md={12}>

                    {(!isVerified && (currentUser.kycStatus === 'PENDING' || (currentUser.kycDocumentUrl && currentUser.kycStatus !== 'REJECTED'))) && (
                        <Alert variant="info" className="d-flex align-items-center justify-content-between">
                            <span>
                                <strong>Account Verification Pending:</strong> Your ID proof has been uploaded and is under review by our Admin team. You can still create campaigns, but they will only be approved after your account is verified.
                            </span>
                        </Alert>
                    )}

                    {isVerified && (
                        <Alert variant="success" className="d-flex align-items-center">
                            <span className="me-2"><Badge bg="success">Verified</Badge></span>
                            <strong>Verification Completed:</strong> Your account is fully verified. Your campaigns can now be approved and go live!
                        </Alert>
                    )}

                    {(!isVerified && (!currentUser.kycStatus || currentUser.kycStatus === 'REJECTED') && !currentUser.kycDocumentUrl) && (
                        <Card className="border-warning border-2 shadow-sm mb-3">
                            <Card.Body>
                                <h5 className="fw-bold text-warning">Action Required: Verify Your Account</h5>
                                <p>Please upload your Aadhaar Card or Government ID to get verified. You can start campaigns now, but they won't go live until you are verified.</p>
                                <input
                                    type="file"
                                    id="kycFileInput"
                                    className="form-control mb-2"
                                    accept="image/*,.pdf"
                                />
                                <Button
                                    variant="primary"
                                    onClick={async () => {
                                        const fileInput = document.getElementById('kycFileInput');
                                        const file = fileInput?.files?.[0];
                                        if (!file) {
                                            setMessage({ type: 'warning', text: 'Please select a file first' });
                                            return;
                                        }
                                        handleUploadKyc(file);
                                    }}
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Submit Document'}
                                </Button>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center shadow-sm border-0 bg-primary text-white">
                        <Card.Body className="py-4">
                            <h3>₹{(totalRaised || 0).toLocaleString()}</h3>
                            <p className="mb-0">Total Funds Received</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm border-0">
                        <Card.Body className="py-4">
                            <h3>{campaigns.length}</h3>
                            <p className="text-muted mb-0">Total Campaigns</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm border-0 d-flex align-items-center justify-content-center" style={{ minHeight: '120px' }}>
                        <Button variant="outline-primary" onClick={() => navigate('/create-campaign')}>
                            + Start New Campaign
                        </Button>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-white fw-bold">My Campaigns</Card.Header>
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Campaign</th>
                                <th>Status</th>
                                <th>Goal</th>
                                <th>Raised</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                            ) : campaigns.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-4 text-muted">No campaigns found. Start one today!</td></tr>
                            ) : (
                                campaigns.map(c => (
                                    <tr key={c.id}>
                                        <td>
                                            <div className="fw-bold">{c.title}</div>
                                            <small className="text-muted">{new Date(c.createdAt).toLocaleDateString()}</small>
                                        </td>
                                        <td>
                                            <Badge bg={
                                                c.status === 'ACTIVE' ? 'success' :
                                                    c.status === 'REJECTED' ? 'danger' :
                                                        c.status === 'COMPLETED' ? 'info' : 'warning'
                                            }>
                                                {c.status}
                                            </Badge>
                                        </td>
                                        <td>₹{(c.goalAmount || 0).toLocaleString()}</td>
                                        <td>₹{(c.raisedAmount || 0).toLocaleString()}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="me-2">{Math.round((c.raisedAmount / c.goalAmount) * 100)}%</span>
                                                <div className="progress flex-grow-1" style={{ height: '5px', width: '80px' }}>
                                                    <div
                                                        className="progress-bar bg-success"
                                                        style={{ width: `${Math.min(100, (c.raisedAmount / c.goalAmount) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white fw-bold">Recent Donations Received</Card.Header>
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Date</th>
                                <th>Campaign</th>
                                <th>Amount</th>
                                <th>Donor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                            ) : donations.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-4 text-muted">No donations received yet.</td></tr>
                            ) : (
                                donations.map((d, idx) => (
                                    <tr key={idx}>
                                        <td>{new Date(d.donatedAt || d.createdAt).toLocaleDateString()}</td>
                                        <td>{campaigns.find(c => c.id === d.campaignId)?.title || `Campaign #${d.campaignId}`}</td>
                                        <td className="fw-bold text-success">+ ₹{(d.amount || 0).toLocaleString()}</td>
                                        <td>{d.anonymous ? 'Anonymous' : (donorNames[d.donorId] || `Donor #${d.donorId}`)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default BeneficiaryDashboard;
