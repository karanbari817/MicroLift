package com.microlift.controller;

import com.microlift.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donor")
public class DonorController {

    @Autowired
    private AuthService authService;

    @GetMapping("/dashboard")
    public String donorDashboard() {
        return "Welcome to Donor Dashboard - Authorized Access";
    }
}
