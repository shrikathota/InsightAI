package com.insightai.exception;

public class GeminiApiException extends CustomException {
    
    public GeminiApiException(String message) {
        super(message);
    }
    
    public GeminiApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
