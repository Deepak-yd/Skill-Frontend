package com.prohire.controller;

import com.prohire.model.Connection;
import com.prohire.model.User;
import com.prohire.repository.ConnectionRepository;
import com.prohire.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/connections")
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ConnectionController {

    private final ConnectionRepository connectionRepository;

    private final UserRepository userRepository;

    @GetMapping("/sent")
    public List<Connection> getSentConnections() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return connectionRepository.findBySender(user);
    }

    @GetMapping("/incoming")
    public List<Connection> getIncomingConnections() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return connectionRepository.findByReceiver(user);
    }

    @GetMapping("/friends")
    public List<Connection> getFriends() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return connectionRepository.findBySenderOrReceiverAndStatus(user, user, "ACCEPTED");
    }

    @PostMapping
    public ResponseEntity<?> sendRequest(@RequestBody Map<String, String> payload) {
        String receiverEmail = payload.get("email");
        String senderEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findByEmail(receiverEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Connection conn = Connection.builder()
                .sender(sender)
                .receiver(receiver)
                .status("PENDING")
                .build();

        connectionRepository.save(conn);
        return ResponseEntity.ok(conn);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptRequest(@PathVariable Long id) {
        Connection conn = connectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
        conn.setStatus("ACCEPTED");
        connectionRepository.save(conn);
        return ResponseEntity.ok(conn);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        Connection conn = connectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
        conn.setStatus("REJECTED");
        connectionRepository.save(conn);
        return ResponseEntity.ok(conn);
    }
}
