package com.example.partyhan.service

import com.example.partyhan.security.JwtTokenProvider
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono

@Component
class CustomAuthenticationManager(private val jwtTokenProvider: JwtTokenProvider) : ReactiveAuthenticationManager {


  override fun authenticate(authentication: Authentication): Mono<Authentication> {
    val authToken = authentication.credentials.toString();

    try {
      if (!jwtTokenProvider.validateToken(authToken)) {
        return Mono.empty();
      }
      val claims = jwtTokenProvider.getClaim(authToken);
      return Mono.just(UsernamePasswordAuthenticationToken(claims, null, null));
    } catch (e: Exception) {
      return Mono.empty();
    }
  }
}
