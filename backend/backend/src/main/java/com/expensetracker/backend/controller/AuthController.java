package com.expensetracker.backend.controller;

import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepo, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        if (userRepo.findByEmail(user.getEmail()) != null)
            return "User already exists";

        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);
        return "Signup successful";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User db = userRepo.findByEmail(user.getEmail());

        if (db == null) return "Invalid email";
        if (!encoder.matches(user.getPassword(), db.getPassword())) return "Invalid password";

        return jwtUtil.generateToken(db.getEmail());
    }
}
