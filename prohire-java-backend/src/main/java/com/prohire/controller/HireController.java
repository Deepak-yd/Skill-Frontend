package com.prohire.controller;

import com.prohire.model.Hire;
import com.prohire.model.Professional;
import com.prohire.model.User;
import com.prohire.repository.HireRepository;
import com.prohire.repository.ProfessionalRepository;
import com.prohire.repository.UserRepository;
import com.prohire.repository.JobRepository;
import com.prohire.model.Job;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/hires")
@RequiredArgsConstructor
@SuppressWarnings("null")
public class HireController {

    private final HireRepository hireRepository;

    private final UserRepository userRepository;

    private final ProfessionalRepository professionalRepository;

    private final JobRepository jobRepository;

    @GetMapping
    public List<Hire> getAllHires() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        // If user is professional, show hires received. If user, show hires sent.
        if ("PROFESSIONAL".equals(user.getRole())) {
            Professional pro = professionalRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Professional not found"));
            return hireRepository.findByProfessional(pro);
        } else {
            return hireRepository.findByClientUser(user);
        }
    }

    @PostMapping
    public ResponseEntity<Hire> createHire(@RequestBody java.util.Map<String, Object> payload) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        Hire hire = new Hire();
        
        if (payload.containsKey("jobId")) {
            Long jobId = Long.valueOf(payload.get("jobId").toString());
            Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
            
            hire.setClientUser(job.getPoster());
            hire.setServiceTitle(job.getTitle());
            hire.setAmountValue(job.getBudget());
            hire.setNotes("Application for mission: " + job.getTitle());
            
            // If the applicant is a professional, link them
            Professional pro = professionalRepository.findByUser(user).orElse(null);
            if (pro != null) {
                hire.setProfessional(pro);
            }
        } else {
            // Direct hire or other manual creation
            if (payload.containsKey("professionalId")) {
                Long proId = Long.valueOf(payload.get("professionalId").toString());
                Professional pro = professionalRepository.findById(proId).orElseThrow(() -> new RuntimeException("Professional not found"));
                hire.setProfessional(pro);
            }
            hire.setClientUser(user);
            if (payload.get("serviceTitle") != null) hire.setServiceTitle(payload.get("serviceTitle").toString());
            if (payload.get("amount") != null) hire.setAmountValue(Double.valueOf(payload.get("amount").toString()));
            if (payload.get("notes") != null) hire.setNotes(payload.get("notes").toString());
        }

        if (hire.getStatus() == null) {
            hire.setStatus("PENDING");
        }
        if (hire.getProgress() == null) {
            hire.setProgress(0);
        }
        
        hireRepository.save(hire);
        return ResponseEntity.ok(hire);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hire> updateHire(@PathVariable Long id, @RequestBody Hire update) {
        Hire hire = hireRepository.findById(id).orElseThrow(() -> new RuntimeException("Hire not found"));
        if (update.getStatus() != null)
            hire.setStatus(update.getStatus());
        if (update.getAmountValue() != null)
            hire.setAmountValue(update.getAmountValue());
        if (update.getProgress() != null)
            hire.setProgress(update.getProgress());
        if (update.getNotes() != null)
            hire.setNotes(update.getNotes());
        if (update.getServiceTitle() != null)
            hire.setServiceTitle(update.getServiceTitle());

        hireRepository.save(hire);
        return ResponseEntity.ok(hire);
    }
}
