package com.umadeb43.sorteiocrente.service;

import com.umadeb43.sorteiocrente.dto.SorteioResponse;
import com.umadeb43.sorteiocrente.model.Sorteio;
import com.umadeb43.sorteiocrente.repository.SorteioRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class SorteioService {

    private final SecureRandom random = new SecureRandom();
    private final SorteioRepository repository;

    public SorteioService(SorteioRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public SorteioResponse sortear(List<String> nomes, int quantidade) {
        if (quantidade > nomes.size()) {
            throw new IllegalArgumentException("A quantidade de vencedores deve estar entre 1 e o total de participantes.");
        }

        List<String> embaralhados = new ArrayList<>(nomes);
        Collections.shuffle(embaralhados, random);
        List<String> vencedores = embaralhados.subList(0, quantidade);

        Sorteio sorteio = repository.save(new Sorteio(Instant.now(), nomes, vencedores));
        return paraResponse(sorteio);
    }

    @Transactional(readOnly = true)
    public List<SorteioResponse> listarHistorico() {
        return repository.findAll(Sort.by("realizadoEm").descending()).stream()
                .map(this::paraResponse)
                .toList();
    }

    @Transactional
    public void limparHistorico() {
        repository.deleteAllInBatch();
    }

    private SorteioResponse paraResponse(Sorteio sorteio) {
        return new SorteioResponse(sorteio.getId(), sorteio.getVencedores(), sorteio.getRealizadoEm());
    }
}
