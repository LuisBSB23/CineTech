package com.cinetech.api;

import com.cinetech.dominio.modelo.Usuario;
import com.cinetech.dominio.repositorio.UsuarioRepositorio;
import com.cinetech.servico.ReservaServico; 
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthControlador {

    private final UsuarioRepositorio usuarioRepositorio;
    private final ReservaServico reservaServico; 

    public AuthControlador(UsuarioRepositorio usuarioRepositorio, ReservaServico reservaServico) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.reservaServico = reservaServico;
    }

    record LoginRequest(@NotBlank String email, @NotBlank String senha) {}
    record RegisterRequest(@NotBlank String nome, @NotBlank String email, @NotBlank String senha) {}
    record UpdateProfileRequest(@NotBlank String nome, @NotBlank String senha) {}
    record DeleteAccountRequest(@NotBlank String senha) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepositorio.findByEmailAndSenha(request.email, request.senha);
        
        if (usuarioOpt.isPresent()) {
            return ResponseEntity.ok(usuarioOpt.get());
        }
        return ResponseEntity.status(401).body("Credenciais inválidas.");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (usuarioRepositorio.existsByEmail(request.email)) {
            return ResponseEntity.badRequest().body("Email já cadastrado.");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(request.nome);
        novoUsuario.setEmail(request.email);
        novoUsuario.setSenha(request.senha);
        novoUsuario.setPerfil("USER");

        return ResponseEntity.ok(usuarioRepositorio.save(novoUsuario));
    }
    
    @PutMapping("/usuario/{id}")
    public ResponseEntity<?> atualizarPerfil(@PathVariable @NonNull Long id, @RequestBody UpdateProfileRequest request) {
        return usuarioRepositorio.findById(id).map(usuario -> {
            usuario.setNome(request.nome);
            if (request.senha != null && !request.senha.isEmpty()) {
                usuario.setSenha(request.senha);
            }
            return ResponseEntity.ok(usuarioRepositorio.save(usuario));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/usuario/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable @NonNull Long id, @RequestBody DeleteAccountRequest request) {
        return usuarioRepositorio.findById(id).map(usuario -> {
            if (!usuario.getSenha().equals(request.senha)) {
                return ResponseEntity.status(401).body("Senha incorreta.");
            }
            
            // 1. Limpa as dependências (reservas) antes
            reservaServico.gerenciarExclusaoUsuario(id);
            
            // 2. Agora deleta o usuário com segurança
            usuarioRepositorio.delete(usuario);
            
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}