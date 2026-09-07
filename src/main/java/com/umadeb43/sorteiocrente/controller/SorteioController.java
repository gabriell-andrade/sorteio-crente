package com.umadeb43.sorteiocrente.controller;

import com.umadeb43.sorteiocrente.dto.SorteioRequest;
import com.umadeb43.sorteiocrente.dto.SorteioResponse;
import com.umadeb43.sorteiocrente.service.SorteioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sorteios")
public class SorteioController {

    private final SorteioService sorteioService;

    public SorteioController(SorteioService sorteioService) {
        this.sorteioService = sorteioService;
    }

    @PostMapping
    public SorteioResponse sortear(@Valid @RequestBody SorteioRequest request) {
        List<String> participantes = request.nomes().stream()
                .map(String::trim)
                .filter(nome -> !nome.isEmpty())
                .distinct()
                .toList();

        if (participantes.isEmpty()) {
            throw new IllegalArgumentException("Informe pelo menos um participante válido.");
        }

        return sorteioService.sortear(participantes, request.quantidade());
    }

    @GetMapping
    public List<SorteioResponse> listarHistorico() {
        return sorteioService.listarHistorico();
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void limparHistorico() {
        sorteioService.limparHistorico();
    }
}
