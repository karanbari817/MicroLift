package com.microlift.mediaservice.service;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

@Service
@Profile("prod")
public class S3StorageServiceImpl implements StorageService {

    @Override
    public String store(MultipartFile file) {
        throw new UnsupportedOperationException("S3 Storage not yet configured.");
    }

    @Override
    public Resource load(String filename) {
        throw new UnsupportedOperationException("S3 files should be accessed via direct URL.");
    }
}
