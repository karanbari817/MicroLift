package com.microlift.donationservice.repository;

import com.microlift.donationservice.entity.Payout;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PayoutRepository extends JpaRepository<Payout, Long> {
    List<Payout> findByBeneficiaryId(Long beneficiaryId);

    List<Payout> findByStatus(Payout.Status status);
}
