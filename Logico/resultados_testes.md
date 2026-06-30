# Resultados dos Testes — Lista de Exercícios Prolog

---

## Questão 1 — Grafo de Cidades

**Arquivo:** `questao1.pl`

### Grafo utilizado

```
cidade1 --- cidade2
cidade1 --- cidade3
cidade2 --- cidade4
cidade3 --- cidade4
cidade3 --- cidade5
cidade6 --- cidade7
cidade8 (ilha - sem conexões)
```

### 1.1 Verificar conexão direta (`conectado/2`)

```prolog
?- conectado(cidade1, cidade2).
true.

?- conectado(cidade2, cidade1).
true.

?- conectado(cidade1, cidade4).
false.

?- conectado(cidade1, cidade8).
false.
```

### 1.2 Maior vizinhança (`maior_vizinhanca/2`)

```prolog
?- cidades(Cidades), maior_vizinhanca(Cidades, X).
X = cidade3.
```

> `cidade3` possui 3 vizinhos: cidade1, cidade4, cidade5.

### 1.3 Verificar ilhas (`verifica_ilha/2`)

```prolog
?- cidades(Cidades), verifica_ilha(Cidades, X).
X = cidade8.
```

> `cidade8` não possui nenhuma conexão com outras cidades.

---

## Questão 2 — Predicados sobre Listas

**Arquivo:** `questao2.pl`

> Todos os predicados foram implementados **sem utilizar o módulo `lists`** do SWI-Prolog.
> A saída segue o formato separado por espaços (`1 2 3`) conforme as instruções de Questões Funcionais.

### 2.1 `adiciona_inicio/3`

**Entrada:** elemento `1`, lista `2 3`
**Saída:**
```
1 2 3
```

### 2.2 `remove_elemento/3`

**Entrada:** elemento `2`, lista `1 2 3 2`
**Saída:**
```
1 3 2
```

> Remove apenas a **primeira ocorrência** do elemento 2.

### 2.3 `junta_listas/3`

**Entrada:** lista1 `1 2`, lista2 `3 4`
**Saída:**
```
1 2 3 4
```

### 2.4 `pertence/2`

**Entrada:** elemento `3`, lista `1 2 3`
**Saída:**
```
true
```

**Entrada:** elemento `5`, lista `1 2 3`
**Saída:**
```
false
```

### 2.5 `tamanho/2`

**Entrada:** lista `1 2 3 4`
**Saída:**
```
4
```

---

## Questão 3 — Família Oliveira

**Arquivo:** `questao3.pl`

### Árvore Genealógica

```
        Roberto ─── Carla
        /              \
    Lucas              Marina
      |                  |
    Pedro              Sofia
        \              /
         ── Daniel ──
```

### 3.1 Relações de progenitor (`progenitor/2`)

```prolog
?- progenitor(roberto, lucas).
true.

?- progenitor(carla, marina).
true.

?- progenitor(lucas, pedro).
true.

?- progenitor(marina, sofia).
true.

?- progenitor(pedro, daniel).
true.

?- progenitor(sofia, daniel).
true.
```

### 3.2 Gênero (`masculino/1`, `feminino/1`)

```prolog
?- masculino(roberto).
true.

?- feminino(carla).
true.

?- masculino(marina).
false.
```

### 3.3 Pai e Mãe (`pai/2`, `mae/2`)

```prolog
?- pai(roberto, lucas).
true.

?- mae(carla, lucas).
true.

?- pai(lucas, pedro).
true.

?- mae(marina, sofia).
true.
```

### 3.4 Irmão e Irmã (`irmao/2`, `irma/2`)

```prolog
?- irmao(lucas, marina).
true.

?- irma(marina, lucas).
true.
```

### 3.5 Avô e Avó (`avou/2`, `avo/2`)

```prolog
?- avou(roberto, pedro).
true.

?- avo(carla, pedro).
true.

?- avou(roberto, sofia).
true.

?- avo(carla, sofia).
true.
```

### 3.6 Tio e Tia (`tio/2`, `tia/2`)

```prolog
?- tio(lucas, sofia).
true.

?- tia(marina, pedro).
true.
```

### 3.7 Primo e Prima (`primo/2`, `prima/2`)

```prolog
?- primo(pedro, sofia).
true.

?- prima(sofia, pedro).
true.
```

### 3.8 Descendente (`descendente/2`)

```prolog
?- descendente(daniel, roberto).
true.

?- descendente(pedro, carla).
true.

?- descendente(daniel, carla).
true.

?- descendente(roberto, daniel).
false.
```

> Daniel descende de Roberto (bisneto), Pedro descende de Carla (neto), mas Roberto **não** descende de Daniel.

---

## Resumo

| Questão | Arquivo | Testes | Formato Saída | Status |
|---------|---------|--------|---------------|--------|
| Q1 — Grafo de Cidades | `questao1.pl` | 6 consultas | Prolog | ✅ Todos passaram |
| Q2 — Listas | `questao2.pl` | 6 consultas | Separado por espaços | ✅ Todos passaram |
| Q3 — Família Oliveira | `questao3.pl` | 20 consultas | Prolog | ✅ Todos passaram |

**Total: 32 consultas executadas — 32 corretas ✅**
