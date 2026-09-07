package com.umadeb43.sorteiocrente.service;

import com.umadeb43.sorteiocrente.dto.SorteioResponse;
import com.umadeb43.sorteiocrente.model.Sorteio;
import com.umadeb43.sorteiocrente.repository.SorteioRepository;
import com.umadeb43.sorteiocrente.util.NomeUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    private static final int TAMANHO_MAXIMO_HISTORICO = 100;
    private final SecureRandom random = new SecureRandom();
    private final SorteioRepository repository;

    public SorteioService(SorteioRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public SorteioResponse sortear(List<String> nomes, int quantidade) {
        List<String> participantes = NomeUtils.normalizarUnicos(nomes);
        if (participantes.isEmpty() || quantidade < 1 || quantidade > participantes.size()) {
            throw new IllegalArgumentException("A quantidade de vencedores deve estar entre 1 e o total de participantes.");
        }

        List<String> embaralhados = new ArrayList<>(participantes);
        Collections.shuffle(embaralhados, random);
        List<String> vencedores = embaralhados.subList(0, quantidade);

        Sorteio sorteio = repository.save(new Sorteio(Instant.now(), participantes, vencedores));
        return paraResponse(sorteio);
    }

    @Transactional(readOnly = true)
    public Page<SorteioResponse> listarHistorico(int pagina, int tamanho) {
        if (pagina < 0) {
            throw new IllegalArgumentException("A página deve ser maior ou igual a zero.");
        }
        if (tamanho < 1 || tamanho > TAMANHO_MAXIMO_HISTORICO) {
            throw new IllegalArgumentException("O tamanho da página deve estar entre 1 e 100.");
        }

        return repository.findAll(PageRequest.of(pagina, tamanho, Sort.by("realizadoEm").descending()))
                .map(this::paraResponse);
    }

    @Transactional
    public void limparHistorico() {
        repository.deleteAllInBatch();
    }

    private SorteioResponse paraResponse(Sorteio sorteio) {
        return new SorteioResponse(sorteio.getId(), sorteio.getVencedores(), sorteio.getRealizadoEm());
    }
}
