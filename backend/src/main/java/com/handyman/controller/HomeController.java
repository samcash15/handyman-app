package com.handyman.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {
    
    @GetMapping("/")
    @ResponseBody
    public String home() {
        return "<html><body>" +
                "<h1>🔨 Handyman Business Management API</h1>" +
                "<p>Welcome to the Handyman Business Management API!</p>" +
                "<h2>📋 Available Resources:</h2>" +
                "<ul>" +
                "<li><a href='/swagger-ui.html'>📚 API Documentation (Swagger UI)</a></li>" +
                "<li><a href='/api-docs'>📄 OpenAPI JSON Specification</a></li>" +
                "<li><a href='/h2-console'>🗄️ H2 Database Console</a></li>" +
                "</ul>" +
                "<h2>🚀 API Endpoints:</h2>" +
                "<ul>" +
                "<li><strong>Clients:</strong> <code>/api/clients</code></li>" +
                "<li><strong>Projects:</strong> <code>/api/projects</code></li>" +
                "</ul>" +
                "<h2>📱 Frontend:</h2>" +
                "<p>Run the Angular frontend with <code>ng serve</code> and visit <a href='http://localhost:4200'>http://localhost:4200</a></p>" +
                "</body></html>";
    }
}