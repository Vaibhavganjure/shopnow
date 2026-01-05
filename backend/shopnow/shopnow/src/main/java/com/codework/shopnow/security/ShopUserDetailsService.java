package com.codework.shopnow.security;

import com.codework.shopnow.Repository.UserRepository;
import com.codework.shopnow.model.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Optional;


@Service
@RequiredArgsConstructor

public class ShopUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = Optional.ofNullable(userRepository.findByEmail(email)).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return ShopUserDetails.buildUserDetails(user);
    }
}
