---
title: "인터페이스"

categories: [Kotlin, OOP]
tags:
  - 인터페이스
---
# 인터페이스

## 필요한 이유
난 동물원의 사육사이다.  
육식동물이 들어오면 난 먹이를 던져준다.  
호랑이가 오면 사과를 던져준다.  
사자가 오면 바나나를 던져준다.  

- 위 케이스를 코드로 구현  

```java
class Animal {
    String name;

    void setName(String name) {
        this.name = name;
    }
}

class Tiger extends Animal {
}

class Lion extends Animal {
}

class ZooKeeper {
   /**
    메소드 오버로딩
   **/
    void feed(Tiger tiger) {  
        System.out.println("feed apple");
    }

    void feed(Lion lion) {  
        System.out.println("feed banana");
    }
}

public class Sample {
    public static void main(String[] args) {
        ZooKeeper zooKeeper = new ZooKeeper();
        Tiger tiger = new Tiger();
        Lion lion = new Lion();
        zooKeeper.feed(tiger);  // feed apple 
        zooKeeper.feed(lion);  // feed banana 
    }
}
```  

위 상황에서 다른 동물들이 계속 추가된다면 ZooKeeper는 동물이 추가될 때마다 매번 다음과 같은 feed 메소드를 추가해야 한다.  

```java
class ZooKeeper {
  ...

   public void feed(Crocodile crocodile) {
        System.out.println("feed strawberry");
    }

    public void feed(Leopard leopard) {
        System.out.println("feed orange");
    }

  ...
}
```  

이런 어려움을 해결하기 위해 **인터페이스가 필요**

<br/> <br/> 


## 인터페이스 작성
- 인터페이스는 class가 아닌 **interface** 라는 키워드를 이용하여 작성  
- 클래스가 작성한 인터페이스를 **implements** 한다.  

```java
interface Predator {
}

class Animal {
    String name;

    void setName(String name) {
        this.name = name;
    }
}

class Tiger extends Animal implements Predator {
}

class Lion extends Animal implements Predator {    
}

class ZooKeeper {
    void feed(Predator predator) {
        System.out.println("feed something");
    }
}

```    

- 위 코드에서 tiger은 Tiger 클래스의 객체이자 Predator 인터페이스의 객체 (**다형성**: 객체가 한 개 이상의 자료형 타입을 갖게되는 특성)
- 어떤 육식동물이 추가되더라도 ZooKeeper는 feed 메소드를 추가할 필요X
  - 식동물이 추가 될 때마다 다음과 같이 Predator 인터페이스를 구현한 클래스를 작성

```java
class Crocodile extends Animal implements Predator {
}
```

## 인터페이스 메소드
- 지금까지 작성한 코드에서 feed something 부분이 수정되어야 한다. 육식동물 별로 구별해서 수정  
- 아래와 같이 인터페이스의 메소드는 **메소드의 이름과 입출력에 대한 정의만 있고 그 내용은 없다.** (규칙)
  - 메소드는 인터페이스를 **implements한 클래스들이 구현**해야만 하는 것  

 ※ 인터페이스의 메소드는 항상 public으로 구현  

```java  
interface Predator {
    String getFood();
}

...


class Tiger extends Animal implements Predator {
    public String getFood() {
        return "apple";
    }
}

class Lion extends Animal implements Predator {
    public String getFood() {
        return "banana";
    }
}

...

class ZooKeeper {
    void feed(Predator predator) {
        System.out.println("feed "+predator.getFood());
    }
}

...

```

- **인터페이스는 인터페이스의 메소드를 반드시 구현해야 하는 "강제성"을 갖는다** 
<br/><br/>

## 디폴트 메서드 (default method)
  - 인터페이스의 메서드는 몸통(구현체)을 가질 수 없지만 디폴트 메서드를 사용하면 실제 구현된 형태의 메서드를 가질 수 있다. (자바8 버전 이후)
  - 메소드명 가장 앞에 **default** 라고 표기
    - Predator 인터페이스를 구현한 실제 클래스는 printFood 메서드를 구현하지 않아도 사용 가능
    - 오버라이딩이 가능: printFood 메소드를 실제 클래스에서 다르게 구현하여 사용가능  

```java
interface Predator {
    String getFood();

    default void printFood() {
        System.out.printf("my food is %s\n", getFood());
    }
}
```
<br/><br/>

## 스태틱 메서드(static method)
- 일반 클래스의 스태틱 메서드를 사용하는 것과 동일하게 사용가능
- **인터페이스명.스태틱메서드명**

```java

interface Predator {
    String getFood();

    default void printFood() {
        System.out.printf("my food is %s\n", getFood());
    }

    int LEG_COUNT = 4;  // 인터페이스 상수

    static int speed() {
        return LEG_COUNT * 30;
    }
}

...
Predator.speed(); // 이렇게 사용
...

```  
- 인터페이스 상수
  - int LEG_COUNT = 4;처럼 인터페이스에 정의한 상수
  - public static final을 생략해도 자동으로 public static final이 적용 (다른 형태의 상수 정의는 불가능)
<br/><br/>



##### 참고자료
점프 투 자바 - 객체지향 프로그래밍
