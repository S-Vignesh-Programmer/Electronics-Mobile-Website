package com.vignesh.FormNotify;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FormNotifyApplication {

	public static void main(String[] args) {
		// Load .env file
		Dotenv dotenv = Dotenv.configure()
				.directory("./")
				.ignoreIfMalformed()
				.ignoreIfMissing()
				.load();

		// Set system properties only if values are not null
		dotenv.entries().forEach(entry -> {
			if (entry.getValue() != null) {
				System.setProperty(entry.getKey(), entry.getValue());
			}
		});

		// Optional: fallback defaults if needed
		System.setProperty("SERVER_PORT", dotenv.get("SERVER_PORT", "8080"));
		System.setProperty("MONGODB_URI", dotenv.get("MONGODB_URI", ""));
		System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET", ""));
		System.setProperty("JWT_EXPIRATION", dotenv.get("JWT_EXPIRATION", "86400000"));

		SpringApplication.run(FormNotifyApplication.class, args);
	}
}
