package com.exemplo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@SpringBootApplication
@RestController
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @GetMapping("/")
    public String home() {
        return """
                <html>
                <head>
                    <title>Aplicação Java</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                        }
                        .container {
                            text-align: center;
                            background: rgba(255,255,255,0.1);
                            padding: 3rem;
                            border-radius: 15px;
                            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                        }
                        h1 { margin: 0 0 1rem 0; font-size: 2.5rem; }
                        p { font-size: 1.2rem; margin: 0.5rem 0; }
                        .badge {
                            display: inline-block;
                            background: rgba(255,255,255,0.2);
                            padding: 0.5rem 1rem;
                            border-radius: 20px;
                            margin-top: 1rem;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>☕ Aplicação Java Spring Boot</h1>
                        <p>🐳 Rodando em Docker com Multi-stage Build</p>
                        <p>🚀 Porta: 8080</p>
                        <div class="badge">
                            <small>Build otimizado • Imagem reduzida</small>
                        </div>
                    </div>
                </body>
                </html>
                """;
    }

    @GetMapping("/health")
    public String health() {
        return "{\"status\": \"UP\", \"timestamp\": \"" + 
               LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME) + "\"}";
    }
}
