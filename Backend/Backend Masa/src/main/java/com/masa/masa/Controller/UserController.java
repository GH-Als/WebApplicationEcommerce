package com.masa.masa.Controller;

import com.masa.masa.Entity.User;
import com.masa.masa.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        userService.saveUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        // Check if the provided email and password match the admin credentials
        if ("admin@gmail.com".equals(user.getUsername()) && "admin".equals(user.getPassword())) {
            Map<String, Object> adminResponse = new HashMap<>();
            adminResponse.put("token", UUID.randomUUID().toString()); // Generate a token
            adminResponse.put("email", "admin@gmail.com");
            adminResponse.put("isAdmin", true); // Admin flag
            return ResponseEntity.ok(adminResponse);
        }

        // Check for regular user credentials in the database
        Optional<User> existingUser = userService.findByEmail(user.getUsername());
        if (existingUser.isPresent() && existingUser.get().getPassword().equals(user.getPassword())) {
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("token", UUID.randomUUID().toString()); // Generate a token
            userResponse.put("email", existingUser.get().getEmail());
            userResponse.put("isAdmin", false); // Not an admin
            return ResponseEntity.ok(userResponse);
        }

        // Return unauthorized response for invalid credentials
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }


}

