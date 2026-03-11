package com.microlift.campaignservice.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

@Service
public class S3StorageServiceImpl implements StorageService {

    @Override
    public String store(MultipartFile file) {
        throw new UnsupportedOperationException("S3 Storage not yet configured. Please add AWS SDK and credentials.");
    }

    @Override
    public Resource load(String filename) {
        throw new UnsupportedOperationException("S3 files should be accessed via direct URL.");
    }
}
