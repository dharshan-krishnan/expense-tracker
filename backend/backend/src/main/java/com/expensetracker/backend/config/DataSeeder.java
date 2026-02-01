package com.expensetracker.backend.config;

import com.expensetracker.backend.entity.Category;
import com.expensetracker.backend.entity.PaymentAccount;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.CategoryRepository;
import com.expensetracker.backend.repository.PaymentAccountRepository;
import com.expensetracker.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepo;
    private final UserRepository userRepo;
    private final PaymentAccountRepository paymentAccountRepo;

    private static final List<String> DEFAULT_CATEGORIES = List.of(
            "Food", "Transport", "Groceries", "Entertainment", "Utilities",
            "Healthcare", "Shopping", "Others"
    );

    public DataSeeder(CategoryRepository categoryRepo, UserRepository userRepo,
                      PaymentAccountRepository paymentAccountRepo) {
        this.categoryRepo = categoryRepo;
        this.userRepo = userRepo;
        this.paymentAccountRepo = paymentAccountRepo;
    }

    @Override
    public void run(String... args) {
        // Seed default categories
        for (String name : DEFAULT_CATEGORIES) {
            if (!categoryRepo.existsByNameIgnoreCaseAndUserIsNull(name)) {
                Category cat = new Category();
                cat.setName(name);
                cat.setUser(null);
                cat.setIsDefault(true);
                categoryRepo.save(cat);
            }
        }

        // Ensure all existing users have Cash & Bank payment accounts
        for (User user : userRepo.findAll()) {
            if (paymentAccountRepo.findByUser(user).isEmpty()) {
                PaymentAccount cash = new PaymentAccount();
                cash.setName("Cash");
                cash.setInitialBalance(0.0);
                cash.setUser(user);
                paymentAccountRepo.save(cash);

                PaymentAccount bank = new PaymentAccount();
                bank.setName("Bank");
                bank.setInitialBalance(0.0);
                bank.setUser(user);
                paymentAccountRepo.save(bank);
            }
        }
    }
}
