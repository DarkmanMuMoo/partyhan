package com.example.parthan.repository

import com.example.parthan.model.Subscription
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono

interface SubscriptionRepository : ReactiveCrudRepository<Subscription, Long> {


  fun countByPartyId(partyId: Long): Mono<Integer>

}