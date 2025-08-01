package com.vignesh.FormNotify.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductFilterRequest {
    private String keyword;
    private String category;
}
