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

func soma(num int) int {
	if num == 0 {
		return 0
	}
	return num + soma(num-1)
}

func main() {
	texto := lerString()
	num, _ := strconv.Atoi(texto)

	fmt.Println(soma(num))
}
