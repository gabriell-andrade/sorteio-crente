package com.umadeb43.sorteiocrente.controller;

import com.umadeb43.sorteiocrente.dto.ParticipantesRequest;
import com.umadeb43.sorteiocrente.service.ParticipanteService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/participantes")
public class ParticipanteController {

    private final ParticipanteService service;

    public ParticipanteController(ParticipanteService service) {
        this.service = service;
    }

    @GetMapping
    public List<String> listar() {
        return service.listar().stream().map(participante -> participante.getNome()).toList();
    }

    @PostMapping
    public void salvar(@Valid @RequestBody ParticipantesRequest request) {
        service.salvar(request.nomes());
    }
}
