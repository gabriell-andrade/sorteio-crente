package com.umadeb43.sorteiocrente.util;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public final class NomeUtils {

    private NomeUtils() {
    }

    public static List<String> normalizarUnicos(List<String> nomes) {
        Map<String, String> nomesPorChave = new LinkedHashMap<>();

        for (String nome : nomes) {
            if (nome == null) {
                continue;
            }
            String nomeNormalizado = nome.trim();
            if (!nomeNormalizado.isEmpty()) {
                nomesPorChave.putIfAbsent(nomeNormalizado.toLowerCase(Locale.ROOT), nomeNormalizado);
            }
        }

        return new ArrayList<>(nomesPorChave.values());
    }
}
