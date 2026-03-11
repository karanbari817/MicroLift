package com.microlift.config;

import com.microlift.entity.User;
import com.microlift.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                User admin = userRepository.findByEmail("admin@microlift.com")
                                .orElse(User.builder()
                                                .email("admin@microlift.com")
                                                .build());

                admin.setFullName("Super Admin");
                admin.setPassword(passwordEncoder.encode("admin")); // Always reset password
                admin.setRole(User.Role.ADMIN);
                admin.setPhoneNumber("0000000000");
                admin.setVerified(true);
                admin.setKycStatus("VERIFIED");

                userRepository.save(admin);
                System.out.println("DEBUG: Admin user ensured with email: admin@microlift.com and password: admin");

                // User requested admin credentials
                User userAdmin = userRepository.findByEmail("admin@gmail.com")
                                .orElse(User.builder()
                                                .email("admin@gmail.com")
                                                .build());

                userAdmin.setFullName("Admin");
                userAdmin.setPassword(passwordEncoder.encode("admin123"));
                userAdmin.setRole(User.Role.ADMIN);
                userAdmin.setPhoneNumber("0000000000");
                userAdmin.setVerified(true);
                userAdmin.setKycStatus("VERIFIED");

                userAdmin.setKycStatus("VERIFIED");

                userRepository.save(userAdmin);
                System.out.println("DEBUG: User requested admin ensured: admin@gmail.com / admin123");

                // Ensure a Donor user exists for testing
                User donor = userRepository.findByEmail("donor@microlift.com")
                                .orElse(User.builder()
                                                .email("donor@microlift.com")
                                                .build());

                donor.setFullName("Donor Test");
                donor.setPassword(passwordEncoder.encode("donor123"));
                donor.setRole(User.Role.DONOR);
                donor.setPhoneNumber("9876543210");
                donor.setVerified(true);
                donor.setKycStatus("VERIFIED");

                userRepository.save(donor);
                System.out.println("DEBUG: Donor user ensured: donor@microlift.com / donor123");
        }
}
