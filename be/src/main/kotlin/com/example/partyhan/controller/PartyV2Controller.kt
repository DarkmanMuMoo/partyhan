package com.example.partyhan.controller

import com.example.partyhan.repository.PartyRecord
import com.example.partyhan.repository.PartyRepository
import com.example.partyhan.repository.SubscriptionRepository
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitSingleOrDefault
import kotlinx.coroutines.reactive.awaitSingleOrNull
import kotlinx.coroutines.reactor.ReactorContext
import org.springframework.security.core.context.SecurityContext
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono
import kotlin.coroutines.coroutineContext
import io.jsonwebtoken.Claims as Claim

@RestController
@RequestMapping("/api/party/v2")
class PartyV2Controller(
  private val partyRepository: PartyRepository,
  private val subscriptionRepository: SubscriptionRepository
) {

  @ExperimentalCoroutinesApi
  @GetMapping
  suspend fun listParty(): Flow<PartyRecord> {

    val context =
      coroutineContext[ReactorContext.Key]?.context?.get<Mono<SecurityContext>>(SecurityContext::class.java)
        ?.awaitSingleOrNull()
    val claims = context?.authentication?.principal as Claim
    val userId = (claims["id"] as Int).toLong()
    val userPartyId = subscriptionRepository.findUserPartyId(userId)
      .collectList().awaitSingleOrDefault(ArrayList())
    println(
      " ${coroutineContext[CoroutineName.Key]} is executing on thread : ${Thread.currentThread().name}"
    )
    return partyRepository.listJoinableParty(userId).map {
      it.is_owner = it.ownerId == userId
      it.is_join = userPartyId.contains(it.id)
      it
    }.asFlow()
  }

}