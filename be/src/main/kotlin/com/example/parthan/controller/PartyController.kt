package com.example.parthan.controller

import com.example.parthan.model.Party
import com.example.parthan.model.Subscription
import com.example.parthan.repository.PartyRepository
import com.example.parthan.repository.SubscriptionRepository
import io.jsonwebtoken.Claims
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/party")
class PartyController(private val partyRepository: PartyRepository, private val subscriptionRepository: SubscriptionRepository) {
  @PostMapping
  fun create(@RequestBody partyRequest: PartyRequest): Mono<ResponseEntity<Party>> {

    return ReactiveSecurityContextHolder.getContext().flatMap {
      val claims = it.authentication.principal as Claims
      val creator = (claims["id"] as Int).toLong()
      val party = Party(null, creator, partyRequest.name, partyRequest.description, partyRequest.size)
      partyRepository.save(party)
    }.map {
      ResponseEntity.ok(it)
    }
  }

  @PutMapping("/{partyId}/subscribe")
  fun subscribe(@PathVariable partyId: Long): Mono<ResponseEntity<Map<String, String>>> {
    return partyRepository.findById(partyId)
        .switchIfEmpty(Mono.error(ResponseStatusException(HttpStatus.NOT_FOUND, "not found")))
        .map { it.size }
        .flatMap {
          subscriptionRepository.countByPartyId(partyId).flatMap { count ->
            if (count >= it) {
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
