package com.example.partyhan.config

import com.example.partyhan.service.SecurityContextRepository
import org.springframework.context.annotation.Bean
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus.FORBIDDEN
import org.springframework.http.HttpStatus.UNAUTHORIZED
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.server.SecurityWebFilterChain
import reactor.core.publisher.Mono


@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
class SecurityConfig {


  @Bean
  fun passwordEncoder(): PasswordEncoder {
    return BCryptPasswordEncoder()
  }


  @Bean
  fun springWebFilterChain(http: ServerHttpSecurity,
                           securityContextRepository: SecurityContextRepository,
                           customAuthenticationManager: ReactiveAuthenticationManager): SecurityWebFilterChain {

    return http
        .exceptionHandling()
        .authenticationEntryPoint { swe, _ ->
          Mono.fromRunnable { swe.response.statusCode = UNAUTHORIZED }
        }
        .accessDeniedHandler { swe, _ ->
          Mono.fromRunnable { swe.response.statusCode = FORBIDDEN }
        }.and()
        .csrf().disable()
        .formLogin().disable()
        .httpBasic().disable()
        .authenticationManager(customAuthenticationManager)
        .securityContextRepository(securityContextRepository)
        .authorizeExchange()
        .pathMatchers(HttpMethod.OPTIONS).permitAll()
        .pathMatchers("/api/authentication/login").permitAll()
        .pathMatchers("/api/authentication/signup").permitAll()
        .anyExchange().authenticated()
        .and().build()


  }


}

