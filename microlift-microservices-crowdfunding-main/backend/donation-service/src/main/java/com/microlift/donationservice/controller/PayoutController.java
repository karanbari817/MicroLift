package com.microlift.donationservice.controller;

import com.microlift.donationservice.entity.Payout;
import com.microlift.donationservice.service.PayoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payouts")
public class PayoutController {

    @Autowired
    private PayoutService payoutService;

    @PostMapping("/request")
    public Payout requestPayout(@RequestParam Long beneficiaryId, @RequestParam Double amount) {
        return payoutService.createPayoutRequest(beneficiaryId, amount);
    }

    @PutMapping("/{id}/approve")
    public Payout approvePayout(@PathVariable Long id) {
        return payoutService.approvePayout(id);
    }

    @GetMapping("/beneficiary/{beneficiaryId}")
    public List<Payout> getPayoutsByBeneficiary(@PathVariable Long beneficiaryId) {
        return payoutService.getPayoutsByBeneficiary(beneficiaryId);
    }

    @GetMapping
    public List<Payout> getAllPayouts() {
        return payoutService.getAllPayouts();
    }
}
