---
title: "Collection 함수_Part1"

categories:
  - Kotlin
tags:
  - Collection 
  - 함수
  - 람다함수
---

# Collection 함수
 지금까지는 컬렉션에 포함된 아이템들을 for문을 사용하여 하나하나 꺼내어 사용하였다. 하지만 코틀린은 함수형 언어의 특징을 가지고 있기 때문에 컬렉션 함수 사용하여 좀 더 편리하게 컬렉션 사용이 가능하다.

## 정의
- 컬렉션에 사용할 수 있는 여러가지 유용한 함수들
- 컬렉션 또는 베열에 일반 함수 또는 람다 함수 형태를 사용하여 for 문 없이도 아이템을 순회하며 참조하거나 조건을 걸고 구조의 변경까지 가능한 여러가지 함수 지칭

## 종류
1. forEach
   - **collection.forEach{println(it)}**: 중괄호 안에서 컬렉션에 포함된 모든 아이템을 it이라는 변수로 순서대로 참조 가능
2. filter
   - forEach는 단순히 반복만 하는 함수, filter로 조건을 걸 수 있다.
   - **collection.filter{it<4}**: 조건에 맞는 데이터만 컬렉션으로 만들어서 반환
3. map
   - **collection.map { it*2 }**: 중괄호 안에서 it에 수식을 적용하여 값을 변경한 데이터를 컬렉션으로 만들어서 반환 (일괄적으로 값 변경)
4. any, all, none
   - **collection.any{it==0}** : 하나라도 조건에 맞으면 true
   - **collection.all{it==0}** : 모두 조건에 맞으면 true
   - **collection.none{it==0}** : 하나도 조건에 맞지 않으면 true
5. first, last
   - 일반함수로 사용 - **collection.first()**: 컬렉션의 첫번째 아이템 반환
   - 람다함수로 사용 - **collection.first{it>3}**: 조건에 맞는 첫번째 아이템 반환
   - last도 마찬가지이며 마지막 아이템 반환
   - first -> find, last -> findLast 함수로 대체 가능
   - 조건에 맞는 객체가 없는 경우: NoSuchElementException 발생 --> **firstOrNull, lastOrNull** 사용하면 객체가 없을 경우 null 반환
6. count
- **collection.count()**: 컬레션의 모든 아이템의 개수 반환
- **collection.count{it>7}**: 조건에 맞는 아이템의 개수 반환

---
  
Set을 이용한 코드를 확인해보자.
```kotlin
fun main(){
    
    val nameList = listOf("Betty", "Cindy", "Amily", "Happy", "Bome")
    
    nameList.forEach{
        print(it+" ")
    } // Betty Cindy Amily Happy Bome 
    println()
    
    println(nameList.filter{
        it.startsWith("B")
    }) // [Betty, Bome]
    
    println(nameList.map{
        "name: "+ it
    }) // [name: Betty, name: Cindy, name: Amily, name: Happy, name: Bome]
    
    println(nameList.any{it =="Cindy"}) // true
    println(nameList.all{it.length==3}) // false
    println(nameList.none{it.startsWith("A")}) // false
    
    println(nameList.first{it.startsWith("A")}) // Amily
    println(nameList.last{it.startsWith("B")}) //Bome
    println(nameList.count{it.contains("e")}) // 2
    
}

```  
  
### 참고사항
컬렉션 함수는 람다함수를 사용하여 컬렉션을 좀 더 편리하게 조작할 수 있는 함수로, 경우에 따라 반복문과 조건문 대신 사용하면 매우 편리하다.