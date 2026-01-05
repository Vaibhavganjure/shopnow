package com.codework.shopnow.service.cart;

import com.codework.shopnow.Repository.CartItemRepository;
import com.codework.shopnow.Repository.CartRepository;
import com.codework.shopnow.Repository.ImageRepository;
import com.codework.shopnow.Repository.ProductRepository;
import com.codework.shopnow.dtos.CartDto;
import com.codework.shopnow.dtos.CartItemDto;
import com.codework.shopnow.dtos.ImageDto;
import com.codework.shopnow.dtos.ProductDto;
import com.codework.shopnow.model.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ModelMapper modelMapper;
    private final ProductRepository productRepository;
    private final ImageRepository imageRepository;

    @Override
    public Cart getCart(Long cartId) {
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found"));
    }

    @Override
    public Cart getCartByUserId(Long userId) {
        Cart cart = cartRepository.findByUserId(userId);

        if (cart == null) {
            throw new EntityNotFoundException("Cart not found for user " + userId);
        }

        return cart;
    }

    @Override
    public void clearCart(Long cartId) {
        Cart cart = getCart(cartId);
//        cartItemRepository.deleteAllByCartId(cartId);
        cart.clearCart();
        cartRepository.save(cart);
    }

    @Override
    public Cart initialzeNewCartForUser(User user) {
        Cart cart = cartRepository.findByUserId(user.getId());

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart.setTotalAmount(BigDecimal.ZERO);
            cart = cartRepository.save(cart);
        }

        return cart;
    }


    @Override
    public BigDecimal getTotalPrice(Long cartId) {
        Cart cart = getCart(cartId);
        return cart.getTotalAmount();
    }

    @Override
    public CartDto convertToDto(Cart cart) {

        CartDto cartDto = modelMapper.map(cart, CartDto.class);
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        List<CartItemDto> cartItemDtos = cartItems.stream().map(cartItem -> {
            CartItemDto dto = modelMapper.map(cartItem, CartItemDto.class);
            List<Image> images = imageRepository.findByProductId(cartItem.getProduct().getId());
            List<ImageDto> imageDtos = images.stream()
                    .map(img -> modelMapper.map(img, ImageDto.class))
                    .toList();
            dto.setImages(imageDtos);
            return dto;
        }).toList();
        cartDto.setItems(cartItemDtos);
        return cartDto;
    }


}
