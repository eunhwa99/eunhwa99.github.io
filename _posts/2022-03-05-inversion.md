---
layout: post
title: "Counting - Inversion, Crossing, Tree Path"

categories: [Algorithm, Probability]
tags:
  - Inversion Counting
  - Crossing Counting
  - Tree Path Counting
comments: true
---
# 확률과 통계
## Inversion
- a1,a2,...,an이 1,2,3,...,n의 순열이라고 할 때, i < j인데 ai > aj 라면 (ai, aj)를 **Inversion**이라 한다.
    - 4,1,3,2,5: Inversion은 (a1, a2), (a1, a3), (a1, a4), (a3, a4)

## Inversion Counting
- Inversion 수를 세는 방법
    - 1번부터 끝, 2번부터 끝.. 이런 식으로 비교하는 O(nxn) 방법
    - 더 좋은 방법: Merge sort(O(nlogn))  

### Merge Sort를 활용한 Inversion Counting
- 1 4 5 8 2 3 6 7 이라는 수열이 있을 때, 이미 정렬된 부분인 [1 4 5 8]과 [2 3 6 7]로 그룹을 나눌 수 있다. Merge sort를 진행하면 1번 그룹의 1이 처음 오고, 2번 그룹의 2가 그 다음 오는데, 이 때 1번 그룹의 4 5 8이 2에 대해서 Inversion 되어 있음을 알 수 있다. 즉, 2번 그룹의 특정 숫자 a가 정렬될 때, 1번 그룹에서 정렬되지 않은 숫자들의 개수가 a에 대하여 Inversion 되어 있으므로 Counting 해주면 된다.

- 아래 코드에서 기본 merge sort 코드에 **cnt += (mid - s1 + 1)**만 추가하면 된다.    

'''c
void merge(int left, int mid, int right) {
	int s1 = left, s2 = mid + 1, k = left;
	while (s1 <= mid && s2 <= right) {
		if (arr[s1] <= arr[s2]) {
			sorted[k++] = arr[s1++];
		}
		else {
			cnt += (mid - s1 + 1);
			sorted[k++] = arr[s2++];
		}
	}
	if (s1 <= mid) {
		for (int i = s1; i <= mid; i++) sorted[k++] = arr[i];
	}
	else {
		for (int i = s2; i <= right; i++) sorted[k++] = arr[i];
	}
	for (int i = left; i <= right; i++) arr[i] = sorted[i];
}
void mergeSort(int left, int right) {
	if (left < right) {
		int mid = (left + right) / 2;
		mergeSort(left, mid);
		mergeSort(mid + 1, right);
		merge(left, mid, right);
	}
}
'''

## Crossing Number
- 어떤 점이 다각형에 포함되는지 여부를 결정하는 기하문제
- 주어진 점에서 광선을 발사하여 다각형과 만나는 개수를 세어, 이것이 홀수면 주어진 점은 다각형의 내부, 짝수면 외부에 존재

## Tree Path Counting
- 이진 트리의 두 **단말 노드**간 합의 최대를 구하는 문제
    - 이진 트리의 모든 노드에 점수 값이 주어져 있을 때, 두 단말 노드 간의 경로를 지나는 모든 노드 값의 합의 최대값을 구하는 문제
- 한번의 Traverse로 가능 (DFS)
    1. 루트에서 시작하여 왼쪽 트리, 오른쪽 트리로 구분
    2. 왼쪽 트리의 왼쪽 자식, 오른쪽 자식으로 구분
        - 2번을 리프노드로 도착할 때까지 계속 반복
    3. 리프 노드로 도착하면 값 반환: 리프 노드의 부모 노드는 왼쪽 자식과 오른쪽 자식 중 큰 값을 선택하여 자기 자신과 합함
    4. 위 과정을 오른쪽 트리에도 적용


#### 참고사항
- Binary Tree의 종류
1. Full Binary Tree (정 이진 트리): 단말노드가 아닌 모든 노드가 2개의 자식을 갖는 이진트리
2. Perfect Binary Tree (포화 이진 트리): 모든 단말 노드의 깊이가 같은 Full Binary Tree
2. Complete Binary Tree (완전 이진 트리): 트리의 각 노드에 부모에서 자식으로, 왼쪽에서 오른쪽으로 번호를 매겼을 때 포화 이진 트리는 아니지만 그 번호가 연속되어 있는 경우 (즉, 트리 생성 시 왼쪽부터 오른쪽으로 채워넣는 경우)
