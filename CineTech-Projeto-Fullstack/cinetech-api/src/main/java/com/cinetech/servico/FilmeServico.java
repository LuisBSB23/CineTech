package com.cinetech.servico;

import com.cinetech.api.dto.CriarSessaoRequest;
import com.cinetech.dominio.modelo.Filme;
import com.cinetech.dominio.modelo.Sala;
import com.cinetech.dominio.modelo.Sessao;
import com.cinetech.dominio.repositorio.FilmeRepositorio;
import com.cinetech.dominio.repositorio.SalaRepositorio;
import com.cinetech.dominio.repositorio.SessaoRepositorio;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@SuppressWarnings("null") // CORREÇÃO: Suprime avisos de segurança de nulidade (ex: Long -> @NonNull ID)
public class FilmeServico {

    private final FilmeRepositorio filmeRepositorio;
    private final SessaoRepositorio sessaoRepositorio;
    private final SalaRepositorio salaRepositorio;

    public FilmeServico(FilmeRepositorio filmeRepositorio, SessaoRepositorio sessaoRepositorio, SalaRepositorio salaRepositorio) {
        this.filmeRepositorio = filmeRepositorio;
        this.sessaoRepositorio = sessaoRepositorio;
        this.salaRepositorio = salaRepositorio;
    }

    public List<Filme> listarFilmesEmCartaz() {
        return filmeRepositorio.findAll();
    }

    public List<Sessao> listarSessoesPorFilme(@NonNull Long filmeId) {
        filmeRepositorio.findById(filmeId)
                .orElseThrow(() -> new EntityNotFoundException("Filme com ID " + filmeId + " não encontrado."));

        return sessaoRepositorio.findByFilmeId(filmeId);
    }

    @Transactional
    public Filme salvarFilme(@NonNull Filme filme) {
        return filmeRepositorio.save(filme);
    }

    // Adicionar Sessão
    @Transactional
    public Sessao adicionarSessao(@NonNull Long filmeId, @NonNull CriarSessaoRequest request) {
        Filme filme = filmeRepositorio.findById(filmeId)
                .orElseThrow(() -> new EntityNotFoundException("Filme não encontrado"));
        
        Sala sala = salaRepositorio.findById(request.getSalaId())
                .orElseThrow(() -> new EntityNotFoundException("Sala não encontrada"));

        Sessao sessao = new Sessao();
        sessao.setFilme(filme);
        sessao.setSala(sala);
        sessao.setDataHora(request.getDataHora());
        sessao.setValorIngresso(request.getValorIngresso());
        sessao.setAssentosDisponiveis(sala.getCapacidadeTotal());

        return sessaoRepositorio.save(sessao);
    }

    // Deletar Filme
    @Transactional
    public void deletarFilme(@NonNull Long id) {
        if (!filmeRepositorio.existsById(id)) {
            throw new EntityNotFoundException("Filme não encontrado");
        }
        filmeRepositorio.deleteById(id);
    }
}