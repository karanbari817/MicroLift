package com.microlift.campaignservice.dto;

import com.microlift.campaignservice.entity.Campaign;
import com.microlift.campaignservice.entity.Campaign.Category;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CampaignRequest {
    private String title;
    private String description;
    private Campaign.Category category;
    private Double goalAmount;
    private String location;
    private String imageUrl;
    private LocalDate endDate;
    private Long beneficiaryId; // For internal use or if passed explicitly
    private java.util.List<String> documentUrls;
}
