package com.umadeb43.sorteiocrente.controller;

import com.umadeb43.sorteiocrente.dto.SorteioRequest;
import com.umadeb43.sorteiocrente.dto.SorteioResponse;
import com.umadeb43.sorteiocrente.service.SorteioService;
import com.umadeb43.sorteiocrente.util.NomeUtils;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
        List<String> participantes = NomeUtils.normalizarUnicos(request.nomes());

        if (participantes.isEmpty()) {
            throw new IllegalArgumentException("Informe pelo menos um participante válido.");
        }

        return sorteioService.sortear(participantes, request.quantidade());
    }

    @GetMapping
    public Page<SorteioResponse> listarHistorico(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "20") int tamanho) {
        return sorteioService.listarHistorico(pagina, tamanho);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void limparHistorico() {
        sorteioService.limparHistorico();
    }
}
