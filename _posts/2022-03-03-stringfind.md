---
layout: post
title: "문자열 찾기"

categories: [Algorithm, String]
tags:
  - String
  - Naive Algorithm
  - Hashing
  - KMP
  - Boyer-Moore
comments: true
---
# 문자열
## 용어 정의
- T: 텍스트(text), P: 패턴(pattern)
- T[i]: T의 u번째 글자
- 부분문자열 T[i,j]: i번째 문자부터 j번째 문자로 이루어진 문자열, T[i]T[i+1]---T[j]
- 접두사(prefix): 주어진 문자열의 첫 문자부터 시작하는 부분문자열
- 접미사(suffix): 주어진 문자열의 마지막 문자에서 끝나는 부분문자열

## 알고리즘
### Naive Algorithm
- 가장 간단하게 생각할 수 있는 방법
-  T[1,n], P[1,m]이 주어졌다면, T의 길이 m인 모든 부분문자열 T[1,m], T[2,m+1], --- T[n-m+1,n]과 P를 비교
- 최악의 시간 복잡도: **O(nm)**  
    - ex) T=a...a (a가 n번), P=a...ab(a가 m-1번, 마지막 b) : (n-m+1)*m, n>>m

### Hashing
- P와 길이 m인 모든 부분문자열을 직접 비교하는 대신, 두 문자열의 **hash 값**을 구하여 이 둘을 비교
    - hash 값이 **다르다**면? --> 두 문자열은 **100%** 서로 다르다.
    - hash 값이 **같다**면? --> 두 문자열은 **같을 수 있다.**
        - 또 다른 hash 값을 이용하여 두 문자열을 비교하거나
        - 두 문자열을 직접 비교해서 같은지 확인

- 효율적인 hash 함수 사용: f는 x!=y라면 높은 확률로 f(x)!=f(y) 
- 문제점: f(T[i,i+m-1])을 계산하기 위해서는 m 글자를 읽어야 한다. --> O(m) 걸린다면 Naive와 차이가 없다. (Rabin-Karp의 탄생)

#### Rabin-Karp fingerprinting
- 핵심 아이디어: f(i,i+m-1)을 구한 상태에서 f(i+1, i+m)을 O(1) 시간에 생성할 수 있으면 된다.
- 길이 m인 문자열 P = D0D1---Dm-1
    - f(T[i+1, i+m]) = ... xf(T[i, i+m-1]) ... : 이전에 사용한 hash 값을 재사용!
- P의 hash 값을 구하는 시간은 **m**, T의 hash 값을 구하는 시간은 **n**, 비교횟수는 **n+m-1**번 이므로, 총 **O(n+m)** 걸린다.
    - 문자열 탐색을 하려면 패턴과 문자열을 어떻게든 읽어야 하는데, 이 때 n+m 시간이 걸릴 수 밖에 없다.
    - 따라서 O(n+m)은 당연히 걸리는 시간이고, 문자열을 탐색하는 데 최적의 시간 복잡도라고 할 수 있다. (이보다 더 잘 나올 수 없다.)
- 문제점: O(n+m) 시간에 **높은 확률**로 정답을 구할 수 있지 항상 구할 수 있는 것은 아니다. (KMP의 탄생)

##### 참고사항
1. Naive Algorithm은 왜 느릴까?
    - P를 T의 어떤 위치에 맞추어 비교할 때 실패하면 오른쪽으로 한 칸 이동하고, 이동한 다음 처음부터 다시 비교를 수행하므로
2. 속도를 높이기 위해서는?
    - 이동할 수 있는 한 최대로 이동
    - 단, P가 T에서 나올 수 있는 경우를 놓치지 않는다.
    - 일단 이동한 다음에는 비교할 필요가 없는 부분은 피한다. (다시 비교하지 않도록)


#### KMP Algorithm
- 핵심 아이디어: 매칭에 실패했을 때 성공한 부분을 **다시 이용**
    - 이미 비교한 부분을 다시 비교X
    - 오른쪽으로 최대한 많이 이동 (단, 매칭이 될 수 있는 부분을 놓치지 않는다.)
    - 접두사와 접미사의 개념 사용하여 '반복되는 연산을 얼마나 줄일 수 있는지' 판별
- **O(n+m)** 시간에 반드시 정답 보장
    - 실패함수 구하는 단계 (m) + 문자열 비교 단계 (n)
- 문제점: 최적이지만 너무 복잡하다. (Boyer-Moore의 탄생)
##### **실패함수 (failue function)**
- f(i)는 P[1,i]에서 가장 긴 접두사=접미사 길이: 0 <= f(i) < i
<img src="https://user-images.githubusercontent.com/68810660/156468184-c019c381-067f-4570-a0d0-8a673f9b5e20.png"> 

1. 정의
    - P를 왼쪽부터 오른쪽으로 T와 비교할 때, i+1번째 위치에서 틀린 글자가 나왔다면 i번째 글자까지는 맞음
    - 따라서, 비교가 끝난 위치에서 처음부터 f(i) 글자가 일치함
    - P를 오른쪽으로 **i-f(i)**만큼 이동 가능 

2. 실패함수 구하는 법 (o(m) 시간 안에)
    - 정의에 의해 f(1) = 0
    - f(1),f(2), ... f(i)까지 모두 구하고 f(i+1)을 구할 때, P[1,i]의 접두사와 접미사가 일치한다면, P(i+1)글자만 비교하면 된다.
        - 즉, P[1,i]에서 접두사와 접미사가 일치하는 **모든 쌍**을 구해보고, 각각의 쌍에 대하여 접두사의 다음 글자가 P(i+1)과 같은지 비교하면 된다.
        1. P[i+1] = P[f(i)+1] 이라면 f(i+1) = f(i) + 1
        2. 그렇지 않다면, 2번째로 일치하는 접두사/접미사 쌍을 찾는다.: P[1,f(f(i))]
            2-2. P[f(f(i))+1] = P[i+1] 이라면 f(i+1) = f(f(i)) + 1
        3. 위 과정을 반복적으로 진행
        4. 최종적으로 P[1]과 P[i+1] 비교하여 같으면 1, 틀리면 0
<br/> <br/>

    [KMP 소스코드](https://github.com/eunhwa99/Data-Structure/blob/main/KMP%20%20%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98.c) 
<br/><br/>

#### Boyer-Moore Algorithm
- 핵심 아이디어: 패턴과 텍스트를 **오른쪽에서 왼쪽**으로 비교한다. 틀린 문자가 나오면 최대한 오른쪽으로 이동한다.
- 시간 복잡도
    - 최악: **O(nm)** , ex) T = a...a (a가 n번), P = ba...a (b 다음 m-1개의 a)
    - 최선: **O(n/m)**, ex) T = a...a (a가 n번), P = b...b (m개의 b)
- KMP에 비해 구현이 간단하고, 실제로 좋은 성능을 내는 알고리즘으로 가장 많이 사용
- KMP와 다르게, **'몇 칸 뛰는지'**에 대해서만 답 제공
    - 가장 오른쪽에 나온 글자의 위치를 찾아야 한다. 나오지 않는다면 -1
    1. 알파벳 X의 모든 글자마다 -1로 초기화
    2. P를 오른쪽에서 왼쪽으로 읽으면서, 해당하는 글자에 저장된 값이 -1이라면 이 위치로 변경
    - O(|P| + |X|)   
        <img src="https://user-images.githubusercontent.com/68810660/156472775-24f98f08-b433-4796-9660-762470fb28e0.png">