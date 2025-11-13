package com.cinetech.servico;

import com.cinetech.dominio.modelo.Filme;
import com.cinetech.dominio.modelo.Sessao;
import com.cinetech.dominio.repositorio.FilmeRepositorio;
import com.cinetech.dominio.repositorio.SessaoRepositorio;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.lang.NonNull; // IMPORTAÇÃO ADICIONADA
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Camada de serviço para lógica de negócio relacionada a Filmes e Sessões.
 * Implementa os requisitos RF-001 e RF-002.
 */
@Service
public class FilmeServico {

    private final FilmeRepositorio filmeRepositorio;
    private final SessaoRepositorio sessaoRepositorio; // Este campo agora é utilizado

    /**
     * Injeta os repositórios necessários via construtor (Injeção de Dependência).
     */
    public FilmeServico(FilmeRepositorio filmeRepositorio, SessaoRepositorio sessaoRepositorio) {
        this.filmeRepositorio = filmeRepositorio;
        this.sessaoRepositorio = sessaoRepositorio;
    }

    /**
     * Implementa o RF-001: Listar filmes em cartaz.
     * @return Lista de todos os filmes cadastrados.
     */
    public List<Filme> listarFilmesEmCartaz() {
        return filmeRepositorio.findAll();
    }

    /**
     * Implementa o RF-002: Listar sessões para um filme.
     *
     * CORREÇÃO:
     * A lógica foi alterada para usar o 'sessaoRepositorio' (RNF-003).
     * Isso é mais eficiente do que carregar o filme e depois suas sessões
     * (o que poderia causar o problema N+1 ou carregar dados desnecessários).
     *
     * @param filmeId O ID do filme.
     * @return Lista de sessões para o filme.
     */
    public List<Sessao> listarSessoesPorFilme(@NonNull Long filmeId) { // ANOTAÇÃO ADICIONADA
        // 1. Validação: Verifica se o filme realmente existe (boa prática).
        // Se não existir, lança uma exceção que será tratada pela camada de API.
        filmeRepositorio.findById(filmeId)
                .orElseThrow(() -> new EntityNotFoundException("Filme com ID " + filmeId + " não encontrado."));

        // 2. Busca Eficiente: Usa o método customizado do repositório de sessões.
        // Isso corrige o aviso de "campo não utilizado" no IDE.
        return sessaoRepositorio.findByFilmeId(filmeId);
    }
}