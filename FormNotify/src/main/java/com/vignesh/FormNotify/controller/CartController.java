package com.vignesh.FormNotify.controller;
import com.vignesh.FormNotify.dto.CartItemRequest;
import com.vignesh.FormNotify.model.CartItem;
import com.vignesh.FormNotify.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService service;

    @PostMapping("/add")
    public CartItem add(@RequestBody CartItemRequest request, Principal principal) {
        return service.addToCart(principal.getName(), request);
    }

    @GetMapping
    public List<CartItem> view(Principal principal) {
        return service.getCart(principal.getName());
    }

    @DeleteMapping("/clear")
    public void clear(Principal principal) {
        service.clearCart(principal.getName());
    }
}