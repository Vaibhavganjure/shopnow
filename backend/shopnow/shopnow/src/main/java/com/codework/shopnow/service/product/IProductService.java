package com.codework.shopnow.service.product;

import com.codework.shopnow.dtos.ProductDto;
import com.codework.shopnow.model.Product;
import com.codework.shopnow.request.AddProductRequest;
import com.codework.shopnow.request.ProductUpdateRequest;

import java.util.List;

public interface IProductService {
    Product addProduct(AddProductRequest product);
    Product getProductById(Long productId);
    Product updateProduct(ProductUpdateRequest request, Long productId);
    void deleteProductById(Long productId);

    List<Product> getAllProducts();
    List<Product> getProductsByCategoryAndBrand(String category, String brand);
    List<Product> getProductsByBrandAndName(String brand, String name);
    List<Product> getProductsByName( String name);
    List<Product> getProductsByCategory(String category);
    List<Product> getProductsByBrand(String brand);

    List<ProductDto> getConvertedProducts(List<Product> products);

    ProductDto convertToDto(Product product);

    List<Product> findDistinctProductByName();


    List<String> findAllDistinctBrands();

    List<Product> getProductsByCategoryId(Long categoryId);
}
