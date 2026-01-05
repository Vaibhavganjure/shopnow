package com.codework.shopnow.Repository;

import com.codework.shopnow.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {


    List<Product> findByCategoryNameAndBrand(String category, String brand);

    List<Product> findByNameAndBrand(String brand, String name);

    List<Product> findByCategoryName(String category);

    List<Product> findByBrand(String brand);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%',:name,'%') ) ")
    List<Product> findByName(String name);

    boolean existsByNameAndBrand(String name,String brand);

    List<Product> findAllByCategoryId(Long categoryId);
}
