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
  </platform>
  <platform name="ios">
    <allow-intent href="itms:*"/>
    <allow-intent href="itms-apps:*"/>
  </platform>
  <preference name="webviewbounce" value="false"/>
  <preference name="UIWebViewBounce" value="false"/>
  <preference name="DisallowOverscroll" value="true"/>
  <preference name="android-minSdkVersion" value="16"/>
  <preference name="BackupWebStorage" value="none"/>
  <preference name="SplashScreenDelay" value="0"/>
  <preference name="FadeSplashScreen" value="false"/>
  <preference name="FadeSplashScreenDuration" value="0"/>
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
