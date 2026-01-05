package com.codework.shopnow.response;

import com.codework.shopnow.model.Category;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ApiResponse {
    private String message;
    private Object data;

}
