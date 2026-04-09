package com.prohire.repository;

import com.prohire.model.Job;
import com.prohire.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByPoster(User poster);
}
