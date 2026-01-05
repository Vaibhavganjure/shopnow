package com.codework.shopnow.service.address;

import com.codework.shopnow.Repository.AddressRepository;
import com.codework.shopnow.Repository.UserRepository;
import com.codework.shopnow.dtos.AddressDto;
import com.codework.shopnow.model.Address;
import com.codework.shopnow.model.User;
import com.codework.shopnow.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AddressService implements IAddressService {
    private final AddressRepository addressRepository;
    private final ModelMapper modelMapper;
    private final UserService userService;
    private final UserRepository userRepository;

    public List<Address> createAddress(List<Address> addressList, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        addressList.forEach(address -> {
            address.setUser(user);   // 🔥 THIS LINE FIXES 500
        });

        return addressRepository.saveAll(addressList);
    }


    @Override
    public List<Address> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Override
    public Address getAddressById(Long addressId) {
        return addressRepository.findById(addressId)
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));
    }

    @Override
    public void deleteAddress(Long addressId) {
        addressRepository.findById(addressId).ifPresentOrElse(addressRepository::delete, () -> {
            throw new EntityNotFoundException("Address not found");
        });
    }

    @Override
    public Address updateAddress(Long id, Address address) {
        return addressRepository.findById(id).map(existingAddress -> {
            existingAddress.setCountry(address.getCountry());
            existingAddress.setCity(address.getCity());
            existingAddress.setStreet(address.getStreet());
            existingAddress.setAddressType(address.getAddressType());
            existingAddress.setState(address.getState());
            return addressRepository.save(existingAddress);
        }).orElseThrow(() -> new EntityNotFoundException("Address not found"));
    }


    @Override
    public AddressDto convertToDto(Address address) {
        return modelMapper.map(address, AddressDto.class);

    }

    @Override
    public List<AddressDto> convertAllToDto(List<Address> address) {
        return address.stream().map(this::convertToDto).toList();
    }
}


