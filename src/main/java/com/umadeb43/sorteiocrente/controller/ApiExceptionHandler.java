package com.umadeb43.sorteiocrente.controller;

import com.umadeb43.sorteiocrente.dto.ApiError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException exception) {
        return erro(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException exception) {
        String mensagem = exception.getBindingResult().getAllErrors().getFirst().getDefaultMessage();
        return erro(HttpStatus.BAD_REQUEST, mensagem);
    }

    private ResponseEntity<ApiError> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(new ApiError(Instant.now(), status.value(), mensagem));
    }
}
