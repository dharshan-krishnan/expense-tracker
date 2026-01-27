package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.Category;
import java.util.List;

public interface CategoryService {
    Category save(Category category);
    List<Category> getAll();
}
