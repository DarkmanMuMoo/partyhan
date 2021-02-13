package com.example.partyhan.repository

import com.example.partyhan.model.Subscription
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface SubscriptionRepository : ReactiveCrudRepository<Subscription, Long> {


  fun findByUserIdAndPartyId(userId: Long, partyId: Long): Mono<Subscription>
  fun countByPartyId(partyId: Long): Mono<Int>

  @Query("select party_id from subscription " +
      "where user_id = :userId")
  fun findUserPartyId(userId: Long): Flux<Long>

}