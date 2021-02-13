package com.example.partyhan.model

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("subscription")
data class Subscription(
    @Id
    val id: Long? = null,
    @Column("user_id")
    val userId: Long? = null,
    @Column("party_id")
    val partyId: Long? = null,

    )