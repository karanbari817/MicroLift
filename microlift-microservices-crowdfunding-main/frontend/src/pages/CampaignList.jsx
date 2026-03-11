import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import CampaignCard from '../components/CampaignCard';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { campaignService } from '../services/api';

const CampaignList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ACTIVE'); // Default to Active
    const [campaigns, setCampaigns] = useState([]);
    // const [loading, setLoading] = useState(true); // Removed unused loading state if effectively unused, or use it.

    React.useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                // Fetch all public campaigns (which are active)
                // If we want filtering by status globally, we might filtering client side or API side.
                // API /api/campaigns/public returns active ones.
                // Use centralized service with field mapping
                const data = await campaignService.getPublicCampaigns();
                setCampaigns(data);
            } catch (err) {
                console.error("Error fetching campaigns", err);
            } finally {
                // setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.location.toLowerCase().includes(searchTerm.toLowerCase());

        // Backend returns uppercase Enums (EDUCATION, MEDICAL, etc.)
        const categoryMatch = categoryFilter === 'ALL' || campaign.category === categoryFilter;

        // Backend returns uppercase Status (ACTIVE, COMPLETED)
        const statusMatch = statusFilter === 'ALL' || campaign.status === statusFilter;

        return matchesSearch && categoryMatch && statusMatch;
    });

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                <div className="mb-5">
                    <h2 className="fw-bold mb-4">Find a Cause to Support</h2>

                    <div className="bg-white p-4 rounded-3 shadow-sm border">
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Label className="fw-bold small">Search</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text><FaSearch /></InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by title or location..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={3}>
                                <Form.Label className="fw-bold small">Category</Form.Label>
                                <Form.Select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="ALL">All Categories</option>
                                    <option value="EDUCATION">Education</option>
                                    <option value="MEDICAL">Medical</option>
                                    <option value="EMERGENCY">Emergency</option>
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Form.Label className="fw-bold small">Status</Form.Label>
                                <Form.Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="ALL">All Statuses</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="COMPLETED">Completed</option>
                                </Form.Select>
                            </Col>
                            <Col md={2} className="d-flex align-items-end">
                                <button className="btn btn-outline-secondary w-100" onClick={() => {
                                    setSearchTerm('');
                                    setCategoryFilter('ALL');
                                    setStatusFilter('ALL'); // Or 'ACTIVE' depending on preference
                                }}>
                                    Reset Filters
                                </button>
                            </Col>
                        </Row>
                    </div>
                </div>

                <Row className="g-4">
                    {filteredCampaigns.length > 0 ? (
                        filteredCampaigns.map(campaign => (
                            <Col md={6} lg={4} key={campaign.id}>
                                <CampaignCard {...campaign} />
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center py-5">
                            <h4 className="text-muted">No campaigns found matching your criteria.</h4>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default CampaignList;
