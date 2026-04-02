package com.umadeb43.sorteiocrente.controller;

import com.umadeb43.sorteiocrente.dto.SorteioResponse;
import com.umadeb43.sorteiocrente.service.SorteioService;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;
import java.util.Arrays;

@CrossOrigin(origins = "*")
@RestController
public class SorteioController {

    private final SorteioService sorteioService;

    public SorteioController(SorteioService sorteioService) {
        this.sorteioService = sorteioService;
    }


    @GetMapping("/sortear")
    public SorteioResponse sortear(@RequestParam String nomes) {

        List<String> lista = Arrays.stream(nomes.split(","))
                .map(String::trim)
                .toList();

        return new SorteioResponse(sorteioService.sortear(lista));
    }
}

