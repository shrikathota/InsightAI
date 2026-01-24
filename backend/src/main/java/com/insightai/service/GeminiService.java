package com.insightai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.insightai.dto.*;
import com.insightai.exception.GeminiApiException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String PROMPT_TEMPLATE = """
            You are an AI assistant analyzing meeting transcripts.
            
            Analyze the following meeting transcript and provide:
            
            1. SUMMARY: A concise 2-3 sentence summary of the meeting
            2. KEY DECISIONS: Bullet points of important decisions made
            3. ACTION ITEMS: List each action item in the format:
               - [Action description] | Owner: [name if mentioned, else "Unassigned"] | Deadline: [date if mentioned, else "Not specified"]
            
            Transcript:
            %s
            
            Respond in the following JSON format:
            {
              "summary": "string",
              "keyDecisions": ["string"],
              "actionItems": [
                {
                  "action": "string",
                  "owner": "string",
                  "deadline": "string"
                }
              ]
            }
            """;

    public GeminiParsedResponse generateSummary(String transcript) {
        logger.info("Generating summary for transcript of length: {}", transcript.length());

        try {
            // Build the prompt
            String prompt = String.format(PROMPT_TEMPLATE, transcript);

            // Build the request
            GeminiRequest request = GeminiRequest.builder()
                    .contents(Collections.singletonList(
                            GeminiRequest.Content.builder()
                                    .parts(Collections.singletonList(
                                            GeminiRequest.Part.builder()
                                                    .text(prompt)
                                                    .build()
                                    ))
                                    .build()
                    ))
                    .generationConfig(GeminiRequest.GenerationConfig.builder()
                            .temperature(0.4)
                            .maxOutputTokens(1024)
                            .build())
                    .build();

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<GeminiRequest> entity = new HttpEntity<>(request, headers);

            // Add API key as query parameter
            String urlWithKey = apiUrl + "?key=" + apiKey;

            // Call Gemini API
            logger.debug("Calling Gemini API at: {}", urlWithKey);
            ResponseEntity<GeminiResponse> response = restTemplate.exchange(
                    urlWithKey,
                    HttpMethod.POST,
                    entity,
                    GeminiResponse.class
            );

            if (response.getBody() == null || 
                response.getBody().getCandidates() == null || 
                response.getBody().getCandidates().isEmpty()) {
                throw new GeminiApiException("Empty response from Gemini API");
            }

            // Extract text from response
            String responseText = response.getBody()
                    .getCandidates()
                    .get(0)
                    .getContent()
                    .getParts()
                    .get(0)
                    .getText();

            logger.debug("Received response from Gemini API");

            // Parse the JSON response
            return parseGeminiResponse(responseText);

        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                logger.error("Invalid Gemini API key");
                throw new GeminiApiException("Invalid API key");
            } else if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                logger.error("Gemini API quota exceeded");
                throw new GeminiApiException("API quota exceeded. Please try again later.");
            } else {
                logger.error("Gemini API client error: {}", e.getMessage());
                throw new GeminiApiException("AI service error: " + e.getMessage());
            }
        } catch (HttpServerErrorException e) {
            logger.error("Gemini API server error: {}", e.getMessage());
            throw new GeminiApiException("AI service is temporarily unavailable");
        } catch (Exception e) {
            logger.error("Unexpected error calling Gemini API", e);
            throw new GeminiApiException("Failed to generate summary: " + e.getMessage(), e);
        }
    }

    private GeminiParsedResponse parseGeminiResponse(String responseText) {
        try {
            // Try to extract JSON from the response (it might be wrapped in markdown code blocks)
            String jsonText = responseText.trim();
            
            // Remove markdown code blocks if present
            if (jsonText.startsWith("```json")) {
                jsonText = jsonText.substring(7);
            } else if (jsonText.startsWith("```")) {
                jsonText = jsonText.substring(3);
            }
            
            if (jsonText.endsWith("```")) {
                jsonText = jsonText.substring(0, jsonText.length() - 3);
            }
            
            jsonText = jsonText.trim();

            // Parse JSON
            GeminiParsedResponse parsed = objectMapper.readValue(jsonText, GeminiParsedResponse.class);
            
            // Ensure non-null lists
            if (parsed.getKeyDecisions() == null) {
                parsed.setKeyDecisions(new ArrayList<>());
            }
            if (parsed.getActionItems() == null) {
                parsed.setActionItems(new ArrayList<>());
            }
            
            logger.info("Successfully parsed Gemini response: {} action items", 
                       parsed.getActionItems().size());
            
            return parsed;

        } catch (JsonProcessingException e) {
            logger.error("Failed to parse Gemini response as JSON: {}", responseText, e);
            
            // Fallback: create a basic response with the raw text as summary
            GeminiParsedResponse fallback = new GeminiParsedResponse();
            fallback.setSummary(responseText);
            fallback.setKeyDecisions(new ArrayList<>());
            fallback.setActionItems(new ArrayList<>());
            
            return fallback;
        }
    }
}
