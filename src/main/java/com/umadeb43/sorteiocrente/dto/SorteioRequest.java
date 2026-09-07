package com.umadeb43.sorteiocrente.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record SorteioRequest(
        @NotNull(message = "Informe a lista de participantes.")
        @NotEmpty(message = "Informe pelo menos um participante.")
        @Size(max = 1_000, message = "O sorteio aceita no máximo 1.000 participantes.")
        List<@NotNull(message = "O nome do participante não pode ser nulo.") @Size(max = 100, message = "Cada nome pode ter no máximo 100 caracteres.") String> nomes,
        @NotNull(message = "Informe a quantidade de vencedores.")
        @Min(value = 1, message = "A quantidade de vencedores deve ser pelo menos 1.")
        @Max(value = 1_000, message = "A quantidade de vencedores não pode exceder 1.000.")
        Integer quantidade
) {
}
