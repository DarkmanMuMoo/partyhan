package com.example.partyhan.service

import org.springframework.http.HttpHeaders
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextImpl
import org.springframework.security.web.server.context.ServerSecurityContextRepository
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

@Component
class SecurityContextRepository(private val authenticationManager: CustomAuthenticationManager) : ServerSecurityContextRepository {
  override fun save(p0: ServerWebExchange?, p1: SecurityContext?): Mono<Void> {
    throw UnsupportedOperationException()
  }

  override fun load(swe: ServerWebExchange): Mono<SecurityContext> {
    val request = swe.request;
    val authHeader = request.headers.getFirst(HttpHeaders.AUTHORIZATION)
    return if (authHeader != null && authHeader.startsWith("Bearer ")) {
      val authToken = authHeader.substring(7)
      val auth = UsernamePasswordAuthenticationToken(authToken, authToken)
      authenticationManager.authenticate(auth)
          .map(::SecurityContextImpl)
    } else {
      Mono.empty();
    }
  }

}