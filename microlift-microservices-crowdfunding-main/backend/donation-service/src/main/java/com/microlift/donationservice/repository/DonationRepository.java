package com.microlift.donationservice.repository;

import com.microlift.donationservice.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonorId(Long donorId);

    List<Donation> findByCampaignId(Long campaignId);
}
