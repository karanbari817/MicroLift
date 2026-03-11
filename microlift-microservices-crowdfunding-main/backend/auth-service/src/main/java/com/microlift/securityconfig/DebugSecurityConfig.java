package com.microlift.securityconfig;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DebugSecurityConfig {

    @Bean
    CommandLineRunner logSecurityConfig() {
        return args -> {
            System.out.println("=".repeat(80));
            System.out.println("SECURITY CONFIGURATION LOADED");
            System.out.println("Upload endpoint should be PUBLIC (permitAll)");
            System.out.println("Check SecurityConfig.java for: /api/auth/upload-kyc in permitAll()");
            System.out.println("=".repeat(80));
        };
    }
}
