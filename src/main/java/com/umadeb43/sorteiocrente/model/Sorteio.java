package com.umadeb43.sorteiocrente.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sorteios")
public class Sorteio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false)
    private Instant realizadoEm;

    @ElementCollection
    @CollectionTable(name = "sorteio_participantes", joinColumns = @JoinColumn(name = "sorteio_id"))
    @Column(name = "nome", nullable = false, length = 100)
    @OrderColumn(name = "ordem")
    private List<String> participantes = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "sorteio_vencedores", joinColumns = @JoinColumn(name = "sorteio_id"))
    @Column(name = "nome", nullable = false, length = 100)
    @OrderColumn(name = "ordem")
    private List<String> vencedores = new ArrayList<>();

    protected Sorteio() {
    }

    public Sorteio(Instant realizadoEm, List<String> participantes, List<String> vencedores) {
        this.realizadoEm = realizadoEm;
        this.participantes = new ArrayList<>(participantes);
        this.vencedores = new ArrayList<>(vencedores);
    }

    public Long getId() { return id; }
    public Instant getRealizadoEm() { return realizadoEm; }
    public List<String> getParticipantes() { return List.copyOf(participantes); }
    public List<String> getVencedores() { return List.copyOf(vencedores); }
}
