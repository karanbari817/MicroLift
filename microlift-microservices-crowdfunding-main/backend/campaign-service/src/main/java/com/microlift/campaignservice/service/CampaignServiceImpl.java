package com.microlift.campaignservice.service;

import com.microlift.campaignservice.dto.CampaignRequest;
import com.microlift.campaignservice.entity.Campaign;
import com.microlift.campaignservice.entity.Document;
import com.microlift.campaignservice.repository.CampaignRepository;
import com.microlift.campaignservice.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
public class CampaignServiceImpl implements CampaignService {

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private StorageService storageService;

    public Campaign createCampaign(CampaignRequest request) {
        // Use high-quality random image if no URL provided
        String imageUrl = request.getImageUrl();
        if (imageUrl == null || imageUrl.isEmpty()) {
            String thumbnailCategory = request.getCategory() != null ? request.getCategory().name().toLowerCase()
                    : "charity";
            imageUrl = "https://picsum.photos/seed/" + (thumbnailCategory + System.currentTimeMillis()) + "/800/600";
        }

        Campaign campaign = Campaign.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .goalAmount(request.getGoalAmount())
                .location(request.getLocation())
                .imageUrl(imageUrl)
                .endDate(request.getEndDate())
                .beneficiaryId(request.getBeneficiaryId())
                .status(Campaign.Status.PENDING)
                .build();

        Campaign savedCampaign = campaignRepository.save(campaign);

        if (request.getDocumentUrls() != null && !request.getDocumentUrls().isEmpty()) {
            for (String docUrl : request.getDocumentUrls()) {
                Document document = Document.builder()
                        .url(docUrl)
                        .type("VERIFICATION_DOC")
                        .status(Document.Status.PENDING)
                        .campaign(savedCampaign)
                        .build();
                documentRepository.save(document);
            }
        }

        return savedCampaign;
    }

    @Override
    public Campaign uploadDocument(Long campaignId, String documentType, MultipartFile file) {
        Campaign campaign = getCampaignById(campaignId);
        String docUrl = storageService.store(file);

        Document document = Document.builder()
                .url(docUrl)
                .type(documentType)
                .status(Document.Status.PENDING)
                .campaign(campaign)
                .build();
        documentRepository.save(document);
        return campaign;
    }

    @Override
    public Document getDocument(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));
    }

    public List<Campaign> getAllActiveCampaigns() {
        return campaignRepository.findByStatus(Campaign.Status.ACTIVE);
    }

    public List<Campaign> getCompletedCampaigns() {
        return campaignRepository.findByStatus(Campaign.Status.COMPLETED);
    }

    public List<Campaign> getCampaignsByBeneficiary(Long beneficiaryId) {
        return campaignRepository.findByBeneficiaryId(beneficiaryId);
    }

    public List<Campaign> getPendingCampaigns() {
        return campaignRepository.findByStatus(Campaign.Status.PENDING);
    }

    public Campaign getCampaignById(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campaign not found"));
    }

    @Override
    public Campaign verifyCampaign(Long id, String status) {
        Campaign campaign = getCampaignById(id);
        campaign.setStatus(Campaign.Status.valueOf(status));
        return campaignRepository.save(campaign);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void updateCampaignRaisedAmount(Long id, Double amount) {
        Campaign campaign = getCampaignById(id);
        double totalRaised = campaign.getRaisedAmount() + amount;
        campaign.setRaisedAmount(totalRaised);

        if (totalRaised >= campaign.getGoalAmount()) {
            campaign.setStatus(Campaign.Status.COMPLETED);
        }

        campaignRepository.save(campaign);
    }

    // Standardize method names for interface
    @Override
    public void deleteCampaign(Long id) {
        if (!campaignRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Campaign not found");
        }
        campaignRepository.deleteById(id);
    }

    public void updateDocumentStatus(Long id, Document.Status status) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));
        document.setStatus(status);
        documentRepository.save(document);
    }

    public org.springframework.core.io.Resource loadFileAsResource(String fileName) {
        return storageService.load(fileName);
    }

    @Override
    public void fixLegacyImages() {
        List<Campaign> campaigns = campaignRepository.findAll();
        for (Campaign c : campaigns) {
            String categoryName = c.getCategory() != null ? c.getCategory().name() : "random";
            String newUrl = "https://picsum.photos/seed/" + categoryName + c.getId() + "/800/600";
            c.setImageUrl(newUrl);
            campaignRepository.save(c);
        }
    }
}
