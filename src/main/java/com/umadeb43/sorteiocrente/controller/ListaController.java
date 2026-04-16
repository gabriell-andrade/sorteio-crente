package com.umadeb43.sorteiocrente.controller;

import com.umadeb43.sorteiocrente.dto.ListaDTO;
import com.umadeb43.sorteiocrente.service.ListaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/listas")
public class ListaController {

    private final ListaService service;

    public ListaController(ListaService service) {
        this.service = service;
    }

    @PostMapping
    public void salvar(@RequestBody ListaDTO dto) {
        service.salvar(dto.getNome(), dto.getParticipantes());
    }

    @GetMapping
    public Map<String, List<String>> listar() {
        return service.listar();
    }

    @GetMapping("/{nome}")
    public List<String> buscar(@PathVariable String nome) {
        return service.buscar(nome);
    }

}
