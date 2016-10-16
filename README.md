# 빠띠

## 설정

### 설정값 관리

config.json에 설정한다. 이 값은 config.xml 생성과 src/config/constant.ts를 생성하는데 사용된다. 이 생성 과정은 gulpfile.js에 gulp taks로 정의되어 있다. 이 gulp task는 npm script로 ionic cli 구동 시 호출된다. 이 npm script 설정은 package.json에 있다.

### cordova 설정을 위한 config.xml

config.tpl.xml을 수정한다. config.xml은 config.tpl.xml에서 자동 생성된다.

## 개발 환경 설정

### 테스트를 위한 ionic serve 띄우기

로컬서버(http://part.dev)와 연동하는 ionic serve는 아래와 같이 구동시킨다.
```
$ ionic serve
```

테스트서버(http://dev.parti.xyz)와 연동하는 ionic serve는 아래와 같이 구동시킨다.
```
$ PARTI_ENV=staging ionic serve
```

### 앱 빌드하기

로컬서버(http://part.dev)와 연동하는 앱은 아래와 같이 빌드한다.
```
$ ionic build ios
```

테스트서버(http://dev.parti.xyz)와 연동하는 앱은 아래와 같이 빌드한다.
```
$ PARTI_ENV=staging ionic serve
```

