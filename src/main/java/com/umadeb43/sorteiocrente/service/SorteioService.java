package com.umadeb43.sorteiocrente.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Random;

@Service
public class SorteioService {

    public String sortear(List<String> nomes) {

        if (nomes.isEmpty()) {
            return "Lista Vazia";
        }

        Random random = new  Random();

        int indice = random.nextInt(nomes.size());

        return nomes.get(indice);
    }

}
