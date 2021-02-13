package com.example.parthan.model

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("party")
data class Party(
    @Id
    val id: Long? = null,
    @Column("owner_id")
    val ownerId: Long? = null,
    val name: String? = null,
    val size: Int? = 0,
)
