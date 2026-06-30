% Questao 3 - Familia Oliveira

% Parte A - Relacoes de progenitor
progenitor(roberto, lucas).
progenitor(roberto, marina).
progenitor(carla, lucas).
progenitor(carla, marina).
progenitor(lucas, pedro).
progenitor(marina, sofia).
progenitor(pedro, daniel).
progenitor(sofia, daniel).

% Parte B - Predicados

% masculino(X)
masculino(roberto).
masculino(lucas).
masculino(pedro).
masculino(daniel).

% feminino(X)
feminino(carla).
feminino(marina).
feminino(sofia).

% irmao(X, Y) - X e irmao de Y
irmao(X, Y) :-
    masculino(X),
    progenitor(P, X),
    progenitor(P, Y),
    X \== Y.

% irma(X, Y) - X e irma de Y
irma(X, Y) :-
    feminino(X),
    progenitor(P, X),
    progenitor(P, Y),
    X \== Y.

% pai(X, Y) - X e pai de Y
pai(X, Y) :-
    masculino(X),
    progenitor(X, Y).

% mae(X, Y) - X e mae de Y
mae(X, Y) :-
    feminino(X),
    progenitor(X, Y).

% avou(X, Y) - X e avo (masculino) de Y
avou(X, Y) :-
    masculino(X),
    progenitor(X, Z),
    progenitor(Z, Y).

% avo(X, Y) - X e avo (feminino) de Y
avo(X, Y) :-
    feminino(X),
    progenitor(X, Z),
    progenitor(Z, Y).

% tio(X, Y) - X e tio de Y
tio(X, Y) :-
    masculino(X),
    progenitor(P, Y),
    irmao(X, P).

% tia(X, Y) - X e tia de Y
tia(X, Y) :-
    feminino(X),
    progenitor(P, Y),
    irma(X, P).

% primo(X, Y) - X e primo de Y
primo(X, Y) :-
    masculino(X),
    progenitor(PX, X),
    progenitor(PY, Y),
    irmao(PX, PY),
    X \== Y.
primo(X, Y) :-
    masculino(X),
    progenitor(PX, X),
    progenitor(PY, Y),
    irma(PX, PY),
    X \== Y.

% prima(X, Y) - X e prima de Y
prima(X, Y) :-
    feminino(X),
    progenitor(PX, X),
    progenitor(PY, Y),
    irmao(PX, PY),
    X \== Y.
prima(X, Y) :-
    feminino(X),
    progenitor(PX, X),
    progenitor(PY, Y),
    irma(PX, PY),
    X \== Y.

% descendente(X, Y) - X descende de Y
descendente(X, Y) :-
    progenitor(Y, X).
descendente(X, Y) :-
    progenitor(Z, X),
    descendente(Z, Y).
