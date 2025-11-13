package com.cinetech.dominio.repositorio;

import com.cinetech.dominio.modelo.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface de repositório para a entidade Reserva.
 */
@Repository
public interface ReservaRepositorio extends JpaRepository<Reserva, Long> {
}