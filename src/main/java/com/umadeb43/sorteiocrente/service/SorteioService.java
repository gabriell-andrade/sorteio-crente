package com.umadeb43.sorteiocrente.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
public class SorteioService {

    private final SecureRandom random = new SecureRandom();

    public String sortear(List<String> nomes) {

        if (nomes.isEmpty()) {
            return "Lista Vazia";
        }

        int indice = random.nextInt(nomes.size());

        return nomes.get(indice);
    }
}