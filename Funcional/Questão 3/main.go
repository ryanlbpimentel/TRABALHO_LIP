package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func lerString() string {
	buffer := bufio.NewReader(os.Stdin)
	texto, _ := buffer.ReadString('\n')
	return strings.TrimSpace(texto)
}

func converterParaInteiros(listaStr []string, indice int) []int {
	if indice >= len(listaStr) {
		return []int{}
	}
	num, _ := strconv.Atoi(listaStr[indice])
	return append([]int{num}, converterParaInteiros(listaStr, indice+1)...)
}

func contar(lista []int, x int) int {
	if len(lista) == 0 {
		return 0
	}

	if lista[0] == x {
		return 1 + contar(lista[1:], x)
	}

	return contar(lista[1:], x)
}

func contem(lista []int, x int) bool {
	if len(lista) == 0 {
		return false
	}

	if lista[0] == x {
		return true
	}

	return contem(lista[1:], x)
}

func filtrar(original []int, atual []int) []int {
	if len(atual) == 0 {
		return []int{}
	}

	if atual[0]%2 != 0 &&
		contar(original, atual[0]) >= 2 &&
		!contem(filtrar(original, atual[1:]), atual[0]) {

		return append([]int{atual[0]}, filtrar(original, atual[1:])...)
	}

	return filtrar(original, atual[1:])
}

func imprimir(lista []int) {
	if len(lista) == 0 {
		return
	}

	if len(lista) == 1 {
		fmt.Print(lista[0])
		return
	}

	fmt.Print(lista[0], " ")
	imprimir(lista[1:])
}

func main() {
	texto := lerString()
	listaStr := strings.Split(texto, " ")
	lista := converterParaInteiros(listaStr, 0)

	imprimir(filtrar(lista, lista))
}
