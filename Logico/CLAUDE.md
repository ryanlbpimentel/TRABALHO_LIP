# Lista de Exercícios — Prolog

## Instruções Gerais

- Cada questão de lógica deve estar em um arquivo separado.
- As questões de lógica serão corrigidas automaticamente.
- Utilize exatamente os nomes dos predicados especificados.
- Não altere a quantidade de argumentos dos predicados.
- Predicados auxiliares podem ser criados.

### Questões Funcionais

- Toda entrada deve ser lida da entrada padrão (teclado).
- A única saída deve ser o resultado solicitado.
- Não imprima mensagens como:
  - "Digite a entrada"
  - "A saída é"
  - ou qualquer outro texto adicional.
- Se a entrada for uma lista numérica, ela será fornecida no formato:

```text
1 2 3
```

e não:

```text
[1,2,3]
```

- A saída deve respeitar exatamente o formato exigido.

### Questões Prolog

- Implemente os predicados utilizando exatamente os nomes fornecidos.
- Não altere o nome dos predicados principais.
- Não altere o número de argumentos dos predicados.
- Predicados auxiliares podem ser criados livremente.

---

# Questão 1 — Grafo de Cidades

Utilizando Prolog, implemente um grafo simples não orientado representando conexões entre cidades.

Utilize os nomes:

- cidade1
- cidade2
- cidade3
- ...

O sistema deve permitir as seguintes consultas:

## 1. Verificar se duas cidades são diretamente conectadas

Exemplo:

```prolog
?- conectado(cidade1, cidade2).
```

## 2. Verificar a cidade que possui a maior vizinhança

Onde:

- `Cidades` representa a lista de cidades do grafo.
- `X` representa a cidade conectada ao maior número de cidades.

Exemplo:

```prolog
?- maior_vizinhanca(Cidades, X).
```

## 3. Verificar se existe alguma ilha

Uma ilha é uma cidade que não possui nenhuma conexão com outras cidades.

Onde:

- `Cidades` representa a lista de cidades do grafo.
- `X` representa uma cidade sem vizinhos, caso exista.

Exemplo:

```prolog
?- verifica_ilha(Cidades, X).
```

---

# Questão 2 — Predicados sobre Listas

Implemente os seguintes predicados genéricos sobre listas **sem utilizar o módulo `lists` do SWI-Prolog**.

## Predicados

### adiciona_inicio(X, L1, L2)

`L2` é a lista `L1` com o elemento `X` inserido no início.

Exemplo:

```prolog
?- adiciona_inicio(1, [2,3], L2).
L2 = [1,2,3].
```

### remove_elemento(X, L1, L2)

`L2` recebe `L1` com a remoção da primeira ocorrência de `X`.

Exemplo:

```prolog
?- remove_elemento(2, [1,2,3,2], L2).
L2 = [1,3,2].
```

### junta_listas(L1, L2, L3)

`L3` recebe a concatenação das listas `L1` e `L2`.

Exemplo:

```prolog
?- junta_listas([1,2], [3,4], L3).
L3 = [1,2,3,4].
```

### pertence(X, L)

Verifica se o elemento `X` pertence à lista `L`.

Exemplo:

```prolog
?- pertence(3, [1,2,3]).
true.
```

### tamanho(N, L)

`N` é a quantidade de elementos da lista `L`.

Exemplo:

```prolog
?- tamanho(N, [1,2,3,4]).
N = 4.
```

---

# Questão 3 — Família Oliveira

Implemente um programa em Prolog sobre a seguinte família fictícia.

## Registros da Família

- Roberto e Carla são pais de Lucas e Marina.
- Lucas é pai de Pedro.
- Marina é mãe de Sofia.
- Pedro e Sofia tiveram um filho chamado Daniel.

## Parte A

Utilizando o predicado:

```prolog
progenitor(X, Y)
```

represente todas as relações de progenitor da família.

## Parte B

Implemente os seguintes predicados:

### masculino(X)

Verdadeiro se `X` for masculino.

### feminino(X)

Verdadeiro se `X` for feminino.

### irmao(X, Y)

`X` é irmão de `Y`.

### irma(X, Y)

`X` é irmã de `Y`.

### pai(X, Y)

`X` é pai de `Y`.

### mae(X, Y)

`X` é mãe de `Y`.

### avou(X, Y)

`X` é avô de `Y`.

### avo(X, Y)

`X` é avó de `Y`.

### tio(X, Y)

`X` é tio de `Y`.

### tia(X, Y)

`X` é tia de `Y`.

### primo(X, Y)

`X` é primo de `Y`.

### prima(X, Y)

`X` é prima de `Y`.

### descendente(X, Y)

`X` descende de `Y`.