---
layout: post
title: "Convex Hull(볼록 외피)"

categories: [Algorithm, Geometry]
tags:
  - Convex Hull
  - 볼록 외피


comments: true
---
# 볼록 외피
- 주어진 점들을 모두 둘러싸는 가장 작은 볼록 다각형
- **극단점(extreme point)**: 볼록 외피의 정점이 되는 점  

<img src="https://user-images.githubusercontent.com/68810660/156958322-509294dd-8e8d-48d2-9755-04abfa06a780.png">

## 문제
- 평면 상에 빨간색, 파란색 점들이 주어질 때 직선 L을 그어서 평면을 두 영역으로 나누어 각 영역에 같은 색의 점만 포함하도록 하는 직선 L이 존재하는가?

## 해결
- 볼록 외피 이용
- 빨간 점들의 볼록 외피와 파란 점들의 볼록 외피를 구해, 두 볼록 다각형이 겹치거나 닿아 있지 않으면 직선 L 존재

## 볼록 외피 알고리즘 (Jarvis's march)
- 극단점을 하나씩 순서대로 찾아가는 방법
1. 제일 먼저 극단점 하나(기준점)를 찾는 방법: x좌표 or y좌표로 최대 or 최소인 정점
2. 모든 노드를 기준점에 대해 **반시계 방향 or 시계 방향**으로 정렬
    - CCW 값 이용
3. 기준점부터 시작해서, 순서대로 모든 노드에 대해 **좌회전 or 우회전**여부 검사
    - 2번에서 반시계 방향으로 정렬했으면 좌회전, 시계 방향으로 정렬했으면 우회전 검사
    - **스택** 이용하여 검사
    - 스택의 가장 위에 있는 노드가 반대 방향 선분에 속하는 노드이면 pop하여 제거
    - 좌회전 or 우회전에 해당하는 선분만 찾으면 Convex Hull (스택 사용)

[Convex Hull 코드]("https://github.com/eunhwa99/Data-Structure/blob/main/Convex%20Hull.cpp")