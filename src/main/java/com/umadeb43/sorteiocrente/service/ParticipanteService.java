package com.umadeb43.sorteiocrente.service;

import com.umadeb43.sorteiocrente.model.Participante;
import com.umadeb43.sorteiocrente.repository.ParticipanteRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ParticipanteService {

    private final ParticipanteRepository repository;

    public ParticipanteService(ParticipanteRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Participante> listar() {
        return repository.findAll(Sort.by("nome").ascending());
    }

    @Transactional
    public void salvar(List<String> nomes) {
        List<Participante> lista = nomes.stream()
                .map(String::trim)
                .filter(nome -> !nome.isEmpty())
                .distinct()
                .map(Participante::new)
                .toList();

        if (lista.isEmpty()) {
            throw new IllegalArgumentException("Informe pelo menos um participante válido.");
        }

        repository.deleteAllInBatch();
        repository.saveAll(lista);
    }
}
