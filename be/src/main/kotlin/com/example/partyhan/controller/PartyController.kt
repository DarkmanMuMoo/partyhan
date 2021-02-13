package com.example.partyhan.controller

import com.example.partyhan.model.Party
import com.example.partyhan.model.Subscription
import com.example.partyhan.repository.PartyRecord
import com.example.partyhan.repository.PartyRepository
import com.example.partyhan.repository.SubscriptionRepository
import io.jsonwebtoken.Claims
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/party")
class PartyController(private val partyRepository: PartyRepository, private val subscriptionRepository: SubscriptionRepository) {

  @GetMapping
  fun listParty(): Flux<PartyRecord> {

    return ReactiveSecurityContextHolder.getContext().flatMapMany { context ->
      val claims = context.authentication.principal as Claims
      val userId = (claims["id"] as Int).toLong()
      val userPartyId = subscriptionRepository.findUserPartyId(userId)
          .collectList()
      userPartyId.flatMapMany { userPartyList ->
        partyRepository.listJoinableParty(userId).map {
          it.is_owner = it.ownerId == userId
          it.is_join = userPartyList.contains(it.id)
          it
        }
      }
    }
  }

  @PostMapping
  fun create(@RequestBody partyRequest: PartyRequest): Mono<ResponseEntity<Party>> {

    return ReactiveSecurityContextHolder.getContext().flatMap {
      val claims = it.authentication.principal as Claims
      val creator = (claims["id"] as Int).toLong()
      val party = Party(null, creator, partyRequest.name, partyRequest.size)
      partyRepository.save(party)
    }.map {
      ResponseEntity.ok(it)
    }
  }

  @PutMapping("/{partyId}/subscribe")
  fun subscribe(@PathVariable partyId: Long): Mono<ResponseEntity<Map<String, String>>> {

    val findParty = partyRepository.findById(partyId)
        .switchIfEmpty(Mono.error(ResponseStatusException(HttpStatus.NOT_FOUND, "not found")))
    val isJoin = ReactiveSecurityContextHolder.getContext().flatMap {
      val claims = it.authentication.principal as Claims
      val userID = (claims["id"] as Int).toLong()
      subscriptionRepository.findByUserIdAndPartyId(userID, partyId).map {
        true
      }.switchIfEmpty(Mono.just(false))
    }
    return Mono.zip(findParty, isJoin, ReactiveSecurityContextHolder.getContext())
        .flatMap { result ->
          val party = result.t1
          val isJoinResult = result.t2
          val context = result.t3
          val claims = context.authentication.principal as Claims
          val userId = (claims["id"] as Int).toLong()
          if (userId == party.ownerId) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "you cannot join  your own party")
          }
          if (isJoinResult) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "you cannot join  party you already join")
          }
          Mono.just(party)
        }
        .flatMap { party ->
          subscriptionRepository.countByPartyId(partyId).flatMap { count ->
            if (count >= party.size!!) {
              Mono.error<ResponseStatusException>(ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "party is full"))
            }
            ReactiveSecurityContextHolder.getContext()
          }
        }
        .flatMap {
          val claims = it.authentication.principal as Claims
          val creator = (claims["id"] as Int).toLong()
          val subscription = Subscription(null, creator, partyId)
          subscriptionRepository.save(subscription)
        }.map {
          ResponseEntity.ok(mapOf("status" to "ok"))
        }

  }
}


data class PartyRequest(var name: String? = null, var description: String? = null, val size: Int = 0)
