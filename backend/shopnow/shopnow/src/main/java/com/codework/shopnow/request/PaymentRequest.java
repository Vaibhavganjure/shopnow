package com.codework.shopnow.request;

import lombok.Data;

@Data
public class PaymentRequest {
    private int amount;
    private String currency;
}

