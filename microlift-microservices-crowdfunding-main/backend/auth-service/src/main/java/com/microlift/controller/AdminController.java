package com.microlift.controller;

import com.microlift.entity.User;
import com.microlift.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AuthService authService;

    @GetMapping("/beneficiaries")
    public List<User> getBeneficiaries() {
        return authService.getAllBeneficiaries();
    }

    @DeleteMapping("/users/{userId}")
    public void deleteUser(@PathVariable Long userId) {
        authService.deleteUser(userId);
    }
}
