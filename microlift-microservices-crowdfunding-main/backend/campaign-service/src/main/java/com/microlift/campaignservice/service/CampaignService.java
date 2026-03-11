package com.microlift.campaignservice.service;

import com.microlift.campaignservice.dto.CampaignRequest;
import com.microlift.campaignservice.entity.Campaign;
import com.microlift.campaignservice.entity.Document;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface CampaignService {
    Campaign createCampaign(CampaignRequest request);

    List<Campaign> getAllActiveCampaigns();

    Campaign getCampaignById(Long id);

    List<Campaign> getCampaignsByBeneficiary(Long beneficiaryId);

    List<Campaign> getPendingCampaigns();

    List<Campaign> getCompletedCampaigns();

    Campaign verifyCampaign(Long id, String status);

    void deleteCampaign(Long id);

    Campaign uploadDocument(Long campaignId, String documentType, MultipartFile file);

    Document getDocument(Long documentId);

    void updateCampaignRaisedAmount(Long campaignId, Double amount);

    void fixLegacyImages();
}
