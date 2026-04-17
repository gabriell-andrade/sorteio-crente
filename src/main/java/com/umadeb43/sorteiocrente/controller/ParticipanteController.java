package com.umadeb43.sorteiocrente.controller;

import com.umadeb43.sorteiocrente.service.ParticipanteService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/participantes")
public class ParticipanteController {

    private final ParticipanteService service;

    public ParticipanteController(ParticipanteService service) {
        this.service = service;
    }

    @GetMapping
    public List<String> listar() {
        return service.listar().stream()
                .map(p ->p.getNome())
                .toList();
    }

    @PostMapping
    public void salvar(@RequestBody List<String> nomes) {
        service.salvar(nomes);
    }
}