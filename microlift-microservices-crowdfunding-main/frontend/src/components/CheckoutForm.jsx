import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button, Alert } from 'react-bootstrap';
import { donationService } from '../services/api';

const CheckoutForm = ({ amount, campaignId, donorId, isAnonymous, onSuccess, campaignTitle }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required', // Avoid redirect if possible
            confirmParams: {
                return_url: window.location.origin, // Fallback return URL
            },
        });

        if (error) {
            setErrorMessage(error.message);
            setLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Payment Success!
            try {
                const verifyData = {
                    amount: amount,
                    paymentId: paymentIntent.id,
                    campaignId: campaignId,
                    donorId: donorId,
                    isAnonymous: isAnonymous
                };
                await donationService.verifyDonation(verifyData);
                onSuccess(); // Trigger parent success flow
            } catch (err) {
                console.error("Verification error", err);
                setErrorMessage("Payment Succeeded but Server Verification Failed.");
            }
            setLoading(false);
        } else {
            setErrorMessage("Unexpected Payment Status: " + paymentIntent.status);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
            <Button disabled={!stripe || loading} type="submit" variant="success" className="w-100 mt-3" size="lg">
                {loading ? 'Processing...' : `Pay ₹${amount} Securely`}
            </Button>
        </form>
    );
};

export default CheckoutForm;
