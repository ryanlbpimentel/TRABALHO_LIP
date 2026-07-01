adiciona_inicio(X, L1, [X|L1]).

remove_elemento(_, [], []).
remove_elemento(X, [X|Resto], Resto) :- !.
remove_elemento(X, [H|T], [H|R]) :-
    remove_elemento(X, T, R).

junta_listas([], L2, L2).
junta_listas([H|T], L2, [H|R]) :-
    junta_listas(T, L2, R).

pertence(X, [X|_]).
pertence(X, [_|T]) :-
    pertence(X, T).

tamanho(0, []).
tamanho(N, [_|T]) :-
    tamanho(N1, T),
    N is N1 + 1.

ler_linha(Linha) :-
    read_line_to_string(user_input, Linha).

string_para_lista(Str, Lista) :-
    split_string(Str, " ", " ", Partes),
    maplist(atom_number_str, Partes, Lista).

atom_number_str(S, N) :-
    number_string(N, S).

escrever_lista([]) :- nl.
escrever_lista([X]) :- write(X), nl.
escrever_lista([X|T]) :-
    T \== [],
    write(X), write(' '),
    escrever_lista(T).
