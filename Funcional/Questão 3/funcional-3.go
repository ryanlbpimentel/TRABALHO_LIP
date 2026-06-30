package main

import "fmt"

func ler(num int) []int {
	if num == 0 {
		return []int{}
	}

	var x int
	fmt.Scan(&x)

	return append([]int{x}, ler(num-1)...)
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
	var num int
	fmt.Scan(&num)

	lista := ler(num)

	imprimir(filtrar(lista, lista))
}