package com.umadeb43.sorteiocrente.dto;

import java.time.Instant;

public record ApiError(Instant timestamp, int status, String mensagem) {
}
