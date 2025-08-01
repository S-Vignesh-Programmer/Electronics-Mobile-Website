package com.vignesh.FormNotify.controller;

import com.vignesh.FormNotify.dto.ProductFilterRequest;
import com.vignesh.FormNotify.model.Product;
import com.vignesh.FormNotify.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService service;

    @GetMapping
    public List<Product> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping("/search")
    public List<Product> filter(@RequestBody ProductFilterRequest request) {
        if (request.getKeyword() != null) return service.search(request.getKeyword());
        if (request.getCategory() != null) return service.filterByCategory(request.getCategory());
        return service.getAll();
    }
}