package com.example.parthan.repository

import com.example.parthan.model.UserData
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono

interface UserDataRepository : ReactiveCrudRepository<UserData, Long> {

  fun findByEmail(email: String): Mono<UserData>
}