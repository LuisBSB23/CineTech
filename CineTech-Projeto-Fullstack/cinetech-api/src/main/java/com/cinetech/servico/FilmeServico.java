package com.cinetech.servico;

import com.cinetech.dominio.modelo.Filme;
import com.cinetech.dominio.modelo.Sessao;
import com.cinetech.dominio.repositorio.FilmeRepositorio;
import com.cinetech.dominio.repositorio.SessaoRepositorio;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Camada de serviço para lógica de negócio relacionada a Filmes e Sessões.
 * Implementa os requisitos RF-001 e RF-002.
 */
@Service
public class FilmeServico {

    private final FilmeRepositorio filmeRepositorio;
    private final SessaoRepositorio sessaoRepositorio;

    public FilmeServico(FilmeRepositorio filmeRepositorio, SessaoRepositorio sessaoRepositorio) {
        this.filmeRepositorio = filmeRepositorio;
        this.sessaoRepositorio = sessaoRepositorio;
    }

    public List<Filme> listarFilmesEmCartaz() {
        return filmeRepositorio.findAll();
    }

    public List<Sessao> listarSessoesPorFilme(@NonNull Long filmeId) {
        filmeRepositorio.findById(filmeId)
                .orElseThrow(() -> new EntityNotFoundException("Filme com ID " + filmeId + " não encontrado."));

        return sessaoRepositorio.findByFilmeId(filmeId);
    }

    // NOVO: Método para salvar filme (Admin)
    @Transactional
    public Filme salvarFilme(@NonNull Filme filme) {
        return filmeRepositorio.save(filme);
    }
}