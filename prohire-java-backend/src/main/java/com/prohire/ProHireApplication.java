package com.prohire;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProHireApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
		
		SpringApplication.run(ProHireApplication.class, args);
		System.out.println("\n" + "=".repeat(60));
		System.out.println("🚀 PROHIRE BACKEND STARTED SUCCESSFULLY!");
		System.out.println("🔗 API BASE URL: http://localhost:8080");
		System.out.println("=".repeat(60) + "\n");
	}

}
