package com.microlift.securityconfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private JwtAuthenticationFilter jwtAuthFilter;

	@Autowired
	private AuthenticationProvider authenticationProvider;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.cors(org.springframework.security.config.Customizer.withDefaults())
				.csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(auth -> auth
						// OPTIONS requests MUST BE FIRST for CORS preflight
						.requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**")
						.permitAll()

						// Admin-only endpoints (most specific first)
						.requestMatchers("/api/auth/verify-user/**", "/api/auth/kyc-files/**")
						.hasAuthority("ROLE_ADMIN")

						.requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
						.requestMatchers(org.springframework.http.HttpMethod.DELETE,
								"/api/admin/users/**")
						.hasAuthority("ROLE_ADMIN")

						// Authenticated user endpoints (BEFORE general /api/auth/**)
						.requestMatchers("/api/auth/users/**").authenticated()
						.requestMatchers("/api/auth/update-kyc").authenticated()

						// Public auth endpoints (login, register) - MUST come AFTER specific rules
						.requestMatchers("/api/auth/login", "/api/auth/register",
								"/api/auth/upload-kyc", "/api/auth/upload-kyc-public")
						.permitAll()

						.requestMatchers("/api/campaigns/public/**").permitAll()

						.requestMatchers("/api/donor/**")
						.hasAnyAuthority("ROLE_DONOR", "ROLE_ADMIN")
						.requestMatchers("/api/beneficiary/**")
						.hasAnyAuthority("ROLE_BENEFICIARY", "ROLE_ADMIN")
						.anyRequest().authenticated())
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authenticationProvider(authenticationProvider)
				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer webSecurityCustomizer() {
		return (web) -> web.ignoring().requestMatchers("/v3/api-docs/**", "/swagger-ui/**");
	}
}
