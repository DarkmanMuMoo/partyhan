package com.example.parthan.db

import org.h2.tools.Server
import org.springframework.context.event.ContextClosedEvent
import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component
import java.sql.SQLException

@Component
class H2 {
  private var webServer: Server? = null

  @EventListener(ContextRefreshedEvent::class)
  @Throws(SQLException::class)
  fun start() {
    webServer = Server.createWebServer("-webPort", 8081.toString(), "-tcpAllowOthers").start()
  }

  @EventListener(ContextClosedEvent::class)
  fun stop() {
    webServer?.stop()
  }
}
