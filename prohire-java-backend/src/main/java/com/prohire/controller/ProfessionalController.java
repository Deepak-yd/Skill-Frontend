package com.prohire.controller;

import com.prohire.model.Professional;
import com.prohire.model.Service;
import com.prohire.model.User;
import com.prohire.repository.ProfessionalRepository;
import com.prohire.repository.ServiceRepository;
import com.prohire.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/professionals")
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ProfessionalController {

    private final ProfessionalRepository professionalRepository;

    private final UserRepository userRepository;

    private final ServiceRepository serviceRepository;

    @GetMapping
    public List<Professional> getAllProfessionals() {
        return professionalRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Professional> getProfessionalById(@PathVariable Long id) {
        return professionalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<Professional> getMyProfessionalProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
<<<<<<< HEAD
        
        return professionalRepository.findByUser(user)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    // Auto-create profile if user has the role
                    if ("PROFESSIONAL".equals(user.getRole())) {
                        Professional pro = new Professional();
                        pro.setUser(user);
                        pro.setTitle("Expert Node");
                        pro.setRateValue(50.0);
                        pro.setRating(5.0);
                        pro.setReviewCount(0);
                        professionalRepository.save(pro);
                        return ResponseEntity.ok(pro);
                    }
                    return ResponseEntity.notFound().build();
                });
=======
        return professionalRepository.findByUser(user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
>>>>>>> bad2c7d74b851a71b111b31ea48e4b957f7b22bb
    }

    @PutMapping("/{id}")
    public ResponseEntity<Professional> updateProfessional(@PathVariable Long id, @RequestBody Professional update) {
        Professional pro = professionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professional not found"));
        if (update.getTitle() != null)
            pro.setTitle(update.getTitle());
        if (update.getRateValue() != null)
            pro.setRateValue(update.getRateValue());
        if (update.getSkills() != null)
            pro.setSkills(update.getSkills());
        if (update.getCategory() != null)
            pro.setCategory(update.getCategory());

        professionalRepository.save(pro);
        return ResponseEntity.ok(pro);
    }

    // SERVICES NESTED UNDER PROFESSIONALS (as per api.js)
    @GetMapping("/{id}/services")
    public List<Service> getServices(@PathVariable Long id) {
        return serviceRepository.findByProfessionalId(id);
    }

    @PostMapping("/{id}/services")
    public ResponseEntity<Service> createService(@PathVariable Long id, @RequestBody Service service) {
        Professional pro = professionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professional not found"));
        service.setProfessional(pro);
        serviceRepository.save(service);
        return ResponseEntity.ok(service);
    }

    @PutMapping("/{id}/services/{serviceId}")
    public ResponseEntity<Service> updateService(@PathVariable Long id, @PathVariable Long serviceId,
            @RequestBody Service update) {
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        if (update.getName() != null)
            service.setName(update.getName());
        if (update.getDescription() != null)
            service.setDescription(update.getDescription());
        if (update.getPrice() != null)
            service.setPrice(update.getPrice());
        if (update.getPriceLabel() != null)
            service.setPriceLabel(update.getPriceLabel());
<<<<<<< HEAD
        if (update.getDuration() != null)
            service.setDuration(update.getDuration());
=======
>>>>>>> bad2c7d74b851a71b111b31ea48e4b957f7b22bb

        serviceRepository.save(service);
        return ResponseEntity.ok(service);
    }

    @DeleteMapping("/{id}/services/{serviceId}")
    public ResponseEntity<?> deleteService(@PathVariable Long id, @PathVariable Long serviceId) {
        serviceRepository.deleteById(serviceId);
        return ResponseEntity.ok().build();
    }
}
