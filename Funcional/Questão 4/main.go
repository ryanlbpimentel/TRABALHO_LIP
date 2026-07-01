package main

import "fmt"

func ler(n int) []float64 {
	if n == 0 {
		return []float64{}
	}

	var x float64
	fmt.Scan(&x)

	return append([]float64{x}, ler(n-1)...)
}

func soma(lista []float64) float64 {
	if len(lista) == 0 {
		return 0
	}

	return lista[0] + soma(lista[1:])
}

func somaInversos(lista []float64) float64 {
	if len(lista) == 0 {
		return 0
	}

	return (1 / lista[0]) + somaInversos(lista[1:])
}

func tamanho(lista []float64) float64 {
	if len(lista) == 0 {
		return 0
	}

	return 1 + tamanho(lista[1:])
}

func main() {
	var n int
	fmt.Scan(&n)

	lista := ler(n)

	if len(lista) == 0 {
		fmt.Println("(0 0)")
		return
	}

	fmt.Printf("(%v %v)\n",
		soma(lista)/tamanho(lista),
		tamanho(lista)/somaInversos(lista))
}
