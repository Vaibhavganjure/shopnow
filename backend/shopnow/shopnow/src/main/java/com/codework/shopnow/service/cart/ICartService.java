package com.codework.shopnow.service.cart;

import com.codework.shopnow.dtos.CartDto;
import com.codework.shopnow.model.Cart;
import com.codework.shopnow.model.CartItem;
import com.codework.shopnow.model.User;

import java.math.BigDecimal;

public interface ICartService {
    Cart getCart(Long cartId);

    Cart getCartByUserId(Long userId);

    void clearCart(Long cartId);

    Cart initialzeNewCartForUser(User user);

    BigDecimal getTotalPrice(Long cartId);

    CartDto convertToDto(Cart cart);



}
