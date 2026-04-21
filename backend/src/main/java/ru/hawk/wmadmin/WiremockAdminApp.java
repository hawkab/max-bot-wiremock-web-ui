package ru.hawk.wmadmin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Запускатор Web UI + Wiremock Standalone.
 *
 * @author g.olshansky
 * @since 18.02.2026
 */
@SpringBootApplication
public class WiremockAdminApp {
    public static void main(String[] args) {
        SpringApplication.run(WiremockAdminApp.class, args);
    }
}
