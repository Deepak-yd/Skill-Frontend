package com.prohire.controller;

import com.prohire.model.PlatformSetting;
import com.prohire.repository.PlatformSettingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
@SuppressWarnings("null")
public class PlatformSettingController {

    private final PlatformSettingRepository settingRepository;

    @GetMapping
    public List<PlatformSetting> getSettings() {
        return settingRepository.findAll();
    }

    @PutMapping
    public ResponseEntity<?> updateSettings(@RequestBody List<PlatformSetting> settings) {
        settingRepository.saveAll(settings);
        return ResponseEntity.ok().build();
    }
}
