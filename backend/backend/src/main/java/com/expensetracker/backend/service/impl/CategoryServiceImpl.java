package com.expensetracker.backend.service.impl;

import com.expensetracker.backend.entity.Category;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.CategoryRepository;
import com.expensetracker.backend.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repo;

    public CategoryServiceImpl(CategoryRepository repo) {
        this.repo = repo;
    }

    @Override
    public Category save(Category category) {
        return repo.save(category);
    }

    @Override
    public List<Category> getAllByUser(User user) {
        return repo.findByUserOrUserIsNull(user);
    }

    @Override
    public Category update(Long id, Category category) {
        Category cat = repo.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        if (Boolean.TRUE.equals(cat.getIsDefault())) {
            throw new RuntimeException("Cannot edit default category");
        }
        cat.setName(category.getName());
        return repo.save(cat);
    }

    @Override
    public void delete(Long id) {
        if (id != null) {
            Category cat = repo.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
            if (Boolean.TRUE.equals(cat.getIsDefault())) {
                throw new RuntimeException("Cannot delete default category");
            }
            repo.deleteById(id);
        }
    }
}
