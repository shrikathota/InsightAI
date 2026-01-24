package com.insightai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class InsightAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(InsightAiApplication.class, args);
    }
}
