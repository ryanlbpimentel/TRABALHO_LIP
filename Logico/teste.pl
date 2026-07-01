:- initialization(main).

main :-
    write('========================================'), nl,
    write('  TESTE QUESTAO 1 - Grafo de Cidades'), nl,
    write('========================================'), nl, nl,

    (conectado(cidade1, cidade2) -> write('conectado(cidade1, cidade2) = true') ; write('conectado(cidade1, cidade2) = false')), nl,
    (conectado(cidade2, cidade1) -> write('conectado(cidade2, cidade1) = true') ; write('conectado(cidade2, cidade1) = false')), nl,
    (conectado(cidade1, cidade4) -> write('conectado(cidade1, cidade4) = true') ; write('conectado(cidade1, cidade4) = false')), nl,
    (conectado(cidade1, cidade8) -> write('conectado(cidade1, cidade8) = true') ; write('conectado(cidade1, cidade8) = false')), nl, nl,

    cidades(Cidades),
    (maior_vizinhanca(Cidades, MaiorCidade) ->
        (write('maior_vizinhanca = '), write(MaiorCidade))
    ;   write('Nao encontrada')), nl, nl,

    (verifica_ilha(Cidades, Ilha) ->
        (write('Ilha encontrada: '), write(Ilha))
    ;   write('Nenhuma ilha encontrada')), nl, nl,

    write('========================================'), nl,
    write('  TESTE QUESTAO 2 - Listas'), nl,
    write('  (saida em formato separado por espacos)'), nl,
    write('========================================'), nl, nl,

    adiciona_inicio(1, [2,3], L2a),
    escrever_lista(L2a), nl,

    remove_elemento(2, [1,2,3,2], L2b),
    escrever_lista(L2b), nl,

    junta_listas([1,2], [3,4], L3),
    escrever_lista(L3), nl,

    (pertence(3, [1,2,3]) -> write('true') ; write('false')), nl,
    (pertence(5, [1,2,3]) -> write('true') ; write('false')), nl, nl,

    tamanho(N, [1,2,3,4]),
    write(N), nl, nl,

    write('========================================'), nl,
    write('  TESTE QUESTAO 3 - Familia Oliveira'), nl,
    write('========================================'), nl, nl,

    (progenitor(roberto, lucas) -> write('progenitor(roberto, lucas) = true') ; write('false')), nl,
    (progenitor(carla, marina) -> write('progenitor(carla, marina) = true') ; write('false')), nl,
    (progenitor(lucas, pedro) -> write('progenitor(lucas, pedro) = true') ; write('false')), nl,
    (progenitor(marina, sofia) -> write('progenitor(marina, sofia) = true') ; write('false')), nl,
    (progenitor(pedro, daniel) -> write('progenitor(pedro, daniel) = true') ; write('false')), nl,
    (progenitor(sofia, daniel) -> write('progenitor(sofia, daniel) = true') ; write('false')), nl, nl,

    (masculino(roberto) -> write('masculino(roberto) = true') ; write('false')), nl,
    (feminino(carla) -> write('feminino(carla) = true') ; write('false')), nl,
    (masculino(marina) -> write('masculino(marina) = true') ; write('masculino(marina) = false')), nl, nl,

    (pai(roberto, lucas) -> write('pai(roberto, lucas) = true') ; write('false')), nl,
    (mae(carla, lucas) -> write('mae(carla, lucas) = true') ; write('false')), nl,
    (pai(lucas, pedro) -> write('pai(lucas, pedro) = true') ; write('false')), nl,
    (mae(marina, sofia) -> write('mae(marina, sofia) = true') ; write('false')), nl, nl,

    (irmao(lucas, marina) -> write('irmao(lucas, marina) = true') ; write('irmao(lucas, marina) = false')), nl,
    (irma(marina, lucas) -> write('irma(marina, lucas) = true') ; write('irma(marina, lucas) = false')), nl, nl,

    (avou(roberto, pedro) -> write('avou(roberto, pedro) = true') ; write('false')), nl,
    (avo(carla, pedro) -> write('avo(carla, pedro) = true') ; write('false')), nl,
    (avou(roberto, sofia) -> write('avou(roberto, sofia) = true') ; write('false')), nl,
    (avo(carla, sofia) -> write('avo(carla, sofia) = true') ; write('false')), nl, nl,

    (tio(lucas, sofia) -> write('tio(lucas, sofia) = true') ; write('tio(lucas, sofia) = false')), nl,
    (tia(marina, pedro) -> write('tia(marina, pedro) = true') ; write('tia(marina, pedro) = false')), nl, nl,

    (primo(pedro, sofia) -> write('primo(pedro, sofia) = true') ; write('primo(pedro, sofia) = false')), nl,
    (prima(sofia, pedro) -> write('prima(sofia, pedro) = true') ; write('prima(sofia, pedro) = false')), nl, nl,

    (descendente(daniel, roberto) -> write('descendente(daniel, roberto) = true') ; write('false')), nl,
    (descendente(pedro, carla) -> write('descendente(pedro, carla) = true') ; write('false')), nl,
    (descendente(daniel, carla) -> write('descendente(daniel, carla) = true') ; write('false')), nl,
    (descendente(roberto, daniel) -> write('descendente(roberto, daniel) = true') ; write('descendente(roberto, daniel) = false')), nl, nl,

    write('========================================'), nl,
    write('  TODOS OS TESTES FINALIZADOS'), nl,
    write('========================================'), nl,
    halt.
