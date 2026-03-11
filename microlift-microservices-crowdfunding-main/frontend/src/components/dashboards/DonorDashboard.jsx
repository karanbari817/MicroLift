import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Table, Badge, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { donationService, campaignService, authService } from '../../services/api';

const DonorDashboard = ({ user }) => {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDonations = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                const data = await donationService.getDonationsByDonor(user.id);

                // Enhancement: Fetch campaign titles for each donation
                const donationsWithTitles = await Promise.all(data.map(async (donation) => {
                    try {
                        const campaign = await campaignService.getCampaignById(donation.campaignId);
                        let beneficiaryName = "Unknown";
                        try {
                            if (campaign.beneficiaryId) {
                                const user = await authService.getUserById(campaign.beneficiaryId);
                                beneficiaryName = user.fullName;
                            }
                        } catch {
                            console.warn("Could not fetch beneficiary for campaign", campaign.id);
                        }
                        return { ...donation, campaignTitle: campaign.title, beneficiaryName };
                    } catch {
                        return { ...donation, campaignTitle: `Campaign #${donation.campaignId}`, beneficiaryName: "Unknown" };
                    }
                }));

                setDonations(donationsWithTitles);
            } catch (err) {
                console.error("Failed to fetch donations", err);
                setError("Could not load donation history.");
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, [user]);

    return (
        <Container className="py-5">
            <h2 className="mb-4 fw-bold">My Donor Dashboard</h2>

            {/* Welcome Card */}
            <Card className="p-4 shadow-sm border-0 mb-4 bg-primary text-white">
                <Card.Body>
                    <h4>Thank you, {user?.fullName || 'Donor'}!</h4>
                    <p className="mb-3">Your generosity changes lives. Explore more campaigns to make a difference.</p>
                    <Button variant="light" size="lg" className="fw-bold text-primary" onClick={() => navigate('/campaigns')}>
                        Explore Campaigns
                    </Button>
                </Card.Body>
            </Card>

            {/* Donation History */}
            <h4 className="mb-3">Donation History</h4>
            {loading ? (
                <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : donations.length === 0 ? (
                <Alert variant="info">You haven't made any donations yet. Your journey starts now!</Alert>
            ) : (
                <Card className="shadow-sm border-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>#</th>
                                <th>Beneficiary</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((d, idx) => (
                                <tr key={d.id}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <Link to={`/campaign/${d.campaignId}`} className="text-decoration-none fw-bold">
                                            {d.beneficiaryName}
                                        </Link>
                                    </td>
                                    <td className="fw-bold">₹{d.amount}</td>
                                    <td>{new Date(d.donatedAt || d.createdAt || d.donationDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            )}
        </Container>
    );
};

export default DonorDashboard;
