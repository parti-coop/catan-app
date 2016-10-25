# 빠띠

## 로컬 개발 환경 설정

### 설치

ios 개발 환경과 android 개발환경, nodejs, cordova, ionic이 이미 설치되어 있어야 합니다. nodejs버전 관리를 위해 nvm을 사용합니다.

라이브러리를 다운로드 받습니다.

```
$ npm install -g gulp
$ npm install
```

확장 설정 파일을 만듭니다.

```
$ cp ./settings/config-extends.yml.sample ./settings/config-extends.yml
```

위 파일에 내용을 채웁니다. 우선 development 환경만 설정합니다.

```
development:
  apiClientId: "클라이언트 아이디키"
  apiClientSecret: "클라이언트 비밀키"
staging:
  apiClientId: "x"
  apiClientSecret: "x"
production:
  apiClientId: "x"
  apiClientSecret: "x"
```

클라이언트 아이디키와 클라이언트 비밀키는 로컬 카탄( https://github.com/parti-xyz/catan-web ) http://parti.dev/oauth/applications 을 접속해 테스트할 어플리케이션에 설정된 키 값들을 넣습니다. 적절한 어플리케이션이 없으면 등록합니다. 등록할 때 redirect_uri는 urn:ietf:wg:oauth:2.0:oob로 입력하면 됩니다.

아래 명령을 수행하여 세팅을 수행합니다.

```
$ PARTI_ENV=development-proxy gulp reset
```

이후 ios Keychain Sharing Capability를 설정해야 합니다. /platforms/ios/앱이름.xcodeproj 파일을 연다. 프로젝트이름을 클릭하고 > Capabilities > Keychain Sharing을 on 합니다.


## 개발

### 개발을 위한 ios ionic emulator 띄우기

로컬서버(http://parti.dev)와 연동하는 에뮬레이터 위에 앱은 아래와 같이 구동시킵니다. target은 ios-sim showdevicetypes 명령을 통해 로컬에 있는 것을 적절히 고릅니다.
```
$ ionic emulate ios -l -c -s --target="iPhone-6s, 10.0" --address localhost
```

소스를 수정한 뒤 바로 적용되도록 하려면 다른 터미널 세션을 열어서 아래를 수행합니다.
```
$ PARTI_ENV=development-proxy npm run watch
```

현재 환경에서 다른 환경으로 바꾸거나 cordova 관련된 설정을 바꾼 경우엔 아래 명령을 수행하고 에뮬레이터를 중단했다가 다시 시작해야 합니다. cordova 관련된 설정은 페이스북 접속 설정과 앱ID 변경, cordova plugin 추가/삭제가 있습니다. 다른 경우가 있다면 추가해 주세요.

```
$ PARTI_ENV=development-proxy gulp reset
```

위의 gulp reset task를 수행하였다면 ios Keychain Sharing Capability를 설정해야 합니다. /platforms/ios/앱이름.xcodeproj 파일을 열고, 프로젝트이름을 클릭하고 > Capabilities > Keychain Sharing을 on한 뒤 다시 에뮬레이터를 띄웁니다.

아래 명령으로 설정 관련된 소스만 재생성할 수도 있습니다.

```
$ PARTI_ENV=development-proxy gulp settings
```

다만 이 명령에는 한계가 있습니다. 소스만 재생성할 뿐 플랫폼이나 cordova plugin을 건들지 않는데요. 해서 npm run watch 중이 아니면서, 현재 세팅된 동일한 환경하에서 플랫폼 무관한 관련 설정을 바꾸는 경우에 유용합니다. 이 명령은 플랫폼을 건드리지 않으므로 ios Keychain Sharing Capability 설정 해놓은게 변경되지는 않습니다.

### 개발을 위한 android emulator 띄우기

안드로이드 에뮬레이터가 너무 느려서 Genymotion을 이용합니다. Genymotion에 ADB설정을 안드로이드 개발 플랫폼에 있는 ADB로 설정합니다.

Genymotion에 적절한 에뮬레이터를 먼저 구동합니다. 그후 아래 명령어를 수행하여 앱을 설치합니다.
```
ionic run android -l -c -s
```

소스를 수정한 뒤 바로 적용되도록 하려면 다른 터미널 세션을 열어서 아래를 수행합니다.
```
$ PARTI_ENV=development-proxy npm run watch
```

현재 환경에서 다른 환경으로 바꾸거나 cordova 관련된 설정을 바꾼 경우엔 아래 명령을 수행하고 에뮬레이터를 중단했다가 다시 시작해야 합니다. cordova 관련된 설정은 페이스북 접속 설정과 앱ID 변경, cordova plugin 추가/삭제가 있습니다. 다른 경우가 있다면 추가해 주세요.

```
$ PARTI_ENV=development-proxy gulp reset
```

위의 gulp reset task를 수행하였다면 다시 에뮬레이터를 띄웁니다.

아래 명령으로 설정 관련된 소스만 재생성할 수도 있습니다.

```
$ PARTI_ENV=development-proxy gulp settings
```

### 개발 중에 화면 디버깅

https://ionicframework.com/docs/v2/resources/developer-tips/#debugging-ios-safari

https://ionicframework.com/docs/v2/resources/developer-tips/#debugging-android-chrome

### 설정

#### 설정값 관리

settings/config.yml에 설정합니다. 이 값을 settings 아래 템플릿에 적용하여 실제 적용되는 소스가 생성됩니다. 이 생성 과정은 gulpfile.js에 gulp taks로 정의되어 있습니다. 

이 gulp task를 실행하는 방법은 아래와 같습니다.

```
PARTI_ENV=development-proxy gulp reset
```

위에 예시는 PARTI_ENV에 development-proxy를 설정하고 있습니다. development환경으로 수행되며 proxy 설정한다는 뜻입니다. development만을 주면 proxy설정 없이 쓸 수 있습니다. liveload를 이용하는 경우에 CORS문제로 인해 proxy 설정을 이용해야 합니다.

이 gulp task는 npm script watch 구동 직전에 호출되기도 합니다. npm script watch는 ionic cli이 만든 npm script 설정이나 ionic cli 자체에 의해 호출되는데 자세한 것은 ionic2 매뉴얼을 참조합니다. ionic cli에 의해 npm script 설정은 package.json에 있습니다. ionic cli에 의해 위에 gulp task가 호출 될 때도 PARTI_ENV값을 인식할 수 있습니다.

#### 설정 템플릿 위치

settings/templates에 있습니다.

### haml을 통한 레이아웃

src/pages 아래 haml은 동일한 폴더에 html로 컴파일 됩니다. 확장자는 .html.haml이어야 합니다.
