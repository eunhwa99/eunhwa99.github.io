---
title: "다양한 함수적 기능"

categories:
  - Kotlin
tags:
  - overloading
  - arguments
  - infix
---

# 다양한 함수 기능

## Overloading
- 같은 스코프 내에서 같은 이름의 함수를 여러개 만들 수 있는 기능으로, 이 때 parameter는 달라야 한다.
- 즉, 이름이 같더라도 parameter 개수가 다르거나 자료형이 다르면 서로 다른 함수로 동작 가능


```kotlin
fun read(x: Int){
    println("숫자 $x 입니다.")
}
fun read(x: String){
    println(x)
}

fun main(){
   read(7) // 숫자 7 입니다. 
   read("funny") // funny
    
}

```  
  
## Arguments
1. **default arguments**
- 패러미터를 받아야 하는 함수이지만 별다른 패러미터가 없더라도 **기본값**으로 동작해야 할 때 사용
2. **named arguments**
- 패러미터의 **순서와 관계없이** 패러미터의 이름을 사용하여 직접 패러미터의 값을 할당하는 기능 연산자
3. **variable number of arguments (vararg)**
- 같은 자료형을 **개수에 상관없이** 패러미터로 받고 싶을 때 사용
- 개수가 지정되지 않은 패러미터이므로, 다른 패러미터와 사용할 때는 **반드시** 마지막에 위치해야 한다.
    - fun sample(text: String, vararg x: Int)


```kotlin
fun deliveryItem(name: String, count: Int = 1, destination: String = "집"){
    println("${name}, ${count}개를 ${destination}에 배달하였습니다.")
}

// variable number of arguments
fun sum(vararg numbers: Int){
    var sum = 0
    
    for(n in numbers){
        sum +=n
    }
    
    println(sum)
}

fun main(){
   deliveryItem("피자") // 피자, 1개를 집에 배달하였습니다.
   deliveryItem("햄버거",2) // 햄버거, 2개를 집에 배달하였습니다.
   deliveryItem("책", 3, "사무실") // 책, 3개를 사무실에 배달하였습니다.
    
   deliveryItem("선물", destination = "친구집") // 선물, 1개를 친구집에 배달하였습니다.
    
   sum(1, 2, 3, 4) // 10
}

```  

## infix function
- 마치 연산자처럼 쓸 수 있는 함수
- infix 함수가 적용될 **자료형.함수이름** 으로 사용

```kotlin

infix fun Int.multiply(x: Int): Int = this*x

fun main(){
   
    print(2 multiply 4) // 2가 infix 함수가 적용되는 객체 자신(this), 4가 parameter인 X 
	print(2.multiply(4)) // 일반적인 클래스의 함수처럼 사용 가능
}

```

