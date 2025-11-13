package com.cinetech.dominio.repositorio;

import com.cinetech.dominio.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface de repositório para a entidade Usuario.
 * (Refatoração do 'Cliente.java' [cite: 15] original).
 */
@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
}