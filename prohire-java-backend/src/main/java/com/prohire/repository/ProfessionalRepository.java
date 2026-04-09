package com.prohire.repository;

import com.prohire.model.Professional;
import com.prohire.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProfessionalRepository extends JpaRepository<Professional, Long> {
    Optional<Professional> findByUser(User user);
    Optional<Professional> findByUserId(Long userId);
}
