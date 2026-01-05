package com.codework.shopnow.service.order;

import com.codework.shopnow.dtos.OrderDto;
import com.codework.shopnow.model.Order;
import com.codework.shopnow.request.PaymentRequest;
import com.stripe.exception.StripeException;

import java.util.List;

public interface IOrderService {
    Order placeOrder(Long userId);
    public List<OrderDto> getUserOrders(Long userId);

    String createPaymentIntent(PaymentRequest request) throws StripeException;

    OrderDto convertToDto(Order order);




}
