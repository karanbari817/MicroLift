package com.microlift.donationservice.service;

import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class MockPaymentServiceImpl implements PaymentService {

    @Override
    public String initiatePayment(Double amount) {
        return "mock_txn_" + UUID.randomUUID().toString();
    }

    @Override
    public boolean verifyPayment(String transactionId) {
        return true;
    }
}
