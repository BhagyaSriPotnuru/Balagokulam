package com.valueeducation;

import android.app.Dialog;
import android.os.Bundle;
import com.facebook.react.ReactActivity;

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
import com.cboy.rn.splashscreen.SplashScreen;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.imagepicker.ImagePickerPackage;
import com.audioStreaming.ReactNativeAudioStreamingPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;

import android.content.Intent;
import android.content.res.Configuration;
import android.view.View;
import android.widget.ImageView;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ValueEducation";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this,true);
        super.onCreate(savedInstanceState);
    }

     @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT) {
            SplashScreen.configurationChanged(R.drawable.launch_screen);
        } else if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
            SplashScreen.configurationChanged(R.drawable.land_screen);
        }
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }
}
