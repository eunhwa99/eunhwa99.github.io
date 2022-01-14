---
title: "Collection 함수_Part2"

categories:
  - Kotlin
tags:
  - Collection 
  - 함수
  - 람다함수
---

# Collection 함수 
 *Collection 함수_Part1* 에서 다룬 함수보다 좀 더 복잡한 기능을 가지는 Collection 함수에 대한 내용이다.

## 종류
1. associateBy
   - **collection.associateBy {it.key로 사용할 속성}**: 아이템에서 key를 추출하여 map으로 변환하는 함수
2. groupBy
   - key가 같은 아이템끼리 배열로 묶어 map으로 만드는 함수
   - **collection.groupBy {it.특정값}**: 특정값을 key로 지정하여 해당값을 가진 객체끼리 묶은 배열을 value로 하는 map으로 변환
3. partition
   - 아이템에 조건을 걸어 2개의 컬렉션으로 나누어 줌
   - **collection.partition {it.조건}**: true 인지 false 인지에 따라 2개의 컬렉션으로 분리
      - 2개의 컬렉션은 2개의 객체를 담을 수 있는 pair라는 클래스 객체로 반환 --> 각각의 컬렉션을 first, second로 참조하여 사용
      - 혹은 변수 사용하여 pair을 직접 받음: val(pair1, pair2) = collection.partition{it.조건}
여기까지 내용을 코드로 확인해보자.  

~~~kotlin
fun main(){
    data class Food(val name: String, val price: Int)
    
    val foodList = listOf(Food("Pizza", 20000), 
                          Food("Chicken", 17000),
                         Food("Noodle", 5000),
                         Food("Fish", 17000))

    println(foodList.associateBy{it.price}) // {20000=Food(name=Pizza, price=20000), 17000=Food(name=Fish, price=17000), 5000=Food(name=Noodle, price=5000)}
    println(foodList.groupBy{it.price}) // {20000=[Food(name=Pizza, price=20000)], 17000=[Food(name=Chicken, price=17000), Food(name=Fish, price=17000)], 5000=[Food(name=Noodle, price=5000)]}
    println(foodList.groupBy{it.name}) // {Pizza=[Food(name=Pizza, price=20000)], Chicken=[Food(name=Chicken, price=17000)], Noodle=[Food(name=Noodle, price=5000)], Fish=[Food(name=Fish, price=17000)]}
    
    val (pair1, pair2) = foodList.partition{it.price>10000}
    println(pair1) // [Food(name=Pizza, price=20000), Food(name=Chicken, price=17000), Food(name=Fish, price=17000)]
[Food(name=Noodle, price=5000)]
    println(pair2) // [Food(name=Noodle, price=5000)]
}
~~~  


foodList의 가격 중 17000원이 Chicken과 Fish에서 중복되는데, 가격기준으로 groupBy한 경우, 17000 key 값에 Fish 속성이 들어간 것을 확인할 수 있다. (Map의 특성, Chicken을 Fish가 대체한 결과)
---
4. flatMap
   - 아이템마다 만들어진 컬렉션을 합쳐서 반환하는 함수
   - **collection.flatMap{listOf(it*3, it+3)}** : 중괄호 안에서 아이템마다 새로운 컬렉션을 생성하면 이를 합쳐서 하나의 컬렉션으로 반환
5. getOrElse
   - **collection.getOrElse(인덱스){default 값}**: 인덱스 위치에 아이템이 있으면 아이템을 반환하고, 없으면 지정한 default 값 반환하는 함수
6. zip
   - **collectionA zip collectionB**: 컬렉션 두 개의 아이템을 1:1로 pair 클래스의 객체로 만들어 list로 반환 (새 컬렉션을 만들어줌)
      - 결과 List의 아이템 개수는 더 작은 컬렉션을 따라감
위 3가지 함수를 코드로 확인해보자.  

~~~kotlin
fun main(){
    val numbers = listOf(-1,0,3,-9,2)
    
    println(numbers.flatMap{listOf(it*10, it+10)}) // [-10, 9, 0, 10, 30, 13, -90, 1, 20, 12]
    
    println(numbers.getOrElse(6){"No item"}) // No item
    println(numbers.getOrElse(1){"item"}) // 0
    
    val newList = listOf("A", "B", "C", "D")
    
    println(newList zip numbers) // [(A, -1), (B, 0), (C, 3), (D, -9)]
}
~~~  
  
### 참고사항
컬렉션 함수는 람다함수를 사용하여 컬렉션을 좀 더 편리하게 조작할 수 있는 함수로, 데이터 조작을 더 수월하게 해주는 다양한 기능 제공한다.