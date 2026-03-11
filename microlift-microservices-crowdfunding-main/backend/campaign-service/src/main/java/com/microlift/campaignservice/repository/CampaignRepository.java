package com.microlift.campaignservice.repository;

import com.microlift.campaignservice.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByBeneficiaryId(Long beneficiaryId);

    List<Campaign> findByStatus(Campaign.Status status);
}
