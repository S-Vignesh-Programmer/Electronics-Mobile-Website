package com.vignesh.FormNotify.dto;

import lombok.Data;

@Data
public class CartItemRequest {
    private String productId;
    private int quantity;
}