package com.umadeb43.sorteiocrente.controller;

import com.umadeb43.sorteiocrente.service.SorteioService;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import java.util.Arrays;


@RestController
public class SorteioController {

    private final SorteioService sorteioService;

    public SorteioController(SorteioService sorteioService) {
        this.sorteioService = sorteioService;
    }


    @GetMapping("/sortear")
    public String sortear(@RequestParam String nomes) {

        List<String> lista = Arrays.asList(nomes.split(","));

        return sorteioService.sortear(lista);
    }
}

