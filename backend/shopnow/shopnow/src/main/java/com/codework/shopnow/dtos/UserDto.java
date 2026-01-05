package com.codework.shopnow.dtos;

import lombok.Data;
import java.util.List;

@Data
public class UserDto {

    private String firstName;
    private String lastName;
    private String email;
    private CartDto cart;
    private List<OrderDto> orders;
    private List<AddressDto> addresses;

}


