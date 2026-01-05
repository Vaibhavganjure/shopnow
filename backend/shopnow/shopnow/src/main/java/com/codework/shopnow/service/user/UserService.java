package com.codework.shopnow.service.user;

import com.codework.shopnow.Repository.AddressRepository;
import com.codework.shopnow.Repository.RoleRepository;
import com.codework.shopnow.Repository.UserRepository;
import com.codework.shopnow.dtos.*;
import com.codework.shopnow.model.Address;
import com.codework.shopnow.model.Role;
import com.codework.shopnow.model.User;
import com.codework.shopnow.request.CreateUserRequest;
import com.codework.shopnow.request.UserUpdateRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final AddressRepository addressRepository;
    private final RoleRepository roleRepository;

    @Override
    public User createUser(CreateUserRequest request) {
        Role userRole = Optional.ofNullable(roleRepository.findByName("ROLE_USER")).orElseThrow(() -> new EntityNotFoundException("Role not found!"));
        return Optional.of(request)
                .filter(user -> !userRepository.existsByEmail(request.getEmail()))
                .map(req -> {
                    User user = new User();
                    user.setFirstName(request.getFirstName());
                    user.setLastName(request.getLastName());
                    user.setEmail(request.getEmail());
                    user.setPassword(passwordEncoder.encode(request.getPassword()));
                    user.setRoles(Set.of(userRole));
                    User savedUser = userRepository.save(user);

                    List<Address> addressList = request.getAddressList();
                    for (Address address : addressList) {
                        address.setUser(savedUser);
                    }
                    List<Address> savedAddresses = addressRepository.saveAll(addressList);
                    savedUser.setAddressList(savedAddresses);

                    return savedUser;
                }).orElseThrow(() -> new EntityNotFoundException("Oops " + request.getEmail() + " already exists!"));
    }

    @Override
    public User updateUser(UserUpdateRequest request, Long userId) {
        return userRepository.findById(userId).map(existingUser -> {
            existingUser.setFirstName(request.getFirstName());
            existingUser.setLastName(request.getLastName());
            return userRepository.save(existingUser);

        }).orElseThrow(() -> new EntityNotFoundException("User does not exists!"));

    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.findById(userId).ifPresentOrElse(userRepository::save, () -> {
            throw new EntityNotFoundException("User not found");
        });
    }

    public UserDto convertToDto(User user) {

        UserDto dto = modelMapper.map(user, UserDto.class);

        if (user.getCart() != null) {
            CartDto cartDto = modelMapper.map(user.getCart(), CartDto.class);

            List<CartItemDto> cartItems = user.getCart().getItems().stream()
                    .map(ci -> {
                        CartItemDto itemDto = new CartItemDto();
                        itemDto.setProductId(ci.getProduct().getId());
                        itemDto.setProductName(ci.getProduct().getName());
                        itemDto.setQuantity(ci.getQuantity());
                        itemDto.setUnitPrice(ci.getUnitPrice());
                        return itemDto;
                    })
                    .toList();

            cartDto.setItems(cartItems);
            dto.setCart(cartDto);
        }

        List<OrderDto> orders = user.getOrders().stream()
                .map(order -> {

                    OrderDto orderDto = modelMapper.map(order, OrderDto.class);
                    orderDto.setId(order.getOrderId());
                    orderDto.setStatus(order.getOrderStatus().name());

                    List<OrderItemDto> orderItems = order.getOrderItems().stream()
                            .map(oi -> {
                                OrderItemDto oid = new OrderItemDto();
                                oid.setProductId(oi.getProduct().getId());
                                oid.setProductName(oi.getProduct().getName());
                                oid.setProductBrand(oi.getProduct().getBrand());
                                oid.setQuantity(oi.getQuantity());
                                oid.setPrice(oi.getPrice());
                                return oid;
                            })
                            .toList();

                    orderDto.setOrderItems(orderItems);
                    return orderDto;
                })
                .toList();

        dto.setOrders(orders);

        List<AddressDto> addresses = user.getAddressList().stream().map(address -> modelMapper.map(address, AddressDto.class)).toList();
        dto.setAddresses(addresses);

        return dto;
    }

    @Override
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return Optional.ofNullable(userRepository.findByEmail(email))
                .orElseThrow(() -> new EntityNotFoundException("Login required"));
    }
}
