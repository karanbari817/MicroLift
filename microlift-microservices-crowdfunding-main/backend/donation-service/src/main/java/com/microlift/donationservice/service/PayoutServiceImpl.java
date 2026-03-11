package com.microlift.donationservice.service;

import com.microlift.donationservice.entity.Payout;
import com.microlift.donationservice.repository.PayoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PayoutServiceImpl implements PayoutService {

    @Autowired
    private PayoutRepository payoutRepository;

    @Override
    @Transactional
    public Payout createPayoutRequest(Long beneficiaryId, Double amount) {
        Payout payout = Payout.builder()
                .beneficiaryId(beneficiaryId)
                .amount(amount)
                .status(Payout.Status.PENDING)
                .build();
        return payoutRepository.save(payout);
    }

    @Override
    @Transactional
    public Payout approvePayout(Long payoutId) {
        Payout payout = payoutRepository.findById(payoutId)
                .orElseThrow(() -> new RuntimeException("Payout not found"));

        if (payout.getStatus() != Payout.Status.PENDING) {
            throw new RuntimeException("Payout is not in PENDING state");
        }

        // Simulate Bank Processing
        payout.setStatus(Payout.Status.PROCESSED);
        payout.setTransactionReference("payout_" + UUID.randomUUID().toString());
        payout.setProcessedAt(LocalDateTime.now());

        return payoutRepository.save(payout);
    }

    @Override
    public List<Payout> getPayoutsByBeneficiary(Long beneficiaryId) {
        return payoutRepository.findByBeneficiaryId(beneficiaryId);
    }

    @Override
    public List<Payout> getAllPayouts() {
        return payoutRepository.findAll();
    }
}
