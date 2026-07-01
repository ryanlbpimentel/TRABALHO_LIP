aresta(cidade1, cidade2).
aresta(cidade1, cidade3).
aresta(cidade2, cidade4).
aresta(cidade3, cidade4).
aresta(cidade3, cidade5).
aresta(cidade6, cidade7).

cidades([cidade1, cidade2, cidade3, cidade4, cidade5, cidade6, cidade7, cidade8]).

conectado(X, Y) :- aresta(X, Y).
conectado(X, Y) :- aresta(Y, X).

vizinhos(X, Vizinhos) :-
    findall(Y, conectado(X, Y), Vizinhos).

conta_vizinhos(X, N) :-
    vizinhos(X, Vizinhos),
    length(Vizinhos, N).

maior_vizinhanca(Cidades, X) :-
    maior_vizinhanca_aux(Cidades, _, 0, X).

maior_vizinhanca_aux([], X, _, X).
maior_vizinhanca_aux([C|Resto], MelhorAtual, MaxAtual, Resultado) :-
    conta_vizinhos(C, N),
    (   N > MaxAtual
    ->  maior_vizinhanca_aux(Resto, C, N, Resultado)
    ;   maior_vizinhanca_aux(Resto, MelhorAtual, MaxAtual, Resultado)
    ).

verifica_ilha(Cidades, X) :-
    member(X, Cidades),
    vizinhos(X, []).