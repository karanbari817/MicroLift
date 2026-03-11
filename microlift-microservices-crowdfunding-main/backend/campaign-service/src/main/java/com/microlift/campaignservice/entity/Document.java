package com.microlift.campaignservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;
    private String type; // e.g., "ID_PROOF", "MEDICAL_REPORT"

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    @ToString.Exclude
    private Campaign campaign;

    public enum Status {
        PENDING, VERIFIED, REJECTED
    }
}
