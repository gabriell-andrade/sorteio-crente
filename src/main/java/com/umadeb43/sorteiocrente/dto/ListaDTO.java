package com.umadeb43.sorteiocrente.dto;

import java.util.List;

public class ListaDTO {

    private String nome;
    private List<String> participantes;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<String> getParticipantes() {
        return participantes;
    }

    public void setParticipantes(List<String> participantes) {
        this.participantes = participantes;
    }
}
