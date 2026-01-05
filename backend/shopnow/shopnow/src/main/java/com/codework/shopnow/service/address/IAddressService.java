package com.codework.shopnow.service.address;

import com.codework.shopnow.dtos.AddressDto;
import com.codework.shopnow.model.Address;

import java.util.List;

public interface IAddressService {
    List<Address> createAddress(List<Address> addressList,Long  userId);
    List<Address> getUserAddresses(Long userId);
    Address getAddressById(Long addressId);
    void deleteAddress(Long addressId);
    Address updateAddress(Long id, Address address);



    AddressDto convertToDto(Address address);

    List<AddressDto> convertAllToDto(List<Address> address);
}
