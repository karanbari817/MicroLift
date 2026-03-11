package com.microlift.donationservice.dto;

import lombok.Data;

@Data
public class DonationRequest {
    private Double amount;
    private Long donorId;
    private Long campaignId;
    private boolean isAnonymous;
    private String paymentMethod;
}
