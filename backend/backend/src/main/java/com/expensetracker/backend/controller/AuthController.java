package com.expensetracker.backend.controller;

import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ---------------- SIGNUP ----------------
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        
        // Validate input
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return "Email cannot be empty";
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return "Password cannot be empty";
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "User already exists with this email";
        }

        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            System.out.println("User registered successfully: " + user.getEmail());
            return "Signup successful";
        } catch (Exception e) {
            System.err.println("Signup error: " + e.getMessage());
            return "Error during signup: " + e.getMessage();
        }
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public String login(@RequestBody User user) {

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return "Email cannot be empty";
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return "Password cannot be empty";
        }

        try {
            User dbUser = userRepository.findByEmail(user.getEmail())
                    .orElse(null);

            if (dbUser == null) {
                System.out.println("Login failed: User not found with email: " + user.getEmail());
                return "Invalid email or password";
            }

            if (!passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
                System.out.println("Login failed: Invalid password for user: " + user.getEmail());
                return "Invalid email or password";
            }

            String token = jwtUtil.generateToken(dbUser.getEmail());
            System.out.println("Login successful for user: " + user.getEmail());
            return token;
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            return "Error during login: " + e.getMessage();
        }
    }
}