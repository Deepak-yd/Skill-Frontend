package com.prohire.controller;

import com.prohire.config.JwtUtils;
import com.prohire.dto.AuthRequest;
import com.prohire.dto.AuthResponse;
import com.prohire.model.Profile;
import com.prohire.model.User;
import com.prohire.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final UserDetailsService userDetailsService;

    private final JwtUtils jwtUtils;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
        final String jwt = jwtUtils.generateToken(userDetails);

        User user = userRepository.findByEmail(authRequest.getEmail()).orElse(null);

        return ResponseEntity.ok(new AuthResponse(jwt, user));
    }

    @SuppressWarnings("null")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest authRequest) {
        if (userRepository.findByEmail(authRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = User.builder()
                .email(authRequest.getEmail())
                .password(passwordEncoder.encode(authRequest.getPassword()))
                .fullName(authRequest.getFullName())
                .role(authRequest.getRole() != null ? authRequest.getRole().toUpperCase() : "USER")
                .isEmailVerified(false)
                .build();

        // Create empty profile
        Profile profile = Profile.builder().user(user).build();
        user.setProfile(profile);

        userRepository.save(user);

        final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        final String jwt = jwtUtils.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwt, user));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        return ResponseEntity.ok(user);
    }

    @SuppressWarnings("null")
    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@RequestBody User userUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (userUpdate.getFullName() != null)
            user.setFullName(userUpdate.getFullName());
        if (userUpdate.getProfileImage() != null)
            user.setProfileImage(userUpdate.getProfileImage());

        if (userUpdate.getProfile() != null && user.getProfile() != null) {
            Profile p = user.getProfile();
            Profile up = userUpdate.getProfile();
            if (up.getPhone() != null)
                p.setPhone(up.getPhone());
            if (up.getLocation() != null)
                p.setLocation(up.getLocation());
            if (up.getCompany() != null)
                p.setCompany(up.getCompany());
            if (up.getWebsite() != null)
                p.setWebsite(up.getWebsite());
            if (up.getBio() != null)
                p.setBio(up.getBio());
            if (up.getAvatar() != null)
                p.setAvatar(up.getAvatar());
            if (up.getLinkedIn() != null)
                p.setLinkedIn(up.getLinkedIn());
            if (up.getGithub() != null)
                p.setGithub(up.getGithub());
            if (up.getTwitter() != null)
                p.setTwitter(up.getTwitter());
            if (up.getPortfolio() != null)
                p.setPortfolio(up.getPortfolio());
        }

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
