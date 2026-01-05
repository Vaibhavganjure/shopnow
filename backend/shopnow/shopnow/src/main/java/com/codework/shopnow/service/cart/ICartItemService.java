package com.codework.shopnow.service.cart;

import com.codework.shopnow.dtos.CartItemDto;
import com.codework.shopnow.model.CartItem;

public interface ICartItemService {
    CartItem addItemToCart(Long CartId,Long productId,int quantity);
    void removeItemFromCart(Long CartId, Long productId);
    void updateItemQuantity(Long CartId,Long productId,int quantity);
    CartItem getCartItem(Long CartId,Long productId);

    CartItemDto convertToDto(CartItem cartItem);
}
