package com.microlift.donationservice.controller;

import com.microlift.donationservice.dto.DonationRequest;
import com.microlift.donationservice.entity.Donation;
import com.microlift.donationservice.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @PostMapping("/create-payment-intent")
    public Map<String, Object> createPaymentIntent(@RequestBody Map<String, Object> data) {
        Double amount = Double.parseDouble(data.get("amount").toString());
        return Collections.singletonMap("clientSecret", donationService.createPaymentIntent(amount));
    }

    @PostMapping("/verify")
    public Donation verifyDonation(@RequestBody Map<String, Object> data) {
        DonationRequest request = new DonationRequest();
        request.setAmount(Double.parseDouble(data.get("amount").toString()));
        request.setCampaignId(Long.parseLong(data.get("campaignId").toString()));
        request.setDonorId(Long.parseLong(data.get("donorId").toString()));
        request.setAnonymous(Boolean.parseBoolean(data.get("isAnonymous").toString()));

        String paymentId = (String) data.getOrDefault("paymentId", "txn_mock_unknown");
        return donationService.verifyDonation(paymentId, null, null, request);
    }

    @PostMapping
    public Donation createDonation(@RequestBody DonationRequest request) {
        return donationService.createDonation(request);
    }

    @GetMapping("/donor/{donorId}")
    public List<Donation> getDonationsByDonor(@PathVariable Long donorId) {
        return donationService.getDonationsByDonor(donorId);
    }

    @GetMapping("/campaign/{campaignId}")
    public List<Donation> getDonationsByCampaign(@PathVariable Long campaignId) {
        return donationService.getDonationsByCampaign(campaignId);
    }
}
