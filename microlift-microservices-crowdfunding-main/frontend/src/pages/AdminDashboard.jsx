import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Alert, Card, Modal, Spinner, Accordion, Row, Col } from 'react-bootstrap';
import { campaignService, authService, donationService, payoutService } from '../services/api';
import { emailService } from '../services/emailService';

const AdminDashboard = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [completedCampaigns, setCompletedCampaigns] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    // Modal State
    const [selectedUser, setSelectedUser] = useState(null);
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [userPayouts, setUserPayouts] = useState([]); // New
    const [showUserModal, setShowUserModal] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);

    // KYC Verification Modal State
    const [showKycModal, setShowKycModal] = useState(false);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [loadingKyc, setLoadingKyc] = useState(false);

    // Payout Form State
    const [payoutAmount, setPayoutAmount] = useState('');
    const [processingPayout, setProcessingPayout] = useState(false);

    // Donation Data: { [campaignId]: [{ amount, donorName, ... }] }
    const [campaignDonations, setCampaignDonations] = useState({});
    const [loadingDonations, setLoadingDonations] = useState({});

    // ... (fetchData Logic remains same)

    // ... (handleVerify, handleDelete, handleDeleteUser logic remains same)

    const fetchData = async () => {
        try {
            const [pendingData, completedData, beneficiariesData] = await Promise.all([
                campaignService.getPendingCampaigns(),
                campaignService.getCompletedCampaigns(),
                authService.getAllBeneficiaries()
            ]);

            setCampaigns(Array.isArray(pendingData) ? pendingData : []);
            setCompletedCampaigns(Array.isArray(completedData) ? completedData : []);
            setBeneficiaries(Array.isArray(beneficiariesData) ? beneficiariesData : []);
        } catch (err) {
            console.error("DEBUG: Dashboard Load Error Details:", err);
            const errorMsg = err.response?.data?.message || err.message || "Unknown Error";
            const errorStatus = err.response?.status || "No Status";
            const errorUrl = err.config?.url || "No URL";
            console.error(`DEBUG: Failing Call: ${errorUrl} Status: ${errorStatus} Message: ${errorMsg}`);

            setMessage({ type: 'danger', text: `Failed to load dashboard data: ${errorMsg} (${errorStatus})` });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleVerify = async (id, status) => {
        try {
            await campaignService.verifyCampaign(id, status);
            if (status === 'ACTIVE') {
                const campaign = campaigns.find(c => c.id === id);
                if (campaign) {
                    emailService.sendCampaignApprovedEmail(campaign, null);
                }
            }
            setMessage({ type: 'success', text: `Campaign ${status === 'ACTIVE' ? 'Approved' : 'Rejected'} successfully` });
            fetchData();
        } catch {
            setMessage({ type: 'danger', text: 'Action failed. Try again.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) return;
        try {
            await campaignService.deleteCampaign(id);
            setMessage({ type: 'success', text: 'Campaign deleted successfully' });
            fetchData();
        } catch {
            setMessage({ type: 'danger', text: 'Failed to delete campaign.' });
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This will verify remove them permanently.")) return;
        try {
            await authService.deleteUser(userId);
            setMessage({ type: 'success', text: 'User deleted successfully' });
            fetchData();
        } catch {
            setMessage({ type: 'danger', text: 'Failed to delete user.' });
        }
    };

    const handleVerifyUser = async (userId, status) => {
        try {
            await authService.verifyUser(userId, status);
            setMessage({ type: 'success', text: `User ${status === 'VERIFIED' ? 'verified' : 'rejected'} successfully` });
            fetchData();
        } catch (err) {
            setMessage({ type: 'danger', text: 'Failed to verify user' });
        }
    };

    const handleViewBeneficiaryKyc = async (beneficiaryId, campaign) => {
        setLoadingKyc(true);
        setShowKycModal(true);
        setSelectedCampaign(campaign);
        try {
            const userData = await authService.getUserById(beneficiaryId);
            setSelectedBeneficiary(userData);
        } catch (err) {
            setMessage({ type: 'danger', text: 'Failed to load beneficiary details' });
            setShowKycModal(false);
        } finally {
            setLoadingKyc(false);
        }
    };

    const handleViewUser = async (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
        setLoadingModal(true);
        setUserCampaigns([]);
        setUserPayouts([]);
        setCampaignDonations({});
        setPayoutAmount('');

        try {
            const [campaignsData, payoutsData] = await Promise.all([
                campaignService.getCampaignsByBeneficiary(user.id),
                payoutService.getPayoutsByBeneficiary(user.id)
            ]);
            setUserCampaigns(campaignsData);
            setUserPayouts(payoutsData);
        } catch (err) {
            console.error("Failed to fetch user details", err);
        } finally {
            setLoadingModal(false);
        }
    };

    const fetchDonationsForCampaign = async (campaignId) => {
        if (campaignDonations[campaignId]) return;

        setLoadingDonations(prev => ({ ...prev, [campaignId]: true }));
        try {
            const donations = await donationService.getCampaignDonations(campaignId);
            const uniqueDonorIds = [...new Set(donations.map(d => d.donorId).filter(id => id))];
            const donorMap = {};

            await Promise.all(uniqueDonorIds.map(async (id) => {
                try {
                    const donor = await authService.getUserById(id);
                    donorMap[id] = donor.fullName;
                } catch {
                    donorMap[id] = "Unknown";
                }
            }));

            const enrichedDonations = donations.map(d => ({
                ...d,
                donorName: d.anonymous ? "Anonymous" : (donorMap[d.donorId] || "Unknown Donor")
            }));

            setCampaignDonations(prev => ({ ...prev, [campaignId]: enrichedDonations }));
        } catch (err) {
            console.error("Failed to fetch donations", err);
        } finally {
            setLoadingDonations(prev => ({ ...prev, [campaignId]: false }));
        }
    };

    const handleUserVerify = async (status) => {
        if (!selectedUser) return;
        try {
            await authService.verifyUser(selectedUser.id, status);
            if (status === 'VERIFIED') {
                emailService.sendVerificationEmail(selectedUser);
            }
            setMessage({ type: 'success', text: `User ${status === 'VERIFIED' ? 'Verified' : 'Rejected'}!` });
            setShowUserModal(false);
            fetchData();
        } catch {
            setMessage({ type: 'danger', text: 'Action Failed' });
        }
    };

    const handleCreatePayout = async () => {
        if (!payoutAmount || isNaN(payoutAmount) || payoutAmount <= 0) {
            setMessage({ type: 'warning', text: 'Enter a valid amount' });
            return;
        }
        setProcessingPayout(true);
        try {
            await payoutService.createPayoutRequest(selectedUser.id, payoutAmount);
            // Refresh Payouts
            const updatedPayouts = await payoutService.getPayoutsByBeneficiary(selectedUser.id);
            setUserPayouts(updatedPayouts);
            setPayoutAmount('');
            setMessage({ type: 'success', text: 'Payout Requested Successfully' });
        } catch (e) {
            setMessage({ type: 'danger', text: 'Failed to request payout: ' + e.message });
        } finally {
            setProcessingPayout(false);
        }
    };

    const handleApprovePayout = async (payoutId) => {
        try {
            await payoutService.approvePayout(payoutId);
            const updatedPayouts = await payoutService.getPayoutsByBeneficiary(selectedUser.id);
            setUserPayouts(updatedPayouts);
        } catch (e) {
            setMessage({ type: 'danger', text: 'Failed to approve payout' });
        }
    };

    // Calculate Financials
    const totalRaised = userCampaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
    const totalPayouts = userPayouts
        .filter(p => p.status === 'PROCESSED' || p.status === 'APPROVED')
        .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayouts = userPayouts
        .filter(p => p.status === 'PENDING')
        .reduce((sum, p) => sum + p.amount, 0);
    const availableBalance = totalRaised - totalPayouts - pendingPayouts;

    if (loading) return <div className="text-center py-5"><Spinner animation="border" /> Loading Dashboard...</div>;

    return (
        <Container className="py-5">
            <h2 className="mb-4 fw-bold">Admin Dashboard</h2>
            {message && <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>{message.text}</Alert>}

            {/* Beneficiaries Section */}
            <Card className="shadow-sm border-0 mb-5">
                <Card.Header className="bg-white fw-bold d-flex justify-content-between align-items-center">
                    <span>Beneficiaries</span>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>KYC Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {beneficiaries.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4 text-muted">No beneficiaries found.</td></tr>
                            ) : (
                                beneficiaries.map(b => (
                                    <tr key={b.id}>
                                        <td>#{b.id}</td>
                                        <td className="fw-bold">{b.fullName}</td>
                                        <td>{b.email}</td>
                                        <td>{b.phoneNumber}</td>
                                        <td>
                                            <Badge bg={b.kycStatus === 'VERIFIED' ? 'success' : b.kycStatus === 'REJECTED' ? 'danger' : 'warning'}>
                                                {b.kycStatus || 'NOT_UPLOADED'}
                                            </Badge>
                                        </td>
                                        <td>
                                            {b.kycDocumentUrl ? (
                                                <a
                                                    href={b.kycDocumentUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-info"
                                                >
                                                    View Doc
                                                </a>
                                            ) : (
                                                <span className="text-muted">No document</span>
                                            )}
                                        </td>
                                        <td>
                                            {b.kycDocumentUrl && b.kycStatus === 'PENDING' && (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handleVerifyUser(b.id, 'VERIFIED')}
                                                        className="me-1"
                                                    >
                                                        ✓ Verify
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleVerifyUser(b.id, 'REJECTED')}
                                                        className="me-2"
                                                    >
                                                        ✗ Reject
                                                    </Button>
                                                </>
                                            )}
                                            <Button variant="outline-primary" size="sm" onClick={() => handleViewUser(b)} className="me-1">
                                                Payouts
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteUser(b.id)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 mb-5">
                <Card.Header className="bg-white fw-bold">Pending Campaigns</Card.Header>
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Beneficiary</th>
                                <th>KYC Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!Array.isArray(campaigns) || campaigns.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">No pending campaigns found.</td>
                                </tr>
                            ) : (
                                campaigns.map(c => (
                                    <tr key={c.id}>
                                        <td>#{c.id}</td>
                                        <td>{c.title}</td>
                                        <td>
                                            <Button
                                                variant="link"
                                                className="p-0 text-primary fw-bold"
                                                onClick={() => handleViewBeneficiaryKyc(c.beneficiaryId, c)}
                                            >
                                                View Beneficiary
                                            </Button>
                                        </td>
                                        <td>
                                            {beneficiaries.find(b => b.id === c.beneficiaryId)?.kycStatus ? (
                                                <Badge bg={beneficiaries.find(b => b.id === c.beneficiaryId)?.kycStatus === 'VERIFIED' ? 'success' : 'warning'}>
                                                    {beneficiaries.find(b => b.id === c.beneficiaryId)?.kycStatus}
                                                </Badge>
                                            ) : <span className="text-muted">Unknown</span>}
                                        </td>
                                        <td>
                                            <Button variant="success" size="sm" className="me-2" onClick={() => handleVerify(c.id, 'ACTIVE')}>Approve</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleVerify(c.id, 'REJECTED')}>Reject</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Extended User Details Modal with Payouts */}
            <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Beneficiary Management: {selectedUser?.fullName}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    {selectedUser && (
                        <div className="row">
                            <div className="col-md-3 border-end">
                                <h6 className="fw-bold text-muted">Profile</h6>
                                <p className="mb-1">{selectedUser.email}</p>
                                <p className="mb-3">{selectedUser.phoneNumber}</p>

                                <Card className="mb-3 bg-light border-0">
                                    <Card.Body>
                                        <h6 className="fw-bold">Financials</h6>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Total Raised:</span>
                                            <span className="fw-bold text-success">₹{totalRaised.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Paid Out:</span>
                                            <span className="text-muted">₹{totalPayouts.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Pending:</span>
                                            <span className="text-warning">₹{pendingPayouts.toFixed(2)}</span>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between">
                                            <span>Available:</span>
                                            <span className="fw-bold text-primary">₹{availableBalance.toFixed(2)}</span>
                                        </div>
                                    </Card.Body>
                                </Card>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Process New Payout</label>
                                    <div className="input-group mb-2">
                                        <span className="input-group-text">₹</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={payoutAmount}
                                            onChange={(e) => setPayoutAmount(e.target.value)}
                                            placeholder="Amount"
                                        />
                                    </div>
                                    <Button
                                        variant="primary"
                                        className="w-100"
                                        onClick={handleCreatePayout}
                                        disabled={processingPayout || parseFloat(payoutAmount) > availableBalance}
                                    >
                                        {processingPayout ? 'Processing...' : 'Create Payout Request'}
                                    </Button>
                                    {parseFloat(payoutAmount) > availableBalance && <small className="text-danger d-block mt-1">Insufficent funds</small>}
                                </div>
                            </div>

                            <div className="col-md-9">
                                <h5 className="mb-3">Payout History</h5>
                                {userPayouts.length === 0 ? (
                                    <Alert variant="light" className="border">No payout history.</Alert>
                                ) : (
                                    <Table size="sm" bordered hover>
                                        <thead className="bg-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Reference</th>
                                                <th>Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userPayouts.map(p => (
                                                <tr key={p.id}>
                                                    <td>#{p.id}</td>
                                                    <td className="fw-bold">₹{p.amount}</td>
                                                    <td>
                                                        <Badge bg={p.status === 'PROCESSED' ? 'success' : p.status === 'PENDING' ? 'warning' : 'secondary'}>
                                                            {p.status}
                                                        </Badge>
                                                    </td>
                                                    <td><small>{p.transactionReference || '-'}</small></td>
                                                    <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
                                                    <td>
                                                        {p.status === 'PENDING' && (
                                                            <Button size="sm" variant="success" onClick={() => handleApprovePayout(p.id)}>
                                                                Approve Transfer
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}

                                <hr />
                                <h5 className="mb-3">Campaigns & Donations</h5>
                                {loadingModal ? (
                                    <div className="text-center py-4"><Spinner animation="border" size="sm" /> Loading campaigns...</div>
                                ) : userCampaigns.length === 0 ? (
                                    <Alert variant="info">No campaigns found for this user.</Alert>
                                ) : (
                                    <Accordion>
                                        {userCampaigns.map(c => (
                                            <Accordion.Item eventKey={c.id.toString()} key={c.id} onClick={() => fetchDonationsForCampaign(c.id)}>
                                                <Accordion.Header>
                                                    <div className="d-flex justify-content-between w-100 me-3">
                                                        <span>{c.title}</span>
                                                        <span className={c.status === 'ACTIVE' ? 'text-success' : 'text-muted'}>
                                                            {c.status} • Raised: ₹{c.raisedAmount}/{c.goalAmount}
                                                        </span>
                                                    </div>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <p>{c.description}</p>
                                                    <hr />
                                                    <h6 className="fw-bold">Donations</h6>
                                                    {loadingDonations[c.id] ? (
                                                        <div className="text-muted"><Spinner animation="border" size="sm" /> Loading donations...</div>
                                                    ) : !campaignDonations[c.id] || campaignDonations[c.id].length === 0 ? (
                                                        <div className="text-muted small">No donations yet.</div>
                                                    ) : (
                                                        <Table size="sm" striped bordered>
                                                            <thead>
                                                                <tr>
                                                                    <th>Donor</th>
                                                                    <th>Amount</th>
                                                                    <th>Date</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {campaignDonations[c.id].map((d, idx) => (
                                                                    <tr key={idx}>
                                                                        <td>{d.anonymous ? "Anonymous" : d.donorName}</td>
                                                                        <td>₹{d.amount}</td>
                                                                        <td>{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    )}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* KYC Verification Modal */}
            <Modal show={showKycModal} onHide={() => setShowKycModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Beneficiary KYC Verification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loadingKyc ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" />
                            <p className="mt-2">Loading beneficiary details...</p>
                        </div>
                    ) : selectedBeneficiary ? (
                        <div>
                            <Card className="mb-3">
                                <Card.Body>
                                    <h5 className="fw-bold mb-3">{selectedBeneficiary.fullName}</h5>
                                    <Row>
                                        <Col md={6}>
                                            <p><strong>Email:</strong> {selectedBeneficiary.email}</p>
                                            <p><strong>Phone:</strong> {selectedBeneficiary.phoneNumber}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Role:</strong> <Badge bg="info">{selectedBeneficiary.role}</Badge></p>
                                            <p><strong>KYC Status:</strong>{' '}
                                                <Badge bg={
                                                    selectedBeneficiary.kycStatus === 'VERIFIED' ? 'success' :
                                                        selectedBeneficiary.kycStatus === 'REJECTED' ? 'danger' : 'warning'
                                                }>
                                                    {selectedBeneficiary.kycStatus || 'PENDING'}
                                                </Badge>
                                            </p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Campaign Details Section */}
                            {selectedCampaign && (
                                <Card className="mb-3 border-primary">
                                    <Card.Header className="bg-primary bg-opacity-10 fw-bold">
                                        📋 Campaign Details
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={5}>
                                                {selectedCampaign.thumbnailUrl ? (
                                                    <img
                                                        src={selectedCampaign.thumbnailUrl}
                                                        alt="Campaign Thumbnail"
                                                        className="img-fluid rounded shadow-sm mb-2"
                                                        style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
                                                    />
                                                ) : (
                                                    <div className="bg-light rounded p-5 text-center text-muted">
                                                        No thumbnail
                                                    </div>
                                                )}
                                            </Col>
                                            <Col md={7}>
                                                <h5 className="fw-bold text-primary mb-2">{selectedCampaign.title}</h5>
                                                <p className="mb-2"><strong>Category:</strong> <Badge bg="secondary">{selectedCampaign.category}</Badge></p>
                                                <p className="mb-2"><strong>Goal Amount:</strong> ₹{selectedCampaign.goalAmount?.toLocaleString()}</p>
                                                <p className="mb-2"><strong>End Date:</strong> {new Date(selectedCampaign.endDate).toLocaleDateString()}</p>
                                                <p className="mb-0"><strong>Description:</strong></p>
                                                <p className="text-muted small" style={{ maxHeight: '100px', overflow: 'auto' }}>
                                                    {selectedCampaign.description}
                                                </p>
                                            </Col>
                                        </Row>

                                        {/* Campaign Documents */}
                                        {selectedCampaign.documents && selectedCampaign.documents.length > 0 && (
                                            <div className="mt-3 pt-3 border-top">
                                                <h6 className="fw-bold mb-2">📎 Supporting Documents:</h6>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {selectedCampaign.documents.map((doc, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={doc.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-outline-secondary btn-sm"
                                                        >
                                                            📄 {doc.name || `Document ${idx + 1}`}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            )}

                            {selectedBeneficiary.kycDocumentUrl ? (
                                <Card className="mb-3">
                                    <Card.Header className="bg-light fw-bold">KYC Document</Card.Header>
                                    <Card.Body className="text-center">
                                        <a
                                            href={selectedBeneficiary.kycDocumentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary btn-lg mb-3"
                                        >
                                            📄 View KYC Document
                                        </a>
                                        <p className="text-muted small">Click to open document in new tab</p>
                                    </Card.Body>
                                </Card>
                            ) : (
                                <Alert variant="warning">
                                    No KYC document uploaded yet.
                                </Alert>
                            )}

                            {selectedBeneficiary.kycDocumentUrl && selectedBeneficiary.kycStatus === 'PENDING' && (
                                <Card className="border-warning">
                                    <Card.Header className="bg-warning bg-opacity-10 fw-bold">Verification Actions</Card.Header>
                                    <Card.Body>
                                        <p className="mb-3">Review the document above and take action:</p>
                                        <div className="d-flex gap-2 justify-content-center">
                                            <Button
                                                variant="success"
                                                size="lg"
                                                onClick={() => {
                                                    handleVerifyUser(selectedBeneficiary.id, 'VERIFIED');
                                                    setShowKycModal(false);
                                                }}
                                            >
                                                ✓ Verify User
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="lg"
                                                onClick={() => {
                                                    handleVerifyUser(selectedBeneficiary.id, 'REJECTED');
                                                    setShowKycModal(false);
                                                }}
                                            >
                                                ✗ Reject User
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )}

                            {selectedBeneficiary.kycStatus === 'VERIFIED' && (
                                <Alert variant="success">
                                    <strong>✓ User is verified</strong> - This beneficiary's campaigns can be approved for fundraising.
                                </Alert>
                            )}

                            {selectedBeneficiary.kycStatus === 'REJECTED' && (
                                <Alert variant="danger">
                                    <strong>✗ User verification rejected</strong> - This user's campaigns cannot be approved until they resubmit valid KYC documents.
                                </Alert>
                            )}
                        </div>
                    ) : (
                        <Alert variant="info">No beneficiary selected</Alert>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;
