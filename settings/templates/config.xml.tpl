<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<widget id="<%= constants.appId %>" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
  <name><%= constants.appName %></name>
  <description>함께 만드는 온라인 광장1</description>
  <author email="help@parti.xyz" href="http://parti.xyz">빠흐띠</author>
  <% if (useProxy) { %>
  <content src="index.html"/>
  <access origin="*"/>
  <allow-navigation href="*" />
  <allow-intent href="*" />
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
  <feature name="StatusBar">
    <param name="ios-package" onload="true" value="CDVStatusBar"/>
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
</widget>