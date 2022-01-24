---
title: "상속과 생성자"

categories: [Kotlin, OOP]
tags:
  - 상속
  - 생성자
  - 클래스
comments: true
---
# 클래스

## 상속
- 키워드 **extends** 사용
```Java
class Person {
    String name;

    void setName(String name) {
        this.name = name;
    }
}

class Woman extends Person {
  void sleep() {
        System.out.println(this.name+" is sleeping");
    }
}

public class Sample {
    public static void main(String[] args) {
        Woman woman = new Woman();
        woman.setName("Betty");
        System.out.println(woman.name); // Betty
    }
}
```
- Woman 클래스에 name 이라는 객체변수와 setName이라는 메소드를 만들지 않았지만 Person 클래스를 상속했기 때문에 그대로 사용이 가능  
- Woman 클래스는 Person 클래스보다 좀 더 많은 기능(sleep메소드) 보유: **기능 확장**
  - 보통 부모 클래스를 상속받은 자식 클래스는 부모 클래스의 기능에 더하여 *좀 더 많은 기능을 갖도록 작성* 
<br/> <br/> 


### IS-A 관계
- "Woman **is a** Person" 과 같이 말할 수 있는 관계 
- 상속관계에 있을 때 자식 클래스의 객체는 부모 클래스의 자료형인 것처럼 사용 가능  
  ※ 주의
  - Woman 객체를 Person 자료형으로 사용할 경우에는 Woman 클래스에만 존재하는 sleep 메소드를 사용할 수 없다.  (Person 클래스에 구현된 setName 메소드만 사용이 가능)  

```Java
Person woman = new Woman(); // Woman is a Person (O)
Woman woman = new Person(); // 오류: Person is a woman (X)

```

#### 참고사항
##### Object 클래스
- 자바에서 만드는 모든 클래스는 Object 클래스를 상속받는다. 하지만 굳이 아래 코드처럼 Object 클래스를 상속하도록 코딩하지 않아도 자바에서 만들어지는 모든 클래스는 Object 클래스를 자동으로 상속받게끔 되어 있다.
  - 자바에서 만드는 **모든 객체는 Object 자료형으로 사용 가능** 


```java
class Animal {
    String name;

    public void setName(String name) {
        this.name = name;
    }
}

public class Sample {
    public static void main(String[] args) {
        Object animal = new Animal();  // Animal is a Object
        Object dog = new Dog();  // Dog is a Object
    }
}
```  
<br/><br/>

## 메소드 오버라이딩
-  부모클래스의 메소드를 자식클래스가 동일한 형태로 또다시 구현하는 행위 (**메소드 덮어쓰기**)

```java
class Person {
    String name;

    void setName(String name) {
        this.name = name;
    }

    void sleep() {
        System.out.println(this.name+" is sleeping");
    }
}

class Woman extends Person {
  void sleep() {
        System.out.println(this.name+" is sleeping and moving");
    }
}

class Man extends Person{
  void sleep() {
        System.out.println(this.name+" is sleeping and snoring");
    }
}

public class Sample {
    public static void main(String[] args) {
        Man man = new Man();
        man.setName("John");
        man.sleep(); // John is sleeping and snoring
    }
}
```  
<br/><br/>

## 메소드 오버로딩
- 입력항목이 다른 경우 동일한 이름의 다른 메소드 형성

```Java
class Person {
    String name;

    void setName(String name) {
        this.name = name;
    }

    void sleep() {
        System.out.println(this.name+" is sleeping");
    }
}

class Woman extends Person {
  void sleep() {
        System.out.println(this.name+" is sleeping and moving");
    }
}

class Man extends Person{
  void sleep() {
        System.out.println(this.name+" is sleeping and snoring");
    }
  void sleep(int hour){
     System.out.println(this.name + " zzz in house for " + hour + " hours");
  }
}

public class Sample {
    public static void main(String[] args) {
        Man man = new Man();
        man.setName("John");
        man.sleep(); // John is sleeping and snoring
        man.sleep(3); // John zzz in house for 3 hours
    }
}
```
<br/><br/>
## 생성자
- "객체지향 프로그래밍" part에서 dog의 이름을 초기화하지 않아 null 이 출력 --> 이를 **메소드** setName을 이용해 해결
- 이번에는 **생성자**를 통해 초기화

## Call by value
- 메소드에 *값*을 전달하는 것과 *객체*를 전달하는 것에 큰 차이 존재
- 메소드로 객체를 전달할 경우 메소드에서 객체의 **객체변수(속성) 값 변경 가능**  
  - 생성자는 메소드와 다르게 name 이라는 객체변수에 값을 **무조건 설정**해야만 객체가 생성될 수 있도록 **강제** 할 수 있다.

```java
class Animal {
    String name;

    Animal(String name){
      this.name = name;
    }
    /*public void setName(String name) {
        this.name = name;
    }*/
}

public class Sample {
    public static void main(String[] args) {
        Animal dog = new Animal("Happy");
        System.out.println(dog.name); // Happy
    }
}
```  
<br/><br/>

### 디폴트 생성자
- 생성자의 입력 항목이 없고 생성자 내부에 아무 내용이 없는 생성자
- 만약 클래스에 생성자가 하나도 없다면 컴파일러는 자동으로 디폴트 생성자 추가
  - 사용자가 작성한 생성자가 하나라도 구현되어 있다면 컴파일러는 디폴트 생성자 추가 X

```java
class Dog extends Animal {
    Dog() {
    } // 디폴트 생성자
}
```  
<br/><br/> 

### 생성자 오버로딩
- 입력 항목이 다른 생성자 (※ 메소드 오버로딩과 동일한 개념)
```java
class Animal {
    String name;

    void setName(String name) {
        this.name = name;
    }
}

class Dog extends Animal {
    Dog(String name) {
      this.setName(name);
    } 

    Dog(int type){
      this.setName("happy"+type);
    }
}


public class Sample {
    public static void main(String[] args) {
        Dog dog1 = new Dog("Mong");
        Dog dog2 = new Dog(2);
        System.out.println(dog1.name);  // Mong
        System.out.println(dog2.name);  // happy2
    }
}
```
<br/> <br/>

##### 참고자료
점프 투 자바 - 객체지향 프로그래밍
