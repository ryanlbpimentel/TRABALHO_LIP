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

func converterParaFloats(listaStr []string, indice int) []float64 {
	if indice >= len(listaStr) || listaStr[indice] == "" {
		return []float64{}
	}
	num, _ := strconv.ParseFloat(listaStr[indice], 64)
	return append([]float64{num}, converterParaFloats(listaStr, indice+1)...)
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
	texto := lerString()
	listaStr := strings.Split(texto, " ")

	if len(listaStr) == 1 && listaStr[0] == "" {
		fmt.Println("0 0")
		return
	}

	lista := converterParaFloats(listaStr, 0)

	if len(lista) == 0 {
		fmt.Println("0 0")
		return
	}

	fmt.Printf("%v %v\n",
		soma(lista)/tamanho(lista),
		tamanho(lista)/somaInversos(lista))
}
