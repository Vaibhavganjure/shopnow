package com.codework.shopnow.service.cart;

import com.codework.shopnow.Repository.CartItemRepository;
import com.codework.shopnow.Repository.CartRepository;
import com.codework.shopnow.dtos.CartDto;
import com.codework.shopnow.dtos.CartItemDto;
import com.codework.shopnow.dtos.ImageDto;
import com.codework.shopnow.model.Cart;
import com.codework.shopnow.model.CartItem;
import com.codework.shopnow.model.Product;
import com.codework.shopnow.service.product.IProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;


@Service
@RequiredArgsConstructor
public class CartItemService implements ICartItemService {
    private final CartItemRepository cartItemRepository;
    private final ICartService cartService;
    private final IProductService productService;
    private final CartRepository cartRepository;
    private final ModelMapper modelMapper;

    @Override
    public CartItem addItemToCart(Long CartId, Long productId, int quantity) {
        Cart cart = cartService.getCart(CartId);
        Product product = productService.getProductById(productId);
        CartItem cartItem = cart.getItems().stream().filter(
                        item -> item.getProduct().getId()
                                .equals(product.getId())).findFirst()
                .orElse(new CartItem());

        if (cartItem.getId() == null) {
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setUnitPrice(product.getPrice());
            cartItemRepository.save(cartItem);
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        }
        cartItem.setTotalPrice();
        cart.addItem(cartItem);
        cartItemRepository.save(cartItem);
        cartRepository.save(cart);
        return cartItem;

    }


    @Override
    public void removeItemFromCart(Long cartId, Long productId) {
        Cart cart = cartService.getCart(cartId);
        CartItem itemToRemove = getCartItem(cartId, productId);
        cart.removeItem(itemToRemove);
        cartRepository.save(cart);
    }

    @Override
    public void updateItemQuantity(Long CartId, Long productId, int quantity) {
        Cart cart = cartService.getCart(CartId);
        cart.getItems().stream().filter(cartItem -> cartItem.getProduct().getId()
                        .equals(productId))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantity(quantity);
                    item.setUnitPrice(item.getProduct().getPrice());
                    item.setTotalPrice();

                });
        BigDecimal totalAmount = cart.getItems().stream().map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(totalAmount);
        cartRepository.save(cart);
    }

    @Override
    public CartItem getCartItem(Long CartId, Long productId) {
        Cart cart = cartService.getCart(CartId);

        return cart.getItems().stream()
                .filter(cartItem -> cartItem.getProduct().getId()
                        .equals(productId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    public CartItemDto convertToDto(CartItem cartItem) {

        CartItemDto dto = new CartItemDto();
        dto.setId(cartItem.getId());
        dto.setQuantity(cartItem.getQuantity());
        dto.setUnitPrice(cartItem.getUnitPrice());
        dto.setTotalPrice(cartItem.getTotalPrice());

        // Product details
        Product product = cartItem.getProduct();
        dto.setProductId(product.getId());
        dto.setProductName(product.getName());
        dto.setProductBrand(product.getBrand());
        dto.setProductPrice(product.getPrice());

        // Convert Product Images → ImageDto list
        List<ImageDto> imageDtos = product.getImages().stream().map(img -> {
            ImageDto imageDto = new ImageDto();
            imageDto.setId(img.getId());
            imageDto.setFileName(img.getFileName());
            imageDto.setDownloadUrl(img.getDownloadUrl());
            return imageDto;
        }).toList();

        dto.setImages(imageDtos);

        return dto;
    }


}
