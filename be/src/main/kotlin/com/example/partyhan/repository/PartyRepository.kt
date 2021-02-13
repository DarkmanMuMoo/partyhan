package com.example.partyhan.repository

import com.example.partyhan.model.Party
import org.springframework.data.r2dbc.repository.Modifying
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono


interface PartyRepository : ReactiveCrudRepository<Party, Long> {
  // I assume that we should not see party that our self created
  @Query("SELECT party.id,party.owner_id ,party.name,party.size ,count(subscription.user_id) as current_size from party  left join subscription " +
      "on subscription.party_id = party.id  " +
      "and party.owner_id != :userId " +
      "group by party.id  " +
      "having size > count(user_id);")
  fun listJoinableParty(userId: Long): Flux<PartyRecord>
  

  @Modifying
  @Query("UPDATE party SET is_full = true where id = :partID")
  fun setFull(partID: Long): Mono<Int?>?

}

data class PartyRecord(
    var id: Long? = null,
    @Column("owner_id")
    var ownerId: Long? = null,
    var name: String? = null,
    var size: Int? = 0,
    @Column("current_size")
    var current_size: Int? = 0,
    var is_owner: Boolean = false,
    var is_join: Boolean = false
)
