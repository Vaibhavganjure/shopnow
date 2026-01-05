package com.codework.shopnow.controller;

import com.codework.shopnow.dtos.CartItemDto;
import com.codework.shopnow.model.Cart;
import com.codework.shopnow.model.CartItem;
import com.codework.shopnow.model.User;
import com.codework.shopnow.response.ApiResponse;
import com.codework.shopnow.service.cart.ICartItemService;
import com.codework.shopnow.service.cart.ICartService;
import com.codework.shopnow.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/cartItems")
public class CartItemController {
    private final ICartItemService cartItemService;
    private final IUserService userService;
    private final ICartService cartService;
    @PostMapping(
            value = "/item/add",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ApiResponse> addItemToCart(
            @RequestParam("productId") Long productId,
            @RequestParam("quantity") Integer quantity
    ) {
        User user = userService.getAuthenticatedUser();
        Cart cart = cartService.initialzeNewCartForUser(user);
        CartItem cartItem = cartItemService.addItemToCart(cart.getId(), productId, quantity);
        CartItemDto cartItemDto = cartItemService.convertToDto(cartItem);
        return ResponseEntity.ok(new ApiResponse("Item added successfully!", cartItemDto));
    }


    @DeleteMapping("/cart/{cartId}/item/{itemId}/remove")
    public ResponseEntity<ApiResponse> removeItemFromCart(@PathVariable Long cartId, @PathVariable Long itemId) {
        cartItemService.removeItemFromCart(cartId, itemId);
        return ResponseEntity.ok(new ApiResponse("Item removed successfully!!", null));
    }

    @PutMapping("/cart/{cartId}/item/{itemId}/update")
    public ResponseEntity<ApiResponse> updateCartItem(@PathVariable Long cartId, @PathVariable Long itemId, @RequestParam int quantity) {
        cartItemService.updateItemQuantity(cartId, itemId, quantity);
        return ResponseEntity.ok(new ApiResponse("Item updated successfully!!", null));
    }

}
