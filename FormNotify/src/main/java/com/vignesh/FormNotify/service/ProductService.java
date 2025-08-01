package com.vignesh.FormNotify.service;

import com.vignesh.FormNotify.model.Product;
import com.vignesh.FormNotify.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repo;

    public List<Product> getAll() {
        return repo.findAll();
    }

    public List<Product> search(String keyword) {
        return repo.findByNameContainingIgnoreCase(keyword);
    }

    public List<Product> filterByCategory(String category) {
        return repo.findByCategory(category);
    }

    public Product getById(String id) {
        return repo.findById(id).orElse(null);
    }
}