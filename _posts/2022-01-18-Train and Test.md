---
layout: post
title: "Train Test Split"

categories: Machine Learning
tags:
  - Split
  - sklearn
comments: true
---

```python
import pandas as pd
df = pd.read_csv("train.csv")
```


```python
df.sample(5)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>PassengerId</th>
      <th>Survived</th>
      <th>Pclass</th>
      <th>Name</th>
      <th>Sex</th>
      <th>Age</th>
      <th>SibSp</th>
      <th>Parch</th>
      <th>Ticket</th>
      <th>Fare</th>
      <th>Cabin</th>
      <th>Embarked</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>363</th>
      <td>364</td>
      <td>0</td>
      <td>3</td>
      <td>Asim, Mr. Adola</td>
      <td>male</td>
      <td>35.0</td>
      <td>0</td>
      <td>0</td>
      <td>SOTON/O.Q. 3101310</td>
      <td>7.050</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>508</th>
      <td>509</td>
      <td>0</td>
      <td>3</td>
      <td>Olsen, Mr. Henry Margido</td>
      <td>male</td>
      <td>28.0</td>
      <td>0</td>
      <td>0</td>
      <td>C 4001</td>
      <td>22.525</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>723</th>
      <td>724</td>
      <td>0</td>
      <td>2</td>
      <td>Hodges, Mr. Henry Price</td>
      <td>male</td>
      <td>50.0</td>
      <td>0</td>
      <td>0</td>
      <td>250643</td>
      <td>13.000</td>
      <td>NaN</td>
      <td>S</td>
    </tr>
    <tr>
      <th>11</th>
      <td>12</td>
      <td>1</td>
      <td>1</td>
      <td>Bonnell, Miss. Elizabeth</td>
      <td>female</td>
      <td>58.0</td>
      <td>0</td>
      <td>0</td>
      <td>113783</td>
      <td>26.550</td>
      <td>C103</td>
      <td>S</td>
    </tr>
    <tr>
      <th>183</th>
      <td>184</td>
      <td>1</td>
      <td>2</td>
      <td>Becker, Master. Richard F</td>
      <td>male</td>
      <td>1.0</td>
      <td>2</td>
      <td>1</td>
      <td>230136</td>
      <td>39.000</td>
      <td>F4</td>
      <td>S</td>
    </tr>
  </tbody>
</table>
</div>




```python
corr = df.corr() # correlation
corr.Survived.sort_values(ascending=False)
```




    Survived       1.000000
    Fare           0.257307
    Parch          0.081629
    PassengerId   -0.005007
    SibSp         -0.035322
    Age           -0.077221
    Pclass        -0.338481
    Name: Survived, dtype: float64




```python
y = df['Survived']
```


```python
x = df.drop(['Survived', 'PassengerId'], axis=1) # drop column
```

## Split
### sklearn.model selection의 train_test_split
- train_test_split(X, y, test_size, shuffle...) (함수에 대해 자세히 알아보려면 shift+tab 키를 입력)
     - test_size: 전체 데이터 중 test_size 만큼 test data로 할당 (예를 들어, test_size = 0.3이면, 전체 데이터의 30%는 x_test와  y_test에 할당, 나머지는 x_train, y_train에 할당)


```python
from sklearn.model_selection import train_test_split
```


```python
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3)
```


```python

```
