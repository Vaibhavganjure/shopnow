package com.codework.shopnow.controller;

import com.codework.shopnow.dtos.UserDto;
import com.codework.shopnow.model.User;
import com.codework.shopnow.request.CreateUserRequest;
import com.codework.shopnow.request.UserUpdateRequest;
import com.codework.shopnow.response.ApiResponse;
import com.codework.shopnow.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
public class UserController {

    private final IUserService userService;

    @GetMapping("/{userId}/get")
    public ResponseEntity<ApiResponse> findUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        UserDto userDto = userService.convertToDto(user);
        return ResponseEntity.ok(new ApiResponse("Found!!", userDto));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createUser(@RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        UserDto userDto = userService.convertToDto(user);
        return ResponseEntity.ok(new ApiResponse("user created!!", userDto));
    }

    @GetMapping("/{userId}/delete")
    public ResponseEntity<ApiResponse> deleteUsrById(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(new ApiResponse("Found!!", "Deleted!!"));
    }

    @PostMapping("/{userId}/update")
    public ResponseEntity<ApiResponse> updateUserById(@RequestBody UserUpdateRequest request, @PathVariable Long userId) {
        User user = userService.updateUser(request, userId);
        UserDto userDto = userService.convertToDto(user);
        return ResponseEntity.ok(new ApiResponse("Updated successfully!!", userDto));
    }
}
