package com.cinetech.excecao;

/**
 * Exceção customizada para o Domínio do CineTech.
 * Baseada na 'EstoqueInsuficienteException.java' [cite: 3] do projeto original.
 * * É uma RuntimeException para que, quando lançada em um método @Transactional,
 * o Spring Boot realize o rollback automático da transação (RNF-004) [cite: 2].
 */
public class AssentosEsgotadosExcecao extends RuntimeException {

    /**
     * Construtor que recebe a mensagem de erro.
     * @param mensagem A mensagem detalhando a falha.
     */
    public AssentosEsgotadosExcecao(String mensagem) {
        super(mensagem);
    }
}