package com.codework.shopnow.data;

import com.codework.shopnow.Repository.RoleRepository;
import com.codework.shopnow.Repository.UserRepository;
import com.codework.shopnow.model.Role;
import com.codework.shopnow.model.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Optional;
import java.util.Set;

@Transactional
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationListener<ApplicationReadyEvent> {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        Set<String> defaultRoles = Set.of("ROLE_ADMIN", "ROLE_USER","ROLE_CUSTOMER");
        createDefaultRoles(defaultRoles);
        createDefaultAdminIfNotExists();
    }

    private void createDefaultRoles(Set<String> roles) {
        roles.stream().
                filter(role -> Optional.ofNullable(roleRepository.findByName(role)).isEmpty())
                .map(Role::new)
                .forEach(roleRepository::save);
    }

    private void createDefaultAdminIfNotExists(){
        Role adminRole=Optional.ofNullable(roleRepository.findByName("ROLE_ADMIN"))
                .orElseThrow(()->new RuntimeException("Role Admin Not Found"));

        for(int i=1;i<=3;i++){
            String defaultEmail="admin"+i+"@gmail.com";
            if(userRepository.existsByEmail(defaultEmail)){
                continue;
            }
            User user=new User();
            user.setFirstName("Admin");
            user.setLastName("Shop User"+i);
            user.setEmail(defaultEmail);
            user.setPassword(passwordEncoder.encode("123456"));
            user.setRoles(Set.of(adminRole));
            userRepository.save(user);
        }
    }
}