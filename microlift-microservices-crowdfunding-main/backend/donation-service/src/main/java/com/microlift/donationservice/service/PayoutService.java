package com.microlift.donationservice.service;

import com.microlift.donationservice.entity.Payout;
import java.util.List;

public interface PayoutService {
    Payout createPayoutRequest(Long beneficiaryId, Double amount);

    Payout approvePayout(Long payoutId);

    List<Payout> getPayoutsByBeneficiary(Long beneficiaryId);

    List<Payout> getAllPayouts();
}
