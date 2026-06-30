% Script de teste para todas as questoes

:- initialization(main).

main :-
    write('========================================'), nl,
    write('  TESTE QUESTAO 1 - Grafo de Cidades'), nl,
    write('========================================'), nl, nl,

    % Teste 1.1 - Verificar conexao direta
    write('--- 1.1 Verificar conexao direta ---'), nl,
    (conectado(cidade1, cidade2) -> write('conectado(cidade1, cidade2) = true') ; write('conectado(cidade1, cidade2) = false')), nl,
    (conectado(cidade2, cidade1) -> write('conectado(cidade2, cidade1) = true') ; write('conectado(cidade2, cidade1) = false')), nl,
    (conectado(cidade1, cidade4) -> write('conectado(cidade1, cidade4) = true') ; write('conectado(cidade1, cidade4) = false')), nl,
    (conectado(cidade1, cidade8) -> write('conectado(cidade1, cidade8) = true') ; write('conectado(cidade1, cidade8) = false')), nl, nl,

    % Teste 1.2 - Maior vizinhanca
    write('--- 1.2 Maior vizinhanca ---'), nl,
    cidades(Cidades),
    (maior_vizinhanca(Cidades, MaiorCidade) ->
        (write('maior_vizinhanca = '), write(MaiorCidade))
    ;   write('Nao encontrada')), nl, nl,

    % Teste 1.3 - Verificar ilhas
    write('--- 1.3 Verificar ilhas ---'), nl,
    (verifica_ilha(Cidades, Ilha) ->
        (write('Ilha encontrada: '), write(Ilha))
    ;   write('Nenhuma ilha encontrada')), nl, nl,

    write('========================================'), nl,
    write('  TESTE QUESTAO 2 - Listas'), nl,
    write('  (saida em formato separado por espacos)'), nl,
    write('========================================'), nl, nl,

    % Teste 2.1 - adiciona_inicio
    write('--- 2.1 adiciona_inicio(1, [2,3], L2) ---'), nl,
    adiciona_inicio(1, [2,3], L2a),
    escrever_lista(L2a), nl,

    % Teste 2.2 - remove_elemento
    write('--- 2.2 remove_elemento(2, [1,2,3,2], L2) ---'), nl,
    remove_elemento(2, [1,2,3,2], L2b),
    escrever_lista(L2b), nl,

    % Teste 2.3 - junta_listas
    write('--- 2.3 junta_listas([1,2], [3,4], L3) ---'), nl,
    junta_listas([1,2], [3,4], L3),
    escrever_lista(L3), nl,

    % Teste 2.4 - pertence
    write('--- 2.4 pertence ---'), nl,
    (pertence(3, [1,2,3]) -> write('true') ; write('false')), nl,
    (pertence(5, [1,2,3]) -> write('true') ; write('false')), nl, nl,

    % Teste 2.5 - tamanho
    write('--- 2.5 tamanho(N, [1,2,3,4]) ---'), nl,
    tamanho(N, [1,2,3,4]),
    write(N), nl, nl,

    write('========================================'), nl,
    write('  TESTE QUESTAO 3 - Familia Oliveira'), nl,
    write('========================================'), nl, nl,

    % Teste 3.1 - progenitor
    write('--- 3.1 progenitor ---'), nl,
    (progenitor(roberto, lucas) -> write('progenitor(roberto, lucas) = true') ; write('false')), nl,
    (progenitor(carla, marina) -> write('progenitor(carla, marina) = true') ; write('false')), nl,
    (progenitor(lucas, pedro) -> write('progenitor(lucas, pedro) = true') ; write('false')), nl,
    (progenitor(marina, sofia) -> write('progenitor(marina, sofia) = true') ; write('false')), nl,
    (progenitor(pedro, daniel) -> write('progenitor(pedro, daniel) = true') ; write('false')), nl,
    (progenitor(sofia, daniel) -> write('progenitor(sofia, daniel) = true') ; write('false')), nl, nl,

    % Teste 3.2 - masculino / feminino
    write('--- 3.2 masculino / feminino ---'), nl,
    (masculino(roberto) -> write('masculino(roberto) = true') ; write('false')), nl,
    (feminino(carla) -> write('feminino(carla) = true') ; write('false')), nl,
    (masculino(marina) -> write('masculino(marina) = true') ; write('masculino(marina) = false')), nl, nl,

    % Teste 3.3 - pai / mae
    write('--- 3.3 pai / mae ---'), nl,
    (pai(roberto, lucas) -> write('pai(roberto, lucas) = true') ; write('false')), nl,
    (mae(carla, lucas) -> write('mae(carla, lucas) = true') ; write('false')), nl,
    (pai(lucas, pedro) -> write('pai(lucas, pedro) = true') ; write('false')), nl,
    (mae(marina, sofia) -> write('mae(marina, sofia) = true') ; write('false')), nl, nl,

    % Teste 3.4 - irmao / irma
    write('--- 3.4 irmao / irma ---'), nl,
    (irmao(lucas, marina) -> write('irmao(lucas, marina) = true') ; write('irmao(lucas, marina) = false')), nl,
    (irma(marina, lucas) -> write('irma(marina, lucas) = true') ; write('irma(marina, lucas) = false')), nl, nl,

    % Teste 3.5 - avou / avo
    write('--- 3.5 avou / avo ---'), nl,
    (avou(roberto, pedro) -> write('avou(roberto, pedro) = true') ; write('false')), nl,
    (avo(carla, pedro) -> write('avo(carla, pedro) = true') ; write('false')), nl,
    (avou(roberto, sofia) -> write('avou(roberto, sofia) = true') ; write('false')), nl,
    (avo(carla, sofia) -> write('avo(carla, sofia) = true') ; write('false')), nl, nl,

    % Teste 3.6 - tio / tia
    write('--- 3.6 tio / tia ---'), nl,
    (tio(lucas, sofia) -> write('tio(lucas, sofia) = true') ; write('tio(lucas, sofia) = false')), nl,
    (tia(marina, pedro) -> write('tia(marina, pedro) = true') ; write('tia(marina, pedro) = false')), nl, nl,

    % Teste 3.7 - primo / prima
    write('--- 3.7 primo / prima ---'), nl,
    (primo(pedro, sofia) -> write('primo(pedro, sofia) = true') ; write('primo(pedro, sofia) = false')), nl,
    (prima(sofia, pedro) -> write('prima(sofia, pedro) = true') ; write('prima(sofia, pedro) = false')), nl, nl,

    % Teste 3.8 - descendente
    write('--- 3.8 descendente ---'), nl,
    (descendente(daniel, roberto) -> write('descendente(daniel, roberto) = true') ; write('false')), nl,
    (descendente(pedro, carla) -> write('descendente(pedro, carla) = true') ; write('false')), nl,
    (descendente(daniel, carla) -> write('descendente(daniel, carla) = true') ; write('false')), nl,
    (descendente(roberto, daniel) -> write('descendente(roberto, daniel) = true') ; write('descendente(roberto, daniel) = false')), nl, nl,

    write('========================================'), nl,
    write('  TODOS OS TESTES FINALIZADOS'), nl,
    write('========================================'), nl,
    halt.
