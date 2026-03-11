package com.microlift.campaignservice.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String store(MultipartFile file);

    org.springframework.core.io.Resource load(String filename);
}
