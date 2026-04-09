package com.prohire.repository;

import com.prohire.model.Hire;
import com.prohire.model.User;
import com.prohire.model.Professional;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HireRepository extends JpaRepository<Hire, Long> {
    List<Hire> findByClientUser(User clientUser);
    List<Hire> findByProfessional(Professional professional);
}
