package com.codework.shopnow.Repository;

import com.codework.shopnow.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem,Integer> {
    List<OrderItem> findByProductId(Long productId);
}
