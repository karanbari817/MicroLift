package com.microlift.service;

import com.microlift.dto.*;
import com.microlift.entity.User;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse authenticate(LoginRequest request);

    void uploadKyc(String email, MultipartFile file);

    void updateKycUrl(String email, String kycUrl);

    void verifyUser(Long userId, String status);

    User getUserById(Long userId);

    Resource loadKycFile(String fileName);

    List<User> getAllBeneficiaries();

    void deleteUser(Long userId);
}
