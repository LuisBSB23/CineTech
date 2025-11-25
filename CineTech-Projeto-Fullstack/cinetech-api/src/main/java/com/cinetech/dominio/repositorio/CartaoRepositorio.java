package com.cinetech.dominio.repositorio;

import com.cinetech.dominio.modelo.Cartao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CartaoRepositorio extends JpaRepository<Cartao, Long> {
    List<Cartao> findByUsuarioId(Long usuarioId);
}