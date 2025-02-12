package com.masa.masa.Service;

import com.masa.masa.Entity.User;
import com.masa.masa.Repository.UserRepository;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}

