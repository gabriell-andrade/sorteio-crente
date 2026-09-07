package com.umadeb43.sorteiocrente.dto;

import java.time.Instant;
import java.util.List;

public record SorteioResponse(Long id, List<String> vencedores, Instant realizadoEm) {
}
