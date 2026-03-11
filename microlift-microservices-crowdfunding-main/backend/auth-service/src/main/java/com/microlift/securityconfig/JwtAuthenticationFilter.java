package com.microlift.securityconfig;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String requestPath = request.getRequestURI();

        // Only log for API requests to avoid noise
        boolean isApiRequest = requestPath.startsWith("/api/");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            if (isApiRequest) {
                System.out.println("DEBUG: JWT Filter - No Bearer token found for: " + requestPath);
            }
            filterChain.doFilter(request, response);
            return;
        }
        final String jwt = authHeader.substring(7);
        try {
            final String userEmail = jwtService.extractUsername(jwt);
            if (isApiRequest)
                System.out.println("DEBUG: JWT Filter - Token found for user: " + userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                            null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    if (isApiRequest)
                        System.out.println("DEBUG: JWT Filter - Authentication successful for: " + userEmail
                                + " authorities: " + userDetails.getAuthorities());
                } else {
                    if (isApiRequest)
                        System.out.println("DEBUG: JWT Filter - Token invalid for user: " + userEmail);
                }
            }
        } catch (Exception e) {
            System.out.println("DEBUG: JWT Filter - Exception during validation: " + e.getMessage());
        }
        filterChain.doFilter(request, response);
    }
}
