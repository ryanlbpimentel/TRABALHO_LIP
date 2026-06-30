% Questao 1 - Grafo de Cidades

% Arestas do grafo (nao orientado)
aresta(cidade1, cidade2).
aresta(cidade1, cidade3).
aresta(cidade2, cidade4).
aresta(cidade3, cidade4).
aresta(cidade3, cidade5).
aresta(cidade6, cidade7).

% cidade8 sera uma ilha (sem conexoes)

% Lista de todas as cidades do grafo
cidades([cidade1, cidade2, cidade3, cidade4, cidade5, cidade6, cidade7, cidade8]).

% 1. Verificar se duas cidades sao diretamente conectadas
conectado(X, Y) :- aresta(X, Y).
conectado(X, Y) :- aresta(Y, X).

% Predicados auxiliares
vizinhos(X, Vizinhos) :-
    findall(Y, conectado(X, Y), Vizinhos).

conta_vizinhos(X, N) :-
    vizinhos(X, Vizinhos),
    length(Vizinhos, N).

% 2. Verificar a cidade que possui a maior vizinhanca
maior_vizinhanca(Cidades, X) :-
    maior_vizinhanca_aux(Cidades, _, 0, X).

maior_vizinhanca_aux([], X, _, X).
maior_vizinhanca_aux([C|Resto], MelhorAtual, MaxAtual, Resultado) :-
    conta_vizinhos(C, N),
    (   N > MaxAtual
    ->  maior_vizinhanca_aux(Resto, C, N, Resultado)
    ;   maior_vizinhanca_aux(Resto, MelhorAtual, MaxAtual, Resultado)
    ).

% 3. Verificar se existe alguma ilha
verifica_ilha(Cidades, X) :-
    member(X, Cidades),
    vizinhos(X, []).