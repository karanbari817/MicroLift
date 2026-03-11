package com.microlift.controller;

import com.microlift.dto.AuthResponse;
import com.microlift.dto.LoginRequest;
import com.microlift.dto.RegisterRequest;
import com.microlift.entity.User;
import com.microlift.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse authenticate(@RequestBody LoginRequest request) {
        return authService.authenticate(request);
    }

    @PostMapping(value = "/upload-kyc", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void uploadKyc(@RequestParam("email") String email,
            @RequestParam("file") MultipartFile file) {
        authService.uploadKyc(email, file);
    }

    @PostMapping(value = "/upload-kyc-public", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void uploadKycPublic(
            @RequestPart("email") String email,
            @RequestPart("file") MultipartFile file) {
        authService.uploadKyc(email, file);
    }

    @PostMapping("/update-kyc")
    public void updateKyc(@RequestBody com.microlift.dto.KycUpdateRequest request) {
        authService.updateKycUrl(request.getEmail(), request.getKycUrl());
    }

    @PostMapping("/verify-user/{userId}")
    public void verifyUser(@PathVariable Long userId,
            @RequestParam String status) {
        authService.verifyUser(userId, status);
    }

    @GetMapping("/users/{userId}")
    public User getUser(@PathVariable Long userId) {
        return authService.getUserById(userId);
    }

    @GetMapping("/kyc-files/{fileName:.+}")
    public ResponseEntity<Resource> getKycFile(@PathVariable String fileName) {
        Resource file = authService.loadKycFile(fileName);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }
}
