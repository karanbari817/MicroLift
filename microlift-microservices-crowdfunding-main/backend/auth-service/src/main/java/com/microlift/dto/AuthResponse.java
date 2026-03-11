package com.microlift.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Long id;
    private String token;
    private String email;
    private String fullName;
    private String role;
    private boolean isVerified;
    private String kycStatus; // PENDING, VERIFIED, REJECTED
}
