package com.codework.shopnow.Repository;

import com.codework.shopnow.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByProductId(Long productId);

    void deleteAllByCartId(Long cartId);


    List<CartItem> findByCart_User_Id(Long id);

    List<CartItem> findByCartId(Long id);
}
