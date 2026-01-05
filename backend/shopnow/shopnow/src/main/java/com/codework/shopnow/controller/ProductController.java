package com.codework.shopnow.controller;

import com.codework.shopnow.dtos.ProductDto;
import com.codework.shopnow.model.Product;
import com.codework.shopnow.request.AddProductRequest;
import com.codework.shopnow.request.ProductUpdateRequest;
import com.codework.shopnow.response.ApiResponse;
import com.codework.shopnow.service.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/products")
public class ProductController {
    private final IProductService productService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Found", convertedProducts));

    }

    @GetMapping("product/{productId}")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Long productId) {
        Product product = productService.getProductById(productId);
        ProductDto productDto = productService.convertToDto(product);
        return ResponseEntity.ok(new ApiResponse("Found!", productDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addProduct(@RequestBody AddProductRequest request) {
        Product product = productService.addProduct(request);
        ProductDto productDto = productService.convertToDto(product);
        return ResponseEntity.ok(new ApiResponse("Added!", productDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{productId}/delete")
    public ResponseEntity<ApiResponse> deleteProductById(@PathVariable Long productId) {
        productService.deleteProductById(productId);
        return ResponseEntity.ok(new ApiResponse("Deleted!", productId));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/update/{updateId}")
    public ResponseEntity<ApiResponse> updateProduct(@RequestBody ProductUpdateRequest request, @PathVariable Long updateId) {
        Product product = productService.updateProduct(request, updateId);
        ProductDto productDto = productService.convertToDto(product);
        return ResponseEntity.ok(new ApiResponse("Updated!", productDto));
    }

    @GetMapping("/product/category-brand")
    public ResponseEntity<ApiResponse> getProductsByCategoryAndBrand(@RequestParam("category") String category, @RequestParam("brand") String brand) {
        List<Product> product = productService.getProductsByCategoryAndBrand(category, brand);
        List<ProductDto> productDto = productService.getConvertedProducts(product);
        return ResponseEntity.ok(new ApiResponse("Found", productDto));
    }

    @GetMapping("/product/brand-name")
    public ResponseEntity<ApiResponse> getProductsByBrandAndName(@RequestParam("brand") String brand, @RequestParam("name") String name) {
        List<Product> products = productService.getProductsByBrandAndName(brand, name);
        List<ProductDto> productDto = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Found", productDto));

    }

    @GetMapping("/product/{name}/name")
    public ResponseEntity<ApiResponse> getProductsByName(@PathVariable String name) {
        List<Product> products = productService.getProductsByName(name);
        List<ProductDto> productDto = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Found", productDto));
    }

    @GetMapping("/{category}/products/")
    public ResponseEntity<ApiResponse> getProductByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        List<ProductDto> productDto = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Found", productDto));
    }
    @GetMapping("/category/{categoryId}/products/")
    public ResponseEntity<ApiResponse> getProductByCategoryId(@PathVariable Long categoryId) {
        List<Product> products = productService.getProductsByCategoryId(categoryId);
        List<ProductDto> productDto = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Found", productDto));
    }

    @GetMapping("/product/brand")
    public ResponseEntity<ApiResponse> getProductByBrand(@RequestParam("brand") String brand) {
        List<Product> products = productService.getProductsByBrand(brand);
        List<ProductDto> productDto = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Found", productDto));
    }

    @GetMapping("/distinct/products")
    public ResponseEntity<ApiResponse> getDistinctProductsByName() {
        List<Product> products = productService.findDistinctProductByName();
        List<ProductDto> productDto = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Found", productDto));
    }

    @GetMapping("/distinct/brands")
    public ResponseEntity<ApiResponse> getDistinctBrands() {
        return ResponseEntity.ok(new ApiResponse("Found", productService.findAllDistinctBrands()));
    }
}
