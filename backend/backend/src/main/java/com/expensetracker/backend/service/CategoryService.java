package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.Category;
import com.expensetracker.backend.entity.User;

import java.util.List;

public interface CategoryService {

    Category save(Category category);

    List<Category> getAllByUser(User user);

    void delete(Long id);
}
