package com.prohire.controller;

import com.prohire.model.Hire;
import com.prohire.model.Professional;
import com.prohire.model.User;
import com.prohire.repository.HireRepository;
import com.prohire.repository.ProfessionalRepository;
import com.prohire.repository.UserRepository;
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
    public ResponseEntity<Hire> createHire(@RequestBody Hire hire) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        hire.setClientUser(user);
        hire.setStatus("PENDING");
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

        hireRepository.save(hire);
        return ResponseEntity.ok(hire);
    }
}
