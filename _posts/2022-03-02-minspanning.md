---
layout: post
title: "네트워크 유량 문제"

categories: [Algorithm, Graph]
tags:
  - Graph
  - 네트워크 유량
comments: true
---

# 그래프

## 네트워크 유량 문제
- 그래프에서 각 노드들 간의 용량(Capacity)가 정의되어 있을 때, 시작점(Source)에서 끝점(Target)까지 흐를 수 있는 최대 유량 구하는 문제
### 용어
1. 소스(S, source): 시작점
2. 싱크(T, sink): 끝점
3. 정점(Vertex): 유량이 모이는 위치
4. 간선(Edge): 유량이 흐르는 파이프 역할
5. 용량(Capacity): 유량이 흐를 수 있는 크기
6. 유량(Flow): 간선에 흐르는 현재 유량의 크기
7. 잔류 유량(Residual Flow): Capacity - Flow, 현재 간선에 흐를 수 있는 
유량의 크기
8. c(u,v): u에서 v로 흐를 수 있는 간선의 용량(Capacity)
9. f(u,v): u에서 v로 흐른 실제 유량(Flow)

### 알고리즘
#### Ford-Fulkerson (포드 폴커슨)
- DFS: O((V+E)F), F: Flow의 Max 수치, Flow에 영향을 받는다.
#### Edmonds-Karp (에드몬드 카프)
- BFS: O(VE(E)), Edge에 영향을 받는다.

#### 해결 방법
1. 네트워크에 존재하는 모든 간선의 유량을 0으로 초기화하고, 역방향 간선의 유량도 0으로 초기화한다.
2. Source에서 Sink로 갈 수 있는 잔여 용량이 남은 경로를 **BFS/DFS**로 탐색한다.
3. 해당 경로에 존재하는 잔여 용량 중, 가장 작은 값을 유량으로 흘려보낸다.
4. 해당 유량에 음수값을 취해, 역방향 간선에도 흘려보낸다.(유량 상쇄)
5. 더 이상 잔여 용량이 남은 경로가 존재하지 않을 때까지 반복한다.

    [네트워크 유량 코드](https://github.com/eunhwa99/Data-Structure/blob/main/Network%20Flow.cpp)