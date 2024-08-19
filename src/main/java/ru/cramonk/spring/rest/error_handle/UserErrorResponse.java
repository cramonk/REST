package ru.cramonk.spring.rest.error_handle;

public class UserErrorResponse {
    private String message;

    public UserErrorResponse() {
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
