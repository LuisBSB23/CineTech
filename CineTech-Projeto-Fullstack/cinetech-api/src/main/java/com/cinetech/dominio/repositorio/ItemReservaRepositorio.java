package com.cinetech.dominio.repositorio;

import com.cinetech.dominio.modelo.ItemReserva;
import com.cinetech.dominio.modelo.StatusReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemReservaRepositorio extends JpaRepository<ItemReserva, Long> {
    
    Optional<ItemReserva> findByReservaIdAndSessaoId(Long reservaId, Long sessaoId);

    // NOVO: Busca itens de uma sessão específica que pertençam a reservas CONFIRMADAS
    // Isso serve para pintar os assentos de vermelho no mapa
    List<ItemReserva> findBySessaoIdAndReservaStatus(Long sessaoId, StatusReserva status);
}