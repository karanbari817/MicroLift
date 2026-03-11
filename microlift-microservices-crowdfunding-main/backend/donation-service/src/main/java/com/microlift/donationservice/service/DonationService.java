package com.microlift.donationservice.service;

import com.microlift.donationservice.dto.DonationRequest;
import com.microlift.donationservice.entity.Donation;
import java.util.List;

public interface DonationService {
    String createPaymentIntent(Double amount);

    Donation verifyDonation(String paymentId, String orderId, String signature, DonationRequest request);

    Donation createDonation(DonationRequest request);

    List<Donation> getDonationsByDonor(Long donorId);

    List<Donation> getDonationsByCampaign(Long campaignId);
}
