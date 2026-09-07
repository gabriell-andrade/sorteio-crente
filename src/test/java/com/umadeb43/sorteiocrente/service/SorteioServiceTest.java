package com.umadeb43.sorteiocrente.service;

import com.umadeb43.sorteiocrente.dto.SorteioResponse;
import com.umadeb43.sorteiocrente.model.Sorteio;
import com.umadeb43.sorteiocrente.repository.SorteioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SorteioServiceTest {

    @Mock
    private SorteioRepository repository;

    @Test
    void deveSortearEGuardarHistorico() {
        SorteioService service = new SorteioService(repository);
        when(repository.save(any(Sorteio.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SorteioResponse response = service.sortear(List.of("Ana", " ana ", "Bruno"), 1);

        assertEquals(1, response.vencedores().size());
        verify(repository).save(any(Sorteio.class));
    }

    @Test
    void deveRejeitarQuantidadeDeVencedoresInvalida() {
        SorteioService service = new SorteioService(repository);

        assertThrows(IllegalArgumentException.class,
                () -> service.sortear(List.of("Ana", "Bruno"), 0));
        assertThrows(IllegalArgumentException.class,
                () -> service.sortear(List.of("Ana", "Bruno"), 3));
    }

    @Test
    void deveRetornarHistoricoPaginado() {
        SorteioService service = new SorteioService(repository);
        Sorteio sorteio = new Sorteio(Instant.now(), List.of("Ana"), List.of("Ana"));
        when(repository.findAll(any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of(sorteio)));

        var pagina = service.listarHistorico(0, 20);

        assertEquals(1, pagina.getTotalElements());
        assertEquals(1, pagina.getContent().size());
    }
}
