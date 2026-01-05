package com.codework.shopnow.controller;

import com.codework.shopnow.model.Category;
import com.codework.shopnow.response.ApiResponse;
import com.codework.shopnow.service.category.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/categories")
public class CategoryController {
    private final ICategoryService categoryService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllCategories() {

        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(new ApiResponse("Found", categories));

    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addCategory(@RequestBody Category category) {
        Category theCategory = categoryService.addCategory(category);

        return ResponseEntity.ok(new ApiResponse("Success", theCategory));

    }

    @GetMapping("/category/{id}/category")
    public ResponseEntity<ApiResponse> getCategoryById(@PathVariable Long id) {
        Category theCategory = categoryService.findCategoryById(id);
        return ResponseEntity.ok(new ApiResponse("Success", theCategory));

    }

    @GetMapping("/category/{name}")
    public ResponseEntity<ApiResponse> getCategoryByName(@PathVariable String name) {


        Category theCategory = categoryService.findCategoryByName(name);
        return ResponseEntity.ok(new ApiResponse("Success", theCategory));

    }

    @GetMapping("category/{id}/delete")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(new ApiResponse("Success", "Category  Deleted"));


    }

    @GetMapping("category/{id}/update")
    public ResponseEntity<ApiResponse> updateCategory(@PathVariable Long id) {

        Category theCategory = categoryService.findCategoryById(id);
        return ResponseEntity.ok(new ApiResponse("Success", theCategory));
    }


}
