package com.vignesh.FormNotify.service;

import com.vignesh.FormNotify.dto.CartItemRequest;
import com.vignesh.FormNotify.model.CartItem;
import com.vignesh.FormNotify.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartItemRepository cartRepo;

    public CartItem addToCart(String userId, CartItemRequest request) {
        CartItem item = new CartItem(null, userId, request.getProductId(), request.getQuantity());
        return cartRepo.save(item);
    }

    public List<CartItem> getCart(String userId) {
        return cartRepo.findByUserId(userId);
    }

    public void clearCart(String userId) {
        cartRepo.deleteByUserId(userId);
    }
}
