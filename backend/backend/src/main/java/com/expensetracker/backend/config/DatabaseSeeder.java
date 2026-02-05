package com.expensetracker.backend.config;

import com.expensetracker.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public DatabaseSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Wait... Warming up database connection...");
        try {
            // Perform a lightweight operation to trigger connection initialization
            long count = userRepository.count();
            System.out.println("Database warmed up successfully. User count: " + count);
        } catch (Exception e) {
            System.err.println("Database warmup failed: " + e.getMessage());
            // We don't throw exception here to allow app to start even if DB is temporarily down,
            // though it will likely fail on requests later if still down.
        }
    }
}
