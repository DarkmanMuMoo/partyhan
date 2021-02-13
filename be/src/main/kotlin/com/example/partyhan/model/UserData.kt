package com.example.partyhan.model

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant

@Table
data class UserData(
    @Id
    val id: Long? = null,
    val email: String,
    val password: String,
    @Column("create_time")
    val createTime: Instant
)