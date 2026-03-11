package com.microlift.donationservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "campaign-service")
public interface CampaignClient {

    @PutMapping("/api/campaigns/{id}/add-funds")
    void addFunds(@PathVariable("id") Long id, @RequestParam("amount") Double amount);

    @org.springframework.web.bind.annotation.GetMapping("/api/campaigns/{id}")
    com.microlift.donationservice.dto.CampaignDTO getCampaignById(@PathVariable("id") Long id);
}
