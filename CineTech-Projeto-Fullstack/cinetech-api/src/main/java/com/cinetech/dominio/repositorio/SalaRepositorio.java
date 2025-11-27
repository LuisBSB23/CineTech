package com.cinetech.dominio.repositorio;

import com.cinetech.dominio.modelo.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaRepositorio extends JpaRepository<Sala, Long> {
}