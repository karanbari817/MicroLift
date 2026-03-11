package com.microlift.donationservice.service;

import com.microlift.donationservice.dto.DonationRequest;
import com.microlift.donationservice.entity.Donation;
import com.microlift.donationservice.repository.DonationRepository;
import com.microlift.donationservice.client.CampaignClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class DonationServiceImpl implements DonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private CampaignClient campaignClient;

    @Autowired
    private PaymentService paymentService;

    @Override
    public String createPaymentIntent(Double amount) {
        return paymentService.initiatePayment(amount);
    }

    @Override
    public Donation verifyDonation(String paymentId, String orderId, String signature, DonationRequest request) {
        boolean isVerified = paymentService.verifyPayment(paymentId);

        if (!isVerified) {
            throw new RuntimeException("Payment verification failed");
        }

        Donation donation = Donation.builder()
                .amount(request.getAmount())
                .donorId(request.getDonorId())
                .campaignId(request.getCampaignId())
                .isAnonymous(request.isAnonymous())
                .paymentMethod("MOCK_PAYMENT")
                .transactionId(paymentId)
                .status(Donation.Status.SUCCESS)
                .donatedAt(LocalDateTime.now())
                .build();

        Donation savedDonation = donationRepository.save(donation);

        // Update Funds
        campaignClient.addFunds(request.getCampaignId(), request.getAmount());

        return savedDonation;
    }

    @Override
    public Donation createDonation(DonationRequest request) {
        Donation donation = Donation.builder()
                .amount(request.getAmount())
                .donorId(request.getDonorId())
                .campaignId(request.getCampaignId())
                .isAnonymous(request.isAnonymous())
                .paymentMethod("MOCK_PAYMENT")
                .transactionId("direct_" + java.util.UUID.randomUUID().toString())
                .status(Donation.Status.SUCCESS)
                .donatedAt(LocalDateTime.now())
                .build();

        campaignClient.addFunds(request.getCampaignId(), request.getAmount());
        return donationRepository.save(donation);
    }

    @Override
    public List<Donation> getDonationsByDonor(Long donorId) {
        return donationRepository.findByDonorId(donorId);
    }

    @Override
    public List<Donation> getDonationsByCampaign(Long campaignId) {
        return donationRepository.findByCampaignId(campaignId);
    }
}
