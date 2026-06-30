package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func somaPares(lista []string, indice int) int {
	if indice >= len(lista) {
		return 0
	}

	num, _ := strconv.Atoi(lista[indice])

	if num%2 == 0 {
		return num + somaPares(lista, indice+1)
	}
	return somaPares(lista, indice+1)
}

func lerString() string {
	buffer := bufio.NewReader(os.Stdin)
	texto, _ := buffer.ReadString('\n')
	return strings.TrimSpace(texto)
}

func main() {
	texto := lerString()

	lista := strings.Split(texto, " ")
	fmt.Print(somaPares(lista, 0), "\n")
}
