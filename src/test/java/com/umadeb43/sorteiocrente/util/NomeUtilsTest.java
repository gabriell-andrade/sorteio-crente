package com.umadeb43.sorteiocrente.util;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class NomeUtilsTest {

    @Test
    void deveRemoverEspacosVaziosEDuplicatasSemDiferenciarMaiusculas() {
        List<String> nomes = NomeUtils.normalizarUnicos(List.of(" Ana ", "ana", " ", "Bruno"));

        assertEquals(List.of("Ana", "Bruno"), nomes);
    }
}
