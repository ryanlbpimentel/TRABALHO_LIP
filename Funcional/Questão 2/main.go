package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func contem(lista []string, val string, start int, end int) bool {
	if start >= end {
		return false
	}
	if lista[start] == val {
		return true
	}
	return contem(lista, val, start+1, end)
}

func encontrarRepetidos(lista []string, index int) string {
	if index >= len(lista) {
		return ""
	}

	val := lista[index]
	jaVisto := contem(lista, val, 0, index)
	repeteDepois := contem(lista, val, index+1, len(lista))
	resto := encontrarRepetidos(lista, index+1)

	if !jaVisto && repeteDepois {
		if resto == "" {
			return val
		}
		return val + " " + resto
	}

	return resto
}

func lerString() string {
	buffer := bufio.NewReader(os.Stdin)
	texto, _ := buffer.ReadString('\n')
	return strings.TrimSpace(texto)
}

func main() {
	texto := lerString()

	lista := strings.Split(texto, " ")
	fmt.Print(encontrarRepetidos(lista, 0), "\n")
}