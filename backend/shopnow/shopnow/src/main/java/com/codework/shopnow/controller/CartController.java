package com.codework.shopnow.controller;

import com.codework.shopnow.Repository.CartRepository;
import com.codework.shopnow.dtos.CartDto;
import com.codework.shopnow.model.Cart;
import com.codework.shopnow.response.ApiResponse;
import com.codework.shopnow.service.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collections;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/carts")
public class CartController {
    private final CartService cartService;


    @GetMapping("/user/{userId}/cart")
    public ResponseEntity<?> getUserCart(@PathVariable Long userId) {

            Cart cart = cartService.getCartByUserId(userId);
            CartDto cartDto = cartService.convertToDto(cart);
            return ResponseEntity.ok(new ApiResponse("success", cartDto));

        }



    @DeleteMapping("/cart/{cartId}/clear")
    public void clearCart(@PathVariable Long cartId) {
        cartService.clearCart(cartId);

    }
}
