package com.expensetracker.backend.controller;

import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

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
    public ResponseEntity<?> signup(@RequestBody User user) {
        
        // Validate input
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username cannot be empty");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email cannot be empty");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password cannot be empty");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User already exists with this email");
        }

        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            System.out.println("User registered successfully: " + user.getEmail());
            return ResponseEntity.ok("Signup successful");
        } catch (Exception e) {
            System.err.println("Signup error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during signup: " + e.getMessage());
        }
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email cannot be empty");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password cannot be empty");
        }

        try {
            User dbUser = userRepository.findByEmail(user.getEmail())
                    .orElse(null);

            if (dbUser == null) {
                System.out.println("Login failed: User not found with email: " + user.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not registered. Please sign up first.");
            }

            if (!passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
                System.out.println("Login failed: Invalid password for user: " + user.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password. Please try again.");
            }

            String token = jwtUtil.generateToken(dbUser.getEmail());
            System.out.println("Login successful for user: " + user.getEmail());
            
            // Return token and username
            // If username is null or empty, use email as fallback
            String username = dbUser.getUsername();
            if (username == null || username.trim().isEmpty()) {
                username = dbUser.getEmail().split("@")[0]; // Use email prefix as username
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during login: " + e.getMessage());
        }
    }
}