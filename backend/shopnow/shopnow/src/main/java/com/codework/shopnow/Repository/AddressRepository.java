package com.codework.shopnow.Repository;

import com.codework.shopnow.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserId(Long  userId);
}
