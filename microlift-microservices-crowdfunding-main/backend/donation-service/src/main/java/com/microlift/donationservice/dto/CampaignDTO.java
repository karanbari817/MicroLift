package com.microlift.donationservice.dto;

import lombok.Data;

@Data
public class CampaignDTO {
    private Long id;
    private Double goalAmount;
    private Double raisedAmount;
}
