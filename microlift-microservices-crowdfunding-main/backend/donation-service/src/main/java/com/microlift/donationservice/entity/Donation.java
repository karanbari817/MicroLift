package com.microlift.donationservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double amount;
    private Long donorId; // Decoupled from User
    private Long campaignId; // Decoupled from Campaign
    private boolean isAnonymous;
    private String transactionId;
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime donatedAt;

    @PrePersist
    protected void onCreate() {
        donatedAt = LocalDateTime.now();
    }

    public enum Status {
        PENDING,
        SUCCESS,
        FAILED
    }
}
