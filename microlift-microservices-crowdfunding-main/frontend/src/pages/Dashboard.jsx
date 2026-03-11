import React from 'react';
import { Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import DonorDashboard from '../components/dashboards/DonorDashboard';
import BeneficiaryDashboard from '../components/dashboards/BeneficiaryDashboard';
import AdminDashboard from './AdminDashboard'; // Import from local pages folder

const Dashboard = () => {
    const { user, loading } = useAuth();
    const role = user?.role?.toUpperCase() || null;

    if (loading) {
        return <Container className="py-5 text-center">Loading...</Container>;
    }

    if (!user || !role) {
        return (
            <Container className="py-5 text-center">
                <h3>Access Denied</h3>
                <p>Please log in to view your dashboard.</p>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            {role === 'DONOR' && <DonorDashboard user={user} />}
            {role === 'BENEFICIARY' && <BeneficiaryDashboard />}
            {role === 'ADMIN' && <AdminDashboard />}

            {!['DONOR', 'BENEFICIARY', 'ADMIN'].includes(role) && (
                <div className="text-center">
                    <h3>Unknown Role</h3>
                    <p>Your user role ({role}) is not recognized.</p>
                </div>
            )}
        </Container>
    );
};

export default Dashboard;
