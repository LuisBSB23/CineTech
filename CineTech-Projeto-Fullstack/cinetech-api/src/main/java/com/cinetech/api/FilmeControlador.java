package com.cinetech.api;

import com.cinetech.api.dto.CriarSessaoRequest;
import com.cinetech.dominio.modelo.Filme;
import com.cinetech.dominio.modelo.Sessao;
import com.cinetech.servico.FilmeServico;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/filmes")
@SuppressWarnings("null") // CORREÇÃO: Suprime avisos de segurança de nulidade da IDE
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

    @PostMapping
    public ResponseEntity<Filme> adicionarFilme(@RequestBody @NonNull Filme filme) {
        Filme novoFilme = filmeServico.salvarFilme(filme);
        return ResponseEntity.ok(novoFilme);
    }

    // Endpoint para adicionar sessão a um filme
    @PostMapping("/{id}/sessoes")
    public ResponseEntity<?> adicionarSessao(@PathVariable @NonNull Long id, @RequestBody @Valid CriarSessaoRequest request) {
        Sessao novaSessao = filmeServico.adicionarSessao(id, request);
        return ResponseEntity.ok(novaSessao);
    }

    // Endpoint para deletar filme
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarFilme(@PathVariable @NonNull Long id) {
        filmeServico.deletarFilme(id);
        return ResponseEntity.noContent().build();
    }
}