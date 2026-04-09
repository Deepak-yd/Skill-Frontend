package com.prohire.controller;

import com.prohire.model.Message;
import com.prohire.model.User;
import com.prohire.repository.MessageRepository;
import com.prohire.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
@SuppressWarnings("null")
public class MessageController {

    private final MessageRepository messageRepository;

    private final UserRepository userRepository;

    @GetMapping("/{userId}")
    public List<Message> getMessagesWithUser(@PathVariable Long userId) {
        String myEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User me = userRepository.findByEmail(myEmail).orElseThrow(() -> new RuntimeException("Current user not found"));
        User other = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        return messageRepository.findBySenderAndReceiverOrReceiverAndSenderOrderByCreatedAtAsc(me, other, me, other);
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Map<String, Object> payload) {
        String myEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User me = userRepository.findByEmail(myEmail).orElseThrow(() -> new RuntimeException("Current user not found"));

        Long receiverId = Long.valueOf(payload.get("receiverId").toString());
        String content = payload.get("content").toString();

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = Message.builder()
                .sender(me)
                .receiver(receiver)
                .content(content)
                .isRead(false)
                .build();

        messageRepository.save(message);
        return ResponseEntity.ok(message);
    }
}
