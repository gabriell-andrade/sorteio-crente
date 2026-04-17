package com.umadeb43.sorteiocrente.service;

import com.umadeb43.sorteiocrente.model.Participante;
import com.umadeb43.sorteiocrente.repository.ParticipanteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipanteService {

    private final ParticipanteRepository repository;

    public ParticipanteService(ParticipanteRepository repository) {
        this.repository = repository;
    }

    public List<Participante> listar() {
        return repository.findAll();
    }

    public void salvar(List<String> nomes) {
        repository.deleteAll();

        List<Participante> lista = nomes.stream()
                .map(Participante::new)
                .toList();

        repository.saveAll(lista);
    }
}