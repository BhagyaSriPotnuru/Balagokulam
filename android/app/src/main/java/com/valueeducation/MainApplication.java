package com.valueeducation;

import android.app.Application;
import android.util.Log;

import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.RNPlayAudio.RNPlayAudioPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.pgsqlite.SQLitePluginPackage;
import com.github.yamill.orientation.OrientationPackage;
import net.no_mad.tts.TextToSpeechPackage;
import cl.json.RNSharePackage;
import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.imagepicker.ImagePickerPackage;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  @Override
  public void onCreate() {
      super.onCreate();
      System.setProperty("http.keepAlive", "false");
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new SQLitePluginPackage(),
          new OrientationPackage(),
          new TextToSpeechPackage(),
          new RNSharePackage(),
          new RNFSPackage(),
          new RNDeviceInfo(),
          new ReactNativePushNotificationPackage(),
          new SplashScreenReactPackage(),
          new GoogleAnalyticsBridgePackage(),
          new ImagePickerPackage(),
          new RNFetchBlobPackage(),
          new RNPlayAudioPackage(),
          new ReactNativeYouTube()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }   
}
