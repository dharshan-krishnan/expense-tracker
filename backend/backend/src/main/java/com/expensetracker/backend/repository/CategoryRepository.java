package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.Category;
import com.expensetracker.backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByUser(User user);
    List<Category> findByUserIsNull();
    List<Category> findByUserOrUserIsNull(User user);
    boolean existsByNameIgnoreCaseAndUserIsNull(String name);
}
