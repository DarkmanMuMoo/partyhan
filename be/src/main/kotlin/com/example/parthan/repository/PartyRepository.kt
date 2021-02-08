package com.example.parthan.repository

import com.example.parthan.model.Party
import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface PartyRepository : ReactiveCrudRepository<Party, Long> {
}