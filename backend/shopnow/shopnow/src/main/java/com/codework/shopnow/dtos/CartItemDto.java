package com.codework.shopnow.dtos;

import com.codework.shopnow.model.Image;
import com.codework.shopnow.model.Product;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CartItemDto {
    private Long id;
    private BigDecimal totalPrice;
    private Long productId;
    private int quantity;
    private BigDecimal unitPrice;
    private String productName;
    private String productBrand;
    private BigDecimal productPrice;
    private List<ImageDto> images;
}

