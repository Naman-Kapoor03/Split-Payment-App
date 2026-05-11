import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";

import { usePaymentStore } from "../store/payment.store";

import api from "../services/api";

export default function ProcessingScreen() {
  const router = useRouter();

  const [seconds, setSeconds] =
    useState(0);

  const [statusText, setStatusText] =
    useState(
      "Waiting for payment confirmation"
    );

  const pulseAnim = useRef(
    new Animated.Value(1)
  ).current;

  const attemptsRef = useRef(0);

  const {
    transactionId,
    setPaymentData,
  } = usePaymentStore();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          pulseAnim,
          {
            toValue: 1.08,
            duration: 800,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          pulseAnim,
          {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }
        ),
      ])
    ).start();

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const pollPayment =
      setInterval(async () => {
        try {
          attemptsRef.current++;

          console.log(
            "Checking payment..."
          );

          console.log(
            "Attempts:",
            attemptsRef.current
          );

          const response =
            await api.get(
              `/payments/${transactionId}`
            );

          const payment =
            response.data.data;

          console.log(
            "Payment Status:",
            payment.status
          );

          if (
            payment.status ===
            "success"
          ) {
            clearInterval(
              pollPayment
            );

            clearInterval(timer);

            setPaymentData({
              paymentStatus:
                "success",
            });

            setStatusText(
              "Payment successful"
            );

            setTimeout(() => {
              router.replace(
                "/success"
              );
            }, 1000);
          }

          if (
            payment.status ===
            "failed"
          ) {
            clearInterval(
              pollPayment
            );

            clearInterval(timer);

            setPaymentData({
              paymentStatus:
                "failed",
            });

            setStatusText(
              "Payment failed"
            );

            setTimeout(() => {
              router.replace(
                "/failed"
              );
            }, 1000);
          }

          if (
            payment.status ===
            "cancelled"
          ) {
            clearInterval(
              pollPayment
            );

            clearInterval(timer);

            setPaymentData({
              paymentStatus:
                "cancelled",
            });

            setStatusText(
              "Payment cancelled"
            );

            setTimeout(() => {
              router.replace(
                "/failed"
              );
            }, 1000);
          }

          if (
            attemptsRef.current >=
            5
          ) {
            clearInterval(
              pollPayment
            );

            clearInterval(timer);

            setPaymentData({
              paymentStatus:
                "timeout",
            });

            setStatusText(
              "Payment timed out"
            );

            setTimeout(() => {
              router.replace(
                "/failed"
              );
            }, 1500);
          }
        } catch (error) {
          console.log(error);

          clearInterval(
            pollPayment
          );

          clearInterval(timer);

          setStatusText(
            "Unable to verify payment"
          );

          setTimeout(() => {
            router.replace(
              "/failed"
            );
          }, 1500);
        }
      }, 2000);

    return () => {
      clearInterval(timer);

      clearInterval(
        pollPayment
      );
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.loaderCircle,
          {
            transform: [
              {
                scale:
                  pulseAnim,
              },
            ],
          },
        ]}
      >
        <Text style={styles.loaderIcon}>
          ₹
        </Text>
      </Animated.View>

      <Text style={styles.title}>
        Processing Payment
      </Text>

      <Text style={styles.subtitle}>
        {statusText}
      </Text>

      <View style={styles.timerBox}>
        <Text style={styles.timer}>
          {seconds}s
        </Text>
      </View>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() =>
          router.replace("/")
        }
      >
        <Text style={styles.cancelText}>
          Cancel Payment
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Please do not close the app
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  loaderCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },

  loaderIcon: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "700",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    lineHeight: 24,
  },

  timerBox: {
    marginTop: 34,
    backgroundColor: "#fff",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 18,
  },

  timer: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  cancelButton: {
    marginTop: 30,
    backgroundColor: "#111",
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 18,
  },

  cancelText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  footer: {
    position: "absolute",
    bottom: 60,
    fontSize: 14,
    color: "#AAA",
  },
});