package com.cinetech;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal que inicializa a aplicação Spring Boot.
 * O @SpringBootApplication combina @Configuration, @EnableAutoConfiguration
 * e @ComponentScan para facilitar a configuração.
 */
@SpringBootApplication
public class CineTechAplicacao {

    public static void main(String[] args) {
        SpringApplication.run(CineTechAplicacao.class, args);
    }
}