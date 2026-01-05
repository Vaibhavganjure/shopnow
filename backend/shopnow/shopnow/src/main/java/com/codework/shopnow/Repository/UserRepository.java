package com.codework.shopnow.Repository;

import com.codework.shopnow.model.Cart;
import com.codework.shopnow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);


    User findByEmail(String email);
}
