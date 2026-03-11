package com.microlift.service;

import com.microlift.securityconfig.JwtService;
import com.microlift.dto.*;
import com.microlift.entity.User;
import com.microlift.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@org.springframework.transaction.annotation.Transactional
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override

    public AuthResponse register(RegisterRequest request) {
        var user = User.builder().fullName(request.getFullName()).email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())).phoneNumber(request.getPhoneNumber())
                .role(request.getRole()).build();
        repository.save(user);
        return authenticate(new LoginRequest(request.getEmail(), request.getPassword()));
    }

    public AuthResponse authenticate(LoginRequest request) {
        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder().id(user.getId()).token(jwtToken).email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name()).isVerified(user.isVerified()).kycStatus(user.getKycStatus()).build();
    }

    public void uploadKyc(String email, org.springframework.web.multipart.MultipartFile file) {
        var user = repository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        // Simulating file upload - in prod use S3/File storage. storing filename for
        // now.
        String fileName = "uploads/" + file.getOriginalFilename(); // Simplified
        try {
            // Ensure uploads directory exists if using local storage
            java.nio.file.Path uploadPath = java.nio.file.Paths.get("uploads");
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }
            java.nio.file.Files.copy(file.getInputStream(), uploadPath.resolve(file.getOriginalFilename()),
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
        user.setKycDocumentUrl(fileName);
        user.setKycStatus("PENDING");
        repository.save(user);
    }

    public void updateKycUrl(String email, String kycUrl) {
        System.out.println("Updating KYC for email: " + email);
        var user = repository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setKycDocumentUrl(kycUrl);
        user.setKycStatus("PENDING");
        repository.save(user);
        System.out.println("KYC updated to PENDING for user: " + user.getId());
    }

    public void verifyUser(Long userId, String status) {
        if (userId == null)
            throw new IllegalArgumentException("User ID cannot be null");
        var user = repository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setKycStatus(status);
        user.setVerified("VERIFIED".equals(status));
        repository.save(user);
    }

    public User getUserById(Long userId) {
        return repository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public org.springframework.core.io.Resource loadKycFile(String fileName) {
        try {
            java.nio.file.Path filePath = java.nio.file.Paths.get("uploads").resolve(fileName).normalize();
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(
                    filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (java.net.MalformedURLException e) {
            throw new RuntimeException("File not found " + fileName, e);
        }
    }

    public java.util.List<User> getAllBeneficiaries() {
        return repository.findAll().stream()
                .filter(user -> user.getRole() == User.Role.BENEFICIARY)
                .collect(java.util.stream.Collectors.toList());
    }

    public void deleteUser(Long userId) {
        if (!repository.existsById(userId)) {
            throw new UsernameNotFoundException("User not found with id: " + userId);
        }
        repository.deleteById(userId);
    }
}
