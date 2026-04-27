package com.prohire.controller;

import com.prohire.model.Share;
import com.prohire.repository.ShareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/share")
@CrossOrigin(origins = "*") // Allow frontend access
@SuppressWarnings("null")
public class ShareController {

    @Autowired
    private ShareRepository shareRepository;

    @PostMapping
    public ResponseEntity<Share> createShare(@RequestBody Share shareRequest) {
        Share savedShare = shareRepository.save(shareRequest);
        return ResponseEntity.ok(savedShare);
    }

    @GetMapping
    public ResponseEntity<List<Share>> getAllShares() {
        List<Share> shares = shareRepository.findAll();
        return ResponseEntity.ok(shares);
    }
}
