<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<widget id="<%= constants.appId %>" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
  <name><%= constants.appName %></name>
  <description>함께 만드는 온라인 광장1</description>
  <author email="help@parti.xyz" href="http://parti.xyz">빠흐띠</author>
  <content src="index.html"/>
  <% if (useProxy) { %>
  <access origin="*"/>
  <allow-navigation href="*" />
  <allow-intent href="*" />
  <% } else { %>
  <access origin="<%= constants.apiBaseUrl %>"/>
  <allow-navigation href="*" />
  <allow-intent href="<%= constants.apiBaseUrl %>" />
  <% } %>
  <allow-intent href="http://*/*"/>
  <allow-intent href="https://*/*"/>
  <allow-intent href="tel:*"/>
  <allow-intent href="sms:*"/>
  <allow-intent href="mailto:*"/>
  <allow-intent href="geo:*"/>
  <platform name="android">
    <allow-intent href="market:*"/>
    <icon src="resources/android/icon/drawable-ldpi-icon.png" density="ldpi"/>
    <icon src="resources/android/icon/drawable-mdpi-icon.png" density="mdpi"/>
    <icon src="resources/android/icon/drawable-hdpi-icon.png" density="hdpi"/>
    <icon src="resources/android/icon/drawable-xhdpi-icon.png" density="xhdpi"/>
    <icon src="resources/android/icon/drawable-xxhdpi-icon.png" density="xxhdpi"/>
    <icon src="resources/android/icon/drawable-xxxhdpi-icon.png" density="xxxhdpi"/>
    <splash src="resources/android/splash/drawable-land-ldpi-screen.png" density="land-ldpi"/>
    <splash src="resources/android/splash/drawable-land-mdpi-screen.png" density="land-mdpi"/>
    <splash src="resources/android/splash/drawable-land-hdpi-screen.png" density="land-hdpi"/>
    <splash src="resources/android/splash/drawable-land-xhdpi-screen.png" density="land-xhdpi"/>
    <splash src="resources/android/splash/drawable-land-xxhdpi-screen.png" density="land-xxhdpi"/>
    <splash src="resources/android/splash/drawable-land-xxxhdpi-screen.png" density="land-xxxhdpi"/>
    <splash src="resources/android/splash/drawable-port-ldpi-screen.png" density="port-ldpi"/>
    <splash src="resources/android/splash/drawable-port-mdpi-screen.png" density="port-mdpi"/>
    <splash src="resources/android/splash/drawable-port-hdpi-screen.png" density="port-hdpi"/>
    <splash src="resources/android/splash/drawable-port-xhdpi-screen.png" density="port-xhdpi"/>
    <splash src="resources/android/splash/drawable-port-xxhdpi-screen.png" density="port-xxhdpi"/>
    <splash src="resources/android/splash/drawable-port-xxxhdpi-screen.png" density="port-xxxhdpi"/>
  </platform>
  <platform name="ios">
    <allow-intent href="itms:*"/>
    <allow-intent href="itms-apps:*"/>
    <icon src="resources/ios/icon/icon.png" width="57" height="57"/>
    <icon src="resources/ios/icon/icon@2x.png" width="114" height="114"/>
    <icon src="resources/ios/icon/icon-40.png" width="40" height="40"/>
    <icon src="resources/ios/icon/icon-40@2x.png" width="80" height="80"/>
    <icon src="resources/ios/icon/icon-40@3x.png" width="120" height="120"/>
    <icon src="resources/ios/icon/icon-50.png" width="50" height="50"/>
    <icon src="resources/ios/icon/icon-50@2x.png" width="100" height="100"/>
    <icon src="resources/ios/icon/icon-60.png" width="60" height="60"/>
    <icon src="resources/ios/icon/icon-60@2x.png" width="120" height="120"/>
    <icon src="resources/ios/icon/icon-60@3x.png" width="180" height="180"/>
    <icon src="resources/ios/icon/icon-72.png" width="72" height="72"/>
    <icon src="resources/ios/icon/icon-72@2x.png" width="144" height="144"/>
    <icon src="resources/ios/icon/icon-76.png" width="76" height="76"/>
    <icon src="resources/ios/icon/icon-76@2x.png" width="152" height="152"/>
    <icon src="resources/ios/icon/icon-83.5@2x.png" width="167" height="167"/>
    <icon src="resources/ios/icon/icon-small.png" width="29" height="29"/>
    <icon src="resources/ios/icon/icon-small@2x.png" width="58" height="58"/>
    <icon src="resources/ios/icon/icon-small@3x.png" width="87" height="87"/>
    <splash src="resources/ios/splash/Default-568h@2x~iphone.png" width="640" height="1136"/>
    <splash src="resources/ios/splash/Default-667h.png" width="750" height="1334"/>
    <splash src="resources/ios/splash/Default-736h.png" width="1242" height="2208"/>
    <splash src="resources/ios/splash/Default-Landscape-736h.png" width="2208" height="1242"/>
    <splash src="resources/ios/splash/Default-Landscape@2x~ipad.png" width="2048" height="1536"/>
    <splash src="resources/ios/splash/Default-Landscape@~ipadpro.png" width="2732" height="2048"/>
    <splash src="resources/ios/splash/Default-Landscape~ipad.png" width="1024" height="768"/>
    <splash src="resources/ios/splash/Default-Portrait@2x~ipad.png" width="1536" height="2048"/>
    <splash src="resources/ios/splash/Default-Portrait@~ipadpro.png" width="2048" height="2732"/>
    <splash src="resources/ios/splash/Default-Portrait~ipad.png" width="768" height="1024"/>
    <splash src="resources/ios/splash/Default@2x~iphone.png" width="640" height="960"/>
    <splash src="resources/ios/splash/Default~iphone.png" width="320" height="480"/>
  </platform>
  <preference name="webviewbounce" value="false"/>
  <preference name="UIWebViewBounce" value="false"/>
  <preference name="DisallowOverscroll" value="true"/>
  <preference name="android-minSdkVersion" value="16"/>
  <preference name="BackupWebStorage" value="none"/>
  <preference name="AutoHideSplashScreen" value="false"/>
  <preference name="SplashScreen" value="screen"/>
  <preference name="orientation" value="portrait" />
  <preference name="SplashScreenDelay" value="10000"/>
  <preference name="ShowSplashScreenSpinner" value="false"/>
  <preference name="FadeSplashScreen" value="true"/>
  <preference name="FadeSplashScreenDuration" value="750"/>
  <preference name="SplashScreenBackgroundColor" value="0xFFFFFFFF"/>
  <preference name="KeyboardDisplayRequiresUserAction" value="false"/>
  <preference name="TwitterConsumerKey" value="<%= secrets.twitterConsumerKey %>" />
  <preference name="TwitterConsumerSecret" value="<%= secrets.twitterConsumerSecret %>" />
  <feature name="StatusBar">
    <param name="ios-package" onload="true" value="CDVStatusBar"/>
    <param name="ios-package" value="CDVCamera" />
    <param name="android-package" value="org.apache.cordova.CameraLauncher" />
  </feature>
  <plugin name="cordova-plugin-device" spec="~1.1.3"/>
  <plugin name="cordova-plugin-console" spec="~1.0.4"/>
  <plugin name="cordova-plugin-whitelist" spec="~1.3.0"/>
  <plugin name="cordova-plugin-splashscreen" spec="~4.0.0"/>
  <plugin name="cordova-plugin-statusbar" spec="~2.2.0"/>
  <plugin name="cordova-plugin-transport-security"/>
  <plugin name="cordova-plugin-nativestorage"/>
  <plugin name="ionic-plugin-keyboard" spec="~2.2.1"/>
  <plugin name="cordova-plugin-facebook4" spec="~1.7.4">
    <variable name="APP_ID" value="<%= constants.facebookAppId %>" />
    <variable name="APP_NAME" value="<%= constants.facebookAppName %>" />
  </plugin>
  <plugin name="cordova-plugin-inappbrowser" spec="1.5.0"/>
  <plugin name="cordova-plugin-file-opener2" spec="2.0.2"/>
  <plugin name="cordova-plugin-file-transfer" spec="1.6.0"/>
  <plugin name="twitter-connect-plugin" source="npm" spec="0.6.0">
    <param name="FABRIC_KEY" value="<%= secrets.fabricKey %>" />
  </plugin>
  <% if (!useProxy) { %>
  <plugin name="cordova-plugin-crosswalk-webview" spec="~2.2.0">
    <variable name="XWALK_VERSION" value="22+" />
    <variable name="XWALK_LITEVERSION" value="xwalk_core_library_canary:17+" />
    <variable name="XWALK_COMMANDLINE" value="--disable-pull-to-refresh-effect" />
    <variable name="XWALK_MODE" value="embedded" />
    <variable name="XWALK_MULTIPLEAPK" value="true" />
  </plugin>
  <% } %>
</widget>
