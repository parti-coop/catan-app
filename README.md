# 빠띠

## 설정

### 설정값 관리

settings/config.yml에 설정한다. 이 값을 settings 아래 템플릿에 적용하여 실제 적용되는 소스가 생성된다. 이 생성 과정은 gulpfile.js에 gulp taks로 정의되어 있다. 

이 gulp task를 실행하는 방법은 아래와 같다.

```
PARTI_ENV=development-proxy gulp reset
```

위에 예시는 PARTI_ENV에 development-proxy를 설정하고 있다. development환경으로 수행되며 proxy 설정한다는 뜻이다. development만을 주면 proxy설정 없이 쓸 수 있다. liveload를 이용하는 경우에 CORS문제로 인해 proxy 설정을 이용해야 한다.

이 gulp task는 npm script watch 구동 직전에 호출되기도 한다. npm script watch는 ionic cli이 만든 npm script 설정이나 ionic cli 자체에 의해 호출되는데 자세한 것은 ionic2 매뉴얼을 참조한다. ionic cli에 의해 npm script 설정은 package.json에 있다. ionic cli에 의해 위에 gulp task가 호출 될 때도 PARTI_ENV값을 인식할 수 있다.

### 템플릿 위치

settings/templates에 있다.

## 개발 환경 설정

### gulp를 설치

```
$ npm install -g gulp
```

## 개발

### 개발을 위한 ionic emulator 띄우기

로컬서버(http://parti.dev)와 연동하는 에뮬레이터 위에 앱은 아래와 같이 구동시킨다.

먼저 설정한다. 이 설정은 다른 환경으로 바꾸는 경우나 플랫폼에 설정을 건드리는 경우는 꼭 해야한다.
```
$ PARTI_ENV=development-proxy gulp reset
```

ios 경우 위의 gulp reset task를 수행하였다면 Keychain Sharing Capability를 설정해야 한다. /platforms/ios/앱이름.xcodeproj 파일을 연다. 프로젝트이름을 클릭하고 > Capabilities > Keychain Sharing을 on한 뒤 다시 빌드한다.

이제 에뮬레이터 위에 앱을 띄운다. target은 ios-sim showdevicetypes 명령을 통해 로컬에 있는 것을 적절히 고른다.
```
$ ionic emulate ios -l -c -s --target="iPhone-6s, 10.0" --address localhost
```

소스를 수정한 뒤 바로 적용되도록 하려면 다른 터미널 세션을 열어서 아래를 수행한다.
```
$ PARTI_ENV=development-proxy npm run watch
```

개발 도중에 플랫폼을 건드리지 않는 설정을 변경한 경우엔 gulp reset task를 할 필요가 없다. 또다른 터미널 세션에서 아래 명령으로 간단히 수행할 수 있다. 이 task를 수행하면 ios라도 플랫폼의 Keychain Sharing Capability 설정이 변경되지 않는다.
```
$ PARTI_ENV=development-proxy gulp config
```

### haml을 통한 레이아웃

src/pages 아래 haml은 동일한 폴더에 html로 컴파일 됩니다.
