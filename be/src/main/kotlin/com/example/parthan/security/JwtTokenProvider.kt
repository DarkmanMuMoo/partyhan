package com.example.parthan.security

import com.example.parthan.model.UserData
import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm.HS256
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets
import java.util.Base64
import java.util.Date
import javax.annotation.PostConstruct
import javax.crypto.SecretKey


@Service
class JwtTokenProvider {

  private var secretKey: SecretKey? = null

  @PostConstruct
  fun init() {
    val secret = Base64.getEncoder().encodeToString("H+MbQeThWmZq3t6w9z\$C&F)J@NcRfUjX\n".toByteArray(StandardCharsets.UTF_8))
    secretKey = Keys.hmacShaKeyFor(secret.toByteArray(StandardCharsets.UTF_8))
  }

  fun createToken(userData: UserData): String? {
    val email: String = userData.email
    val claims = Jwts.claims()
        .setSubject(email)
    claims["name"] = userData.username
    claims["id"] = userData.id
    val now = Date()
    val validity = Date(now.time + 1000 * 60 * 60 * 24)
    return Jwts.builder()
        .setClaims(claims)
        .setIssuedAt(now)
        .setExpiration(validity)
        .signWith(secretKey, HS256)
        .compact()
  }

  fun getClaim(token: String?): Claims {
    return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).body

  }

  fun validateToken(token: String?): Boolean {
    return try {
      Jwts
          .parserBuilder().setSigningKey(secretKey).build()
          .parseClaimsJws(token)

      true
    } catch (e: JwtException) {
      false
    } catch (e: IllegalArgumentException) {
      false
    }
  }
}