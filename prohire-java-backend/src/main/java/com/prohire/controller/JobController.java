package com.prohire.controller;

import com.prohire.model.Job;
import com.prohire.model.User;
import com.prohire.repository.JobRepository;
import com.prohire.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
@SuppressWarnings("null")
public class JobController {

    private final JobRepository jobRepository;

    private final UserRepository userRepository;

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @GetMapping("/professional/{id}")
    public List<Job> getJobsByProfessional(@PathVariable Long id) {
        // This might need filter based on skills or simply some logic
        return jobRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        job.setPoster(user);
        job.setStatus("OPEN");
        jobRepository.save(job);
        return ResponseEntity.ok(job);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job update) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
        if (update.getTitle() != null)
            job.setTitle(update.getTitle());
        if (update.getDescription() != null)
            job.setDescription(update.getDescription());
        if (update.getBudget() != null)
            job.setBudget(update.getBudget());
        if (update.getStatus() != null)
            job.setStatus(update.getStatus());

        jobRepository.save(job);
        return ResponseEntity.ok(job);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        jobRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
