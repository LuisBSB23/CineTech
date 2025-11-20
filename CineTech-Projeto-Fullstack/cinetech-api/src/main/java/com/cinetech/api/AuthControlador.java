package com.cinetech.api;

import com.cinetech.dominio.modelo.Usuario;
import com.cinetech.dominio.repositorio.UsuarioRepositorio;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthControlador {

    private final UsuarioRepositorio usuarioRepositorio;

    public AuthControlador(UsuarioRepositorio usuarioRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
    }

    record LoginRequest(@NotBlank String email, @NotBlank String senha) {}
    record RegisterRequest(@NotBlank String nome, @NotBlank String email, @NotBlank String senha) {}
    record UpdateProfileRequest(@NotBlank String nome, @NotBlank String senha) {}

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
        novoUsuario.setPerfil("USER"); // Padrão para novos cadastros

        return ResponseEntity.ok(usuarioRepositorio.save(novoUsuario));
    }
    
    @PutMapping("/usuario/{id}")
    public ResponseEntity<?> atualizarPerfil(@PathVariable Long id, @RequestBody UpdateProfileRequest request) {
        return usuarioRepositorio.findById(id).map(usuario -> {
            usuario.setNome(request.nome);
            if (request.senha != null && !request.senha.isEmpty()) {
                usuario.setSenha(request.senha);
            }
            return ResponseEntity.ok(usuarioRepositorio.save(usuario));
        }).orElse(ResponseEntity.notFound().build());
    }
}