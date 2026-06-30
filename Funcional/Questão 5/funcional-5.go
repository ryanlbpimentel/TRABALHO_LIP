package main

import "fmt"

func soma(num int) int {
	if num == 0 {
		return 0
	}
	return num + soma(num-1)
}
//go run funcional-5.go
func main() {
	var num int
	fmt.Scan(&num)

	fmt.Println(soma(num))
}