package com.codework.shopnow.controller;

import com.codework.shopnow.request.LoginRequest;
import com.codework.shopnow.security.ShopUserDetailsService;
import com.codework.shopnow.security.jwt.JwtUtils;
import com.codework.shopnow.utils.CookieUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/auth")
public class AuthController {
    private final JwtUtils jwtUtils;
    private final CookieUtils cookieUtils;
    private final ShopUserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;

    @Value("${auth.token.refreshExpirationInMils}")
    private long refreshTokenExpirationTime;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String accessToken = jwtUtils.generateAccessTokenForUser(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(request.getEmail());

        // 1. Still add cookie (Keep it for Localhost/Postman testing)
        cookieUtils.addRefreshTokenCookie(response, refreshToken, refreshTokenExpirationTime);

        // 2. ✅ FIX: Send refreshToken in the JSON body too
        Map<String, String> token = new HashMap<>();
        token.put("accessToken", accessToken);
        token.put("refreshToken", refreshToken);

        return ResponseEntity.ok(token);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshAccessToken(
            HttpServletRequest request,
            // 3. ✅ FIX: Accept Request Body as a fallback
            @RequestBody(required = false) Map<String, String> requestBody
    ) {
        // A. Try to get token from Cookie first
        String refreshToken = cookieUtils.getRefreshTokenFromCookies(request);

        // B. If cookie is missing (AWS case), check the Request Body
        if (refreshToken == null && requestBody != null) {
            refreshToken = requestBody.get("refreshToken");
        }

        // C. Validate whatever token we found
        if (refreshToken != null) {
            boolean isValid = jwtUtils.validateToken(refreshToken);

            if (isValid) {
                String usernameFromToken = jwtUtils.getUsernameFromToken(refreshToken);
                UserDetails userDetails = userDetailsService.loadUserByUsername(usernameFromToken);

                String newAccessToken = jwtUtils.generateAccessTokenForUser(
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities())
                );

                Map<String, String> response = new HashMap<>();
                response.put("accessToken", newAccessToken);
                response.put("refreshToken", refreshToken); // Optional: return same refresh token

                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid or expired refresh token");
    }
}