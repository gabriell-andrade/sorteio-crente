package com.umadeb43.sorteiocrente.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ListaService {

    private final Map<String, List<String>> listas = new HashMap<>();

    public void salvar(String nome, List<String> participantes) {
        listas.put(nome, participantes);
    }

    public Map<String, List<String>> listar() {
        return listas;
    }

    public List<String> buscar(String nome) {
        return listas.getOrDefault(nome, new ArrayList<>());
    }

    public void deletar(String nome) {
        listas.remove(nome);
    }
}
