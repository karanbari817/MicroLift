import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { FaUpload, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { campaignService } from '../services/api';
import mediaService from '../services/mediaService';
import { useAuth } from '../context/AuthContext';


const CreateCampaign = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth(); // Use useAuth hook
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        goalAmount: '',
        description: '',
        endDate: '',
        location: '',
        // imageUrl removed, handled via file upload
        beneficiaryId: user?.id || 1 // Use logged-in User ID
    });

    const [selectedFiles, setSelectedFiles] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null); // [NEW] Thumbnail State

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleThumbnailChange = (e) => {
        setThumbnailFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Step 1: Upload Thumbnail
            let thumbnailUrl = '';
            if (thumbnailFile) {
                const response = await mediaService.uploadFile(thumbnailFile);
                thumbnailUrl = response.url;
            }

            // Step 2: Upload Verification Docs
            const documentUrls = [];
            if (selectedFiles) {
                for (let i = 0; i < selectedFiles.length; i++) {
                    const response = await mediaService.uploadFile(selectedFiles[i]);
                    documentUrls.push(response.url);
                }
            }

            // Step 3: Create Campaign (Send JSON)
            const campaignData = {
                ...formData,
                imageUrl: thumbnailUrl,
                documentUrls: documentUrls
            };

            await campaignService.createCampaign(campaignData);

            setSubmitted(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data?.message || err.message || 'Failed to create campaign. Please try again.';
            setError(`Error: ${errMsg} (Status: ${err.response?.status})`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-5">
                            <h2 className="mb-4 fw-bold text-center">Start a New Campaign</h2>

                            {submitted ? (
                                <Alert variant="success" className="text-center">
                                    <FaCheck size={30} className="mb-2 d-block mx-auto" />
                                    <strong>Submitted Successfully!</strong><br />
                                    Your campaign is under verification. You will be notified once approved.
                                </Alert>
                            ) : (
                                <Form onSubmit={handleSubmit}>
                                    {error && <Alert variant="danger">{error}</Alert>}
                                    <Row>
                                        <Col md={12} className="mb-3">
                                            <Form.Label>Campaign Title</Form.Label>
                                            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Help Rahul with College Fees" required />
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                                                <option value="">Select Category</option>
                                                <option value="EDUCATION">Education</option>
                                                <option value="MEDICAL">Medical</option>
                                                <option value="EMERGENCY">Emergency</option>
                                                <option value="ENVIRONMENT">Environment</option>
                                            </Form.Select>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Form.Label>Goal Amount (₹)</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>₹</InputGroup.Text>
                                                <Form.Control type="number" name="goalAmount" value={formData.goalAmount} onChange={handleChange} placeholder="50000" required />
                                            </InputGroup>
                                        </Col>
                                        <Col md={12} className="mb-3">
                                            <Form.Label>Campaign Story / Description</Form.Label>
                                            <Form.Control as="textarea" rows={6} name="description" value={formData.description} onChange={handleChange} placeholder="Describe the need..." required />
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Form.Label>End Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                            />
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Form.Label>Beneficiary Location</Form.Label>
                                            <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, State" required />
                                        </Col>

                                        <Col md={12} className="mb-3">
                                            <Form.Label>Campaign Thumbnail Image</Form.Label>
                                            <Form.Control type="file" accept="image/*" onChange={handleThumbnailChange} required />
                                            <Form.Text className="text-muted">This image will be shown on the campaign card.</Form.Text>
                                        </Col>

                                        <Col md={12} className="mb-4">
                                            <Form.Label>Upload Verification Documents</Form.Label>
                                            <div className="border border-2 border-dashed rounded p-4 text-center bg-light">
                                                <FaUpload className="text-muted mb-2" size={24} />
                                                <p className="mb-2 text-muted">Drag & drop files here or click to upload</p>
                                                <small className="text-muted d-block mb-3">(Medical Reports, Fee Structure, ID Proof)</small>
                                                <Form.Control type="file" multiple onChange={handleFileChange} />
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className="d-grid gap-2">
                                        <Button variant="primary" size="lg" type="submit" disabled={loading}>
                                            {loading ? 'Submitting...' : 'Submit for Verification'}
                                        </Button>
                                        <Button variant="light" onClick={() => navigate('/dashboard')}>Cancel</Button>
                                    </div>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateCampaign;
