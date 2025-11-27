package com.cinetech.api;

import com.cinetech.dominio.modelo.Filme;
import com.cinetech.dominio.modelo.Sessao;
import com.cinetech.servico.FilmeServico;
// REMOVIDO: import jakarta.validation.Valid; (Não estava sendo usado)
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/filmes")
public class FilmeControlador {

    private final FilmeServico filmeServico;

    public FilmeControlador(FilmeServico filmeServico) {
        this.filmeServico = filmeServico;
    }

    @GetMapping
    public List<Filme> listarFilmes() {
        return filmeServico.listarFilmesEmCartaz();
    }

    @GetMapping("/{id}/sessoes")
    public List<Sessao> listarSessoes(@PathVariable @NonNull Long id) {
        return filmeServico.listarSessoesPorFilme(id);
    }

    // NOVO: Endpoint para Adicionar Filme (POST)
    @PostMapping
    public ResponseEntity<Filme> adicionarFilme(@RequestBody @NonNull Filme filme) {
        Filme novoFilme = filmeServico.salvarFilme(filme);
        return ResponseEntity.ok(novoFilme);
    }
}