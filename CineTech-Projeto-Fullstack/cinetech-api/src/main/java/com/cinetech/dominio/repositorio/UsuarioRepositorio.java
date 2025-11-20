package com.cinetech.dominio.repositorio;

import com.cinetech.dominio.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
    // Para login simples
    Optional<Usuario> findByEmailAndSenha(String email, String senha);
    // Para verificar se email já existe no cadastro
    boolean existsByEmail(String email);
}