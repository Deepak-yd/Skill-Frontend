package com.prohire.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hires")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_user_id", nullable = false)
    private User clientUser;

    @ManyToOne
    @JoinColumn(name = "professional_id", nullable = false)
    private Professional professional;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;

    private Double amountValue;
    
<<<<<<< HEAD
    private String serviceTitle;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    private Integer progress;
    
=======
>>>>>>> bad2c7d74b851a71b111b31ea48e4b957f7b22bb
    private String status; // PENDING, ONGOING, COMPLETED, CANCELLED

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
