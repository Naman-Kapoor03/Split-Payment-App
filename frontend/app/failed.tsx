import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";

import { usePaymentStore } from "../store/payment.store";

export default function FailedScreen() {
  const router = useRouter();

  const {
    amount,
    receiver,
    paymentMethod,
  } = usePaymentStore();

  return (
    <View style={styles.container}>
      <View style={styles.failedCircle}>
        <Text style={styles.cross}>
          ✕
        </Text>
      </View>

      <Text style={styles.title}>
        Payment Failed
      </Text>

      <Text style={styles.subtitle}>
        Your payment could not be
        completed
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>
            Amount
          </Text>

          <Text style={styles.value}>
            ₹{amount}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Receiver
          </Text>

          <Text style={styles.value}>
            {receiver}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Method
          </Text>

          <Text style={styles.value}>
            {paymentMethod}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Reason
          </Text>

          <Text style={styles.failedText}>
            Transaction timed out
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={() =>
          router.replace(
            "/checkout"
          )
        }
      >
        <Text
          style={
            styles.retryButtonText
          }
        >
          Retry Payment
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() =>
          router.replace("/")
        }
      >
        <Text
          style={
            styles.homeButtonText
          }
        >
          Back To Home
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  failedCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  cross: {
    color: "#fff",
    fontSize: 60,
    fontWeight: "700",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 34,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
    marginBottom: 26,
  },

  row: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    color: "#777",
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  failedText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#DC2626",
  },

  retryButton: {
    backgroundColor: "#111",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 14,
  },

  retryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  homeButton: {
    borderWidth: 1,
    borderColor: "#DDD",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  homeButtonText: {
    color: "#111",
    fontSize: 17,
    fontWeight: "600",
  },
});