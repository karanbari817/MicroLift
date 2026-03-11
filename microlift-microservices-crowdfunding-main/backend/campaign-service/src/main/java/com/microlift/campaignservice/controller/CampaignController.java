package com.microlift.campaignservice.controller;

import com.microlift.campaignservice.dto.CampaignRequest;
import com.microlift.campaignservice.entity.Campaign;
import com.microlift.campaignservice.entity.Document;
import com.microlift.campaignservice.service.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    @Autowired
    private CampaignService campaignService;

    @PostMapping
    public Campaign createCampaign(@RequestBody CampaignRequest request) {
        return campaignService.createCampaign(request);
    }

    @GetMapping("/active")
    public List<Campaign> getAllActiveCampaigns() {
        return campaignService.getAllActiveCampaigns();
    }

    @GetMapping("/{id}")
    public Campaign getCampaignById(@PathVariable Long id) {
        return campaignService.getCampaignById(id);
    }

    @GetMapping("/beneficiary/{beneficiaryId}")
    public List<Campaign> getCampaignsByBeneficiary(@PathVariable Long beneficiaryId) {
        return campaignService.getCampaignsByBeneficiary(beneficiaryId);
    }

    @GetMapping("/pending")
    public List<Campaign> getPendingCampaigns() {
        return campaignService.getPendingCampaigns();
    }

    @GetMapping("/completed")
    public List<Campaign> getCompletedCampaigns() {
        return campaignService.getCompletedCampaigns();
    }

    @PostMapping("/{id}/verify")
    public Campaign verifyCampaign(@PathVariable Long id, @RequestParam String status) {
        return campaignService.verifyCampaign(id, status);
    }

    @PutMapping("/{id}/add-funds")
    public void addFunds(@PathVariable Long id, @RequestParam Double amount) {
        campaignService.updateCampaignRaisedAmount(id, amount);
    }

    @DeleteMapping("/{id}")
    public void deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
    }

    @PostMapping("/{id}/upload-document")
    public Campaign uploadDocument(
            @PathVariable Long id,
            @RequestParam String documentType,
            @RequestParam MultipartFile file) {
        return campaignService.uploadDocument(id, documentType, file);
    }

    @GetMapping("/documents/{documentId}")
    public Document getDocument(@PathVariable Long documentId) {
        return campaignService.getDocument(documentId);
    }

    @GetMapping("/all")
    public List<Campaign> getAllCampaigns() {
        return campaignService.getAllActiveCampaigns(); // Default to active for now or implement listAll
    }

    @PostMapping("/fix-legacy-images")
    public void fixLegacyImages() {
        campaignService.fixLegacyImages();
    }
}
