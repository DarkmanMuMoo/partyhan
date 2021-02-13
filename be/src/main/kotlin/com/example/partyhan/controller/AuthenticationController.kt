package com.example.partyhan.controller

import com.example.partyhan.model.UserData
import com.example.partyhan.repository.UserDataRepository
import com.example.partyhan.security.JwtTokenProvider
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Mono
import java.time.Instant

@RestController
@RequestMapping("/api/authentication")
class AuthenticationController(private val userRepository: UserDataRepository, private val encoder: PasswordEncoder, private val jwtTokenProvider: JwtTokenProvider) {


  @PostMapping("signup")
  fun signup(@RequestBody userRequest: UserRequest): Mono<ResponseEntity<UserResponse>> {

    val encodePassword = encoder.encode(userRequest.password)
    val userData = UserData(
        null,
        userRequest.email!!, encodePassword, Instant.now()
    )

    return userRepository.findByEmail(userRequest.email!!)
        .map { it to true }
        .switchIfEmpty(userRepository.save(userData).map {
          it to false
        })
        .map {
          if (it.second) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "email ${it.first.email} already exist")
          } else {
            ResponseEntity.ok(UserResponse(it.first.email))
          }
        }
  }

  @PostMapping("login")
  fun login(@RequestBody userRequest: LoginRequest): Mono<ResponseEntity<Map<String, String?>>> {
    return userRepository
        .findByEmail(userRequest.email!!).flatMap {

          if (encoder.matches(userRequest.password!!, it.password)) {
            Mono.just(ResponseEntity.ok(mapOf("token"
                to jwtTokenProvider.createToken(it))))
          } else {
            Mono.error {
              ResponseStatusException(HttpStatus.UNAUTHORIZED, "username or password is invalid")
            }
          }
        }.switchIfEmpty(
            Mono.error {
              ResponseStatusException(HttpStatus.UNAUTHORIZED, "username or password is invalid")
            }
        )

  }


}

data class LoginRequest(
    var email: String? = null,
    var password: String? = null,
)

data class UserResponse(
    var email: String? = null,
)


data class UserRequest(
    var email: String? = null,
    var password: String? = null,
)
