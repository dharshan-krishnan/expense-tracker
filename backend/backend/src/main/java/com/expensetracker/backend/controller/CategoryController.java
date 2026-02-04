package com.expensetracker.backend.controller;

import com.expensetracker.backend.entity.Category;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.service.CategoryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private UserRepository userRepo;

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        category.setUser(getLoggedInUser());
        category.setIsDefault(false);
        return service.save(category);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return service.getAllByUser(getLoggedInUser());
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable String id, @RequestBody Category category) {
        return service.update(id, category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable String id) {
        service.delete(id);
    }
}