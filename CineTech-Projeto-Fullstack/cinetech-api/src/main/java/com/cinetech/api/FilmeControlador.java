package com.cinetech.api;

import com.cinetech.dominio.modelo.Filme;
import com.cinetech.dominio.modelo.Sessao;
import com.cinetech.servico.FilmeServico;
import org.springframework.lang.NonNull; // IMPORTAÇÃO ADICIONADA
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controlador REST para expor os endpoints de Filmes e Sessões (RF-001, RF-002).
 * Define as rotas que o frontend (RNF-002) irá consumir.
 */
@RestController
@RequestMapping("/api/filmes")
public class FilmeControlador {

    private final FilmeServico filmeServico;

    /**
     * Injeta o serviço de filmes (Injeção de Dependência).
     */
    public FilmeControlador(FilmeServico filmeServico) {
        this.filmeServico = filmeServico;
    }

    /**
     * Endpoint: GET /api/filmes
     * Implementa o RF-001: Listar todos os filmes em cartaz.
     *
     * @return Lista de objetos Filme.
     */
    @GetMapping
    public List<Filme> listarFilmes() {
        return filmeServico.listarFilmesEmCartaz();
    }

    /**
     * Endpoint: GET /api/filmes/{id}/sessoes
     * Implementa o RF-002: Listar sessões para um filme específico.
     *
     * @param id O ID do filme.
     * @return Lista de objetos Sessao para o filme.
     */
    @GetMapping("/{id}/sessoes")
    public List<Sessao> listarSessoes(@PathVariable @NonNull Long id) { // ANOTAÇÃO ADICIONADA
        return filmeServico.listarSessoesPorFilme(id);
    }
}