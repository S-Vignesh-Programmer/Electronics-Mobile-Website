package com.vignesh.FormNotify.controller;

import com.vignesh.FormNotify.dto.AuthResponse;
import com.vignesh.FormNotify.dto.LoginRequest;
import com.vignesh.FormNotify.model.User;
import com.vignesh.FormNotify.util.JwtUtil;
import com.vignesh.FormNotify.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User saved = userService.save(user);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Signup error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Signup failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate the user
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Generate JWT token
            String token = jwtUtil.generateToken(loginRequest.getEmail());

            return ResponseEntity.ok(new AuthResponse(token));

        } catch (AuthenticationException e) {
            System.err.println("Authentication failed for: " + loginRequest.getEmail() + " - " + e.getMessage());
            return ResponseEntity.status(401).body("Invalid credentials");
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }
}