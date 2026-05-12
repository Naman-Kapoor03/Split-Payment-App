import React, {
  useRef,
  useState,
} from "react";

import {
  View,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
} from "react-native";

import {
  WebView,
  WebViewNavigation,
} from "react-native-webview";

import {
  useFocusEffect,
  useRouter,
} from "expo-router";

import { usePaymentStore } from "../store/payment.store";

export default function PaymentWebview() {
  const router = useRouter();

  const webviewRef =
    useRef<WebView>(null);

  const [loading, setLoading] =
    useState(true);

  const { paymentLink } =
    usePaymentStore();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress =
        () => {
          router.replace(
            "/processing"
          );

          return true;
        };

      BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () =>
        BackHandler.removeEventListener(
          "hardwareBackPress",
          onBackPress
        );
    }, [])
  );

  const handleNavigation =
    (
      navState: WebViewNavigation
    ) => {
      const url =
        navState.url;

      console.log(
        "WEBVIEW URL:",
        url
      );

      if (
        url.includes(
          "payment-success"
        )
      ) {
        router.replace(
          "/processing"
        );
      }

      if (
        url.includes(
          "payment-cancelled"
        )
      ) {
        router.replace(
          "/failed"
        );
      }
    };

  return (
    <View style={styles.container}>
      {loading && (
        <View
          style={styles.loader}
        >
          <ActivityIndicator
            size="large"
            color="#111"
          />
        </View>
      )}

      <WebView
        ref={webviewRef}
        source={{
          uri: paymentLink,
        }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        thirdPartyCookiesEnabled
        sharedCookiesEnabled
        allowsInlineMediaPlayback
        cacheEnabled
        originWhitelist={[
          "*",
        ]}
        mixedContentMode="always"
        setSupportMultipleWindows={
          false
        }
        onLoadEnd={() =>
          setLoading(false)
        }
        onNavigationStateChange={
          handleNavigation
        }
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#fff",
    },

    loader: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent:
        "center",
      alignItems: "center",
      backgroundColor:
        "#fff",
      zIndex: 999,
    },
  });