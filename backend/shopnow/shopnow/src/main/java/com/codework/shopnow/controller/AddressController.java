package com.codework.shopnow.controller;

import com.codework.shopnow.dtos.AddressDto;
import com.codework.shopnow.model.Address;
import com.codework.shopnow.response.ApiResponse;
import com.codework.shopnow.service.address.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/address")
public class AddressController {

    private final AddressService addressService;


    @PostMapping("/{userId}/new")
    public ResponseEntity<ApiResponse> createAddress(@RequestBody List<Address> addressList,@PathVariable Long userId) {
        List<Address> address = addressService.createAddress(addressList,userId);
        List<AddressDto> addressDtos = addressService.convertAllToDto(address);
        return ResponseEntity.ok(new ApiResponse("successfully got address", addressDtos));
    }

    @GetMapping("/{userId}/address")
    public ResponseEntity<ApiResponse> getUserAddresses(@PathVariable Long userId) {
        List<Address> address = addressService.getUserAddresses(userId);
        List<AddressDto> addressDto = addressService.convertAllToDto(address);
        return ResponseEntity.ok(new ApiResponse("successfully got address", addressDto));
    }

    @GetMapping("/{addressId}/address")
    public ResponseEntity<ApiResponse> getAddressById(@PathVariable Long addressId) {
        Address address = addressService.getAddressById(addressId);
        AddressDto addressDto = addressService.convertToDto(address);
        return ResponseEntity.ok(new ApiResponse("successfully got address", addressDto));
    }

    @PutMapping("/{addressId}/update")
    public ResponseEntity<ApiResponse> updateAddress(@PathVariable Long addressId, @RequestBody Address updatedAddress) {
        Address address = addressService.updateAddress(addressId, updatedAddress);
        AddressDto addressDto = addressService.convertToDto(address);
        return ResponseEntity.ok(new ApiResponse("successfully got address", addressDto));
    }

    @DeleteMapping("/{addressId}/delete")
    public ResponseEntity<ApiResponse> deleteAddress(@PathVariable Long addressId) {
        addressService.deleteAddress(addressId);
        return ResponseEntity.ok(new ApiResponse("successfully deleted address", "Deleted"));
    }

}
