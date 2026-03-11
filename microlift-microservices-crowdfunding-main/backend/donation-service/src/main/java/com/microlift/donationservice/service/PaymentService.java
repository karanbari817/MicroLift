package com.microlift.donationservice.service;

public interface PaymentService {
    String initiatePayment(Double amount);

    boolean verifyPayment(String transactionId);
}
