package com.cinetech.api;

import com.cinetech.dominio.modelo.Cartao;
import com.cinetech.dominio.modelo.Usuario;
import com.cinetech.dominio.repositorio.CartaoRepositorio;
import com.cinetech.dominio.repositorio.UsuarioRepositorio;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cartoes")
public class CartaoControlador {

    private final CartaoRepositorio cartaoRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;

    public CartaoControlador(CartaoRepositorio cartaoRepositorio, UsuarioRepositorio usuarioRepositorio) {
        this.cartaoRepositorio = cartaoRepositorio;
        this.usuarioRepositorio = usuarioRepositorio;
    }

    // DTO para receber os dados
    public record CartaoRequest(
        @NotNull Long usuarioId,
        @NotBlank String tipo,
        @NotBlank String numero,
        @NotBlank String nomeTitular,
        @NotBlank String validade,
        @NotBlank String cvv
    ) {}

    @GetMapping("/usuario/{usuarioId}")
    public List<Cartao> listarCartoes(@PathVariable Long usuarioId) {
        return cartaoRepositorio.findByUsuarioId(usuarioId);
    }

    @PostMapping
    // CORREÇÃO: SuppressWarnings adicionado para evitar aviso de "Null type safety" no request.usuarioId()
    @SuppressWarnings("null")
    public ResponseEntity<?> adicionarCartao(@RequestBody @Valid CartaoRequest request) {
        Usuario usuario = usuarioRepositorio.findById(request.usuarioId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        Cartao cartao = new Cartao();
        cartao.setUsuario(usuario);
        cartao.setTipo(request.tipo());
        cartao.setNumero(request.numero());
        cartao.setNomeTitular(request.nomeTitular().toUpperCase());
        cartao.setValidade(request.validade());
        cartao.setCvv(request.cvv());

        return ResponseEntity.ok(cartaoRepositorio.save(cartao));
    }
}