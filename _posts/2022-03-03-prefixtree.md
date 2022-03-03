---
layout: post
title: "접미사 트리"

categories: [Algorithm, String]
tags:
  - String
  - 접미사 트리
  - 접미사 배열
  - Counting sort
comments: true
---
# 문자열
- 텍스트가 변하지 않을 때, 보다 빠르게 **패턴**을 찾고 싶을 때 데이터를 매번 검색시 다시 읽을 필요가 없이 **색인**을 생성하고 이 색인에서 검색하는 것이 타당한 접근 방법이다. ex) 전화번호부, 서적, 지도 등

## 텍스트의 전처리
- 기본 아이디어: 패턴 P가 텍스트 T에 나온다면, 이는 T의 어떤 접미사의 접두사이다. 따라서 접미사들을 **사전 순서대로** 저장하면 된다.
    - 접두사의 접미사도 가능하지만, 이 경우 접두사의 뒤쪽부터 탐색을 수행해야 한다. (불편함) 또, 접두사의 순서는 이미 결정되어 있다. (항상 같은 글자로 시작하므로 접두사를 사전 순으로 정렬한다는 것은 길이 순으로 정렬한다는 것과 같다.)
- 아래 예시를 확인해보자.  
<img src = "https://user-images.githubusercontent.com/68810660/156473962-e7a57d16-730b-49ae-adeb-19166def3605.png">

## 접미사 트리
- 루트부터 리프까지의 경로는 접미사 하나를 나타낸다.
- 두 접미사 U, V가 U = WX, V = WY 형태로 **공통의 접두사** W를 가진다면, 내부 노드를 생성한다. 
- 아래와 같이 생성된다.  
<img src ="https://user-images.githubusercontent.com/68810660/156474242-950b4cc6-1498-414e-bb85-216a0b4d7a05.png" >

### 생성 방법
1. Brute force
- **가장 긴** 접미사부터 시작하여, 차례로 접미사를 트리에 넣고, 트리의 경로를 따라가다가 갈라지는 부분(공통의 접두사 존재)이 생기면 내부 노드 생성
- 시간 복잡도: O(n*n), (n+(n-1)+...+1)
2. 더 좋은 방법도 존재 (McCreight's algorithm, Ukkonen's algorithm 등 O(n))

### 사용법
- 루트에서 시작해서, 패턴을 한 글자씩 읽어나가면서 해당하는 경로를 따라간다.
- 루트부터 내부 정점까지의 경로에 해당되는 문자열은 문자열에서 두 번 이상 나오는 반복되는 문자열이다.
    - 회문 (팰린드롬, Pallndrome, 반대로 읽어도 같은 문자열)

- 문제점: 만들기 어렵고 메모리를 많이 사용한다. --> 만들기 쉬운 자료구조: **접미사 배열**

## 접미사 배열
- 문자열에서 접미사들을 정렬해 놓은 배열
- 위의 BANANA를 정렬한 그림에서 접미사를 정렬한 순서 **[5, 3, 1, 0, 4, 2]**만 저장하면 모든 접미사를 복원할 수 있다.
- [5, 3, 1, 0, 4, 2]가 접미사 배열(Suffix Array)  
<img src="https://user-images.githubusercontent.com/68810660/156476818-ca2ab13a-0464-4a02-ab38-4dc2b1ce27a7.png">

### 접미사 트리와 접미사 배열
- 접미사 트리와 접미사 배열간의 상호 변환 가능
- 두 자료 구조로 풀 수 있는 문제는 동일하다.

### 생성방법
1. Brute-Force
- 모든 접미사를 생성한 후, 사전 순서대로 정렬
- O(nlogn) 기본으로 걸리고, 문자열의 비교이므로 한 번 비교에 최대 O(n) 걸려서 **O(n(nlogn))**
2. 더 좋은 방법
- **Wu and Manber**: O(nlogn)
- Sanders, kim, ...: O(n), 매우 복잡
- Nong, Zhang, and Chan: (nlogn), 간단
<br/>

2-2. Counting sort에 기반한 방법 (Wu and Manber)
- 핵심 아이디어: 첫 1, 2, 4, 8, ... 2^n 글자를 기준으로 정렬 (logN번)
    1) 일단 첫 글자를 중심으로 정렬한다. 아래와 같이 $와 B의 위치는 결정이 되었다. (A와 N은 더 비교해야 한다.)
    <img src="https://user-images.githubusercontent.com/68810660/156477901-4f4b5d0b-ba76-4790-8cb7-225fe0b2d4af.png">  
<br/><br/>
    2) 한 글자에서 두 글자로 길이를 증가시킨다. ANA$와 A$ 중, NA$보다 $가 앞이다.  
        <img src="https://user-images.githubusercontent.com/68810660/156478611-5092980a-b9af-4466-bf6c-7c1868708ade.png">  
    <br/><br/>

    3) 두 글자에서 네 글자로 갈이를 증가시킨다. NA$와 NANA$을 비교하면, 두 글자 기준으로 정렬했을 때 앞 두 글자를 뺀 $B와 NA 중 $B가 앞이다.  
   <img src="https://user-images.githubusercontent.com/68810660/156478980-75528186-00aa-470e-9fef-c1714547ed20.png">

- 시간 복잡도
    - 문자열의 길이를 2배 늘이는 과정에서 퀵 정렬 이용하면, 매번 정렬할 때마다 비교를 O(nlogn)번 수행, 총 정렬횟수는 1->2->4->..->N으로 O(logn): **총 O(nlogn(logn))**
   

### LCP (Longest Common Prefix)
- LCP[j]: 접미사 배열에서 j 번째 접미사와 j-1번째 접미사 사이에 일치하는 접두사의 길이
- 즉, i~j번째 접미사의 공통 접두사 길이는 min(LCP[k])이다. (i < k <= j)

<img src="https://user-images.githubusercontent.com/68810660/156477128-ffc59bc1-e7bf-4f28-bc7e-d2875a76213f.png">

<br/>


[SA와 LCP 소스코드](https://github.com/eunhwa99/Data-Structure/blob/main/Sufix%20Array.cpp)
- 소스코드 볼 때 위 그림 참고
- 위 그림에서 접미사 순서가 i, 정렬된 순서가 SA[i], pos[i]이고, LCP가 lcp[i]이다.

<br/><br/>

### 응용
- 패턴 찾기: **이분 탐색**을 이용하여 패턴의 첫 글자와 접미사 배열의 첫 글자가 같은 문자열 찾는다.
- 예제: NAN이 BANANA에 포함?  
<img src="https://user-images.githubusercontent.com/68810660/156479724-fa5b34f7-cacb-47d7-8587-38b0de7f0537.png">

- 시간 복잡도: **O(mlogn)**

