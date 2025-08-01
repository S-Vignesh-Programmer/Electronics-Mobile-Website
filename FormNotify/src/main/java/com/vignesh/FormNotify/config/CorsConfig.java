package com.vignesh.FormNotify.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Value("${spring.web.cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;

    @Value("${spring.web.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private String allowedMethods;

    @Value("${spring.web.cors.allowed-headers:Authorization,Content-Type,Accept,X-Requested-With,Cache-Control}")
    private String allowedHeaders;

    @Value("${spring.web.cors.allow-credentials:true}")
    private boolean allowCredentials;

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE) // Ensure CORS filter runs first
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(allowCredentials);
        config.setAllowedOrigins(Arrays.asList(allowedOrigins.trim().split(",")));
        config.setAllowedMethods(Arrays.asList(allowedMethods.trim().split(",")));
        config.setAllowedHeaders(Arrays.asList(allowedHeaders.trim().split(",")));

        // Add missing configurations that might be needed
        config.addAllowedMethod("HEAD");
        config.addAllowedHeader("Origin");
        config.setExposedHeaders(Arrays.asList("Authorization"));

        // Cache preflight for 1 hour
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}