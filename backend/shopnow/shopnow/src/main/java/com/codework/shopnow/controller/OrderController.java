package com.codework.shopnow.controller;

import com.codework.shopnow.dtos.OrderDto;
import com.codework.shopnow.model.Order;
import com.codework.shopnow.request.PaymentRequest;
import com.codework.shopnow.response.ApiResponse;
import com.codework.shopnow.service.order.IOrderService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/orders")
public class OrderController {

    private final IOrderService orderService;

    @PostMapping("/user/{userId}/place-order")
    public ResponseEntity<ApiResponse> placeOrder(@PathVariable Long userId) {
        Order order = orderService.placeOrder(userId);
        OrderDto orderDto=orderService.convertToDto(order);
        return ResponseEntity.ok(new ApiResponse("Order placed successfully!",orderDto));

    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody PaymentRequest request) throws StripeException {
        String clientSecret=orderService.createPaymentIntent(request);
        return ResponseEntity.ok(Map.of("clientSecret",clientSecret));
    }


    @GetMapping("/user/{userId}/all")
    private ResponseEntity<ApiResponse> getUserOrders(@PathVariable Long userId) {

        List<OrderDto> orders=orderService.getUserOrders(userId);
        return ResponseEntity.ok(new ApiResponse("Orders retrieved successfully!",orders));
    }
}
