# 빠띠

## 설정

### 설정값 관리

config.json에 설정한다. 이 값은 config.xml 생성과 src/config/constant.ts를 생성하는데 사용된다. 이 생성 과정은 gulpfile.js에 gulp taks로 정의되어 있다. 이 gulp task는 npm script로 ionic cli 구동 시 호출된다. 이 npm script 설정은 package.json에 있다.

### cordova 설정을 위한 config.xml

config.tpl.xml을 수정한다. config.xml은 config.tpl.xml에서 자동 생성된다.

## 개발 환경 설정

### gulp를 설치합니다

```
$ npm install -g gulp
```

## 개발

### 테스트를 위한 ionic serve 띄우기

로컬서버(http://part.dev)와 연동하는 ionic serve는 아래와 같이 구동시킨다.
```
$ ionic serve
```

테스트서버(http://dev.parti.xyz)와 연동하는 ionic serve는 아래와 같이 구동시킨다.
```
$ PARTI_ENV=staging ionic serve
```

### 앱 빌드하거나 에뮬레이팅해보기

앱을 빌드하기 전에 환경 설정을 한다. 환경값은 development, staging, production이 가능하다. 마지막에서 수행한 환경 설정의 환경값과 같다면 수행할 필요가 없다. 
```
$ PARTI_ENV=환경값 gulp reset
```

연동하는 앱은 아래와 같이 빌드한다.
```
$ ionic build ios
```

ios 경우 환경 설정을 수행하였다면 Keychain Sharing Capability를 설정해야 한다. /platforms/ios/앱이름.xcodeproj 파일을 연다. 프로젝트이름을 클릭하고 > Capabilities > Keychain Sharing을 on한 뒤 다시 빌드한다.
