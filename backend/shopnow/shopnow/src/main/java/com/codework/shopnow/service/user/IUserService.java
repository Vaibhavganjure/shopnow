package com.codework.shopnow.service.user;

import com.codework.shopnow.dtos.UserDto;
import com.codework.shopnow.model.User;
import com.codework.shopnow.request.CreateUserRequest;
import com.codework.shopnow.request.UserUpdateRequest;

public interface IUserService {
    User createUser(CreateUserRequest request);
    User updateUser(UserUpdateRequest request,Long userId);
    User  getUserById(Long userId);
    void deleteUser(Long userId);

    UserDto convertToDto(User user);

    User getAuthenticatedUser();
}
