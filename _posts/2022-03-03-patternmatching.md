---
layout: post
title: "다중 패턴 매칭"

categories: [Algorithm, String]
tags:
  - String
  - Failure link
  - Aho-Corasick

comments: true
---
# 문자열
- K개의 단어로 이루어진 사전에서 각 단어의 길이가 최대 m이라고 할 때, 주어진 문자열 T에서 이 사전에 나오는 단어가 나온 경우를 모두 찾으려면 어떻게 해야할까?

## Aho-Corasick 알고리즘
- 기본 아이디어: 주어진 단어들을 트라이 형태로 표현하고, Failure link를 정의하여 매치 실패시 다음으로 이동할 상태를 정의한다.
- 사전의 예: {'hers', 'his', 'she'}  
<img src="https://user-images.githubusercontent.com/68810660/156485800-ac69320d-c009-4e4f-8f2d-bd521ca30cb9.png">

- 시간 복잡도: **O(mK + T)**
- Failure link를 어떻게 정의?

### Failure link
- BFS 이용
- 시작 노드의 failure link는 자기 자신
- 수학적 귀납법을 이용하여 정의한다.
    - 위의 그림에서 처음 h나 s는 시작 노드를 가리킬 수 밖에 없다.
    - 위의 그림에서 s -> h 까지 이동하면, h의 failure link는 hers나 his의 h를 가리킨다. (마찬가지로 s->h->e에서 e의 failure link는 hers의 e)
