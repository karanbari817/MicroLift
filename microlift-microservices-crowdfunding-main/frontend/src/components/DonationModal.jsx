import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import { donationService, campaignService, authService } from '../services/api';
import { emailService } from '../services/emailService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DonationModal = ({ show, onHide, campaignTitle, campaignId }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [amount, setAmount] = useState(500);
    const [customAmount, setCustomAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [step, setStep] = useState(1); // 1: Amount, 2: Processing, 3: Success

    // Helper to select preset amounts
    const handleAmountSelect = (val) => {
        setAmount(val);
        setCustomAmount('');
    };

    // Helper for custom amount input
    const handleCustomAmountChange = (e) => {
        setCustomAmount(e.target.value);
        setAmount(Number(e.target.value));
    };

    // Mock Payment Handler
    const handleMockPayment = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError('');
        setStep(2); // Show processing screen

        try {
            // Simulate network delay for realism
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 1. Create Transaction (Mock Backend Call)
            // Ideally we call an endpoint that returns a mock transaction ID
            const paymentIntent = await donationService.createPaymentIntent(amount);
            const transactionId = paymentIntent.clientSecret || "mock_txn_" + Date.now();

            console.log("DEBUG: Mock Transaction Initiated:", transactionId);

            // 2. "Verify" / Complete Payment
            const verifyData = {
                paymentId: transactionId,
                amount: amount,
                campaignId: campaignId,
                donorId: user.id,
                isAnonymous: isAnonymous
            };

            await donationService.verifyDonation(verifyData);

            // 3. Fetch campaign details to get beneficiary info for email
            try {
                const campaign = await campaignService.getCampaignById(campaignId);
                const beneficiary = await authService.getUserById(campaign.beneficiaryId);

                // Send notification email to beneficiary
                emailService.sendDonationReceivedEmail(
                    beneficiary.email,
                    beneficiary.fullName || beneficiary.username,
                    amount,
                    campaignTitle,
                    isAnonymous ? 'Anonymous Donor' : (user.fullName || user.username)
                );
            } catch (emailErr) {
                // Email sending failure shouldn't block donation success
                console.warn('Failed to send donation email:', emailErr);
            }

            setStep(3); // Success!

        } catch (err) {
            console.error("Mock Payment Error:", err);
            setError("Simulation failed. Please try again.");
            setStep(1); // Go back
        } finally {
            setLoading(false);
        }
    };

    // Step 1: Amount Selection
    const renderStep1 = () => (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Make a Donation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-muted mb-3">Donating to: <strong>{campaignTitle}</strong></p>

                <Form.Label className="fw-bold">Choose Amount</Form.Label>
                <div className="d-flex gap-2 mb-3 flex-wrap">
                    {[500, 1000, 2500, 5000].map((val) => (
                        <Button
                            key={val}
                            variant={amount === val && !customAmount ? "primary" : "outline-primary"}
                            onClick={() => handleAmountSelect(val)}
                        >
                            ₹{val}
                        </Button>
                    ))}
                </div>

                <InputGroup className="mb-4">
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                    />
                </InputGroup>

                <Form.Check
                    type="checkbox"
                    label="Make this donation anonymous"
                    id="anonymous-check"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="mb-3 text-muted small"
                />

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                <Button
                    variant="success"
                    size="lg"
                    className="w-100"
                    onClick={handleMockPayment}
                    disabled={loading}
                >
                    Donate ₹{amount}
                </Button>

                <div className="text-center mt-3">
                    <small className="text-muted"><FaLock className="me-1" /> Secure Payment (Mock Mode)</small>
                </div>
            </Modal.Body>
        </>
    );

    // Step 2: Simulated Processing
    const renderStep2 = () => (
        <Modal.Body className="text-center py-5">
            <Spinner animation="border" variant="primary" className="mb-4" style={{ width: '3rem', height: '3rem' }} />
            <h4 className="fw-bold">Processing Payment...</h4>
            <p className="text-muted">Please wait while we confirm your transaction.</p>
        </Modal.Body>
    );

    // Step 3: Success Message
    const renderStep3 = () => (
        <Modal.Body className="text-center py-5">
            <div className="mb-4 text-success"><FaCheckCircle size={60} /></div>
            <h3 className="fw-bold mb-3">Thank You!</h3>
            <p className="text-muted mb-4">Your donation of <strong>₹{amount}</strong> was successful.</p>
            <Button variant="primary" onClick={onHide}>Close</Button>
        </Modal.Body>
    );

    return (
        <Modal show={show} onHide={onHide} centered>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </Modal>
    );
};

export default DonationModal;
