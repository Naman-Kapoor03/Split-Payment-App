import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";

import { usePaymentStore } from "../store/payment.store";

export default function SuccessScreen() {
  const router = useRouter();

  const {
    amount,
    receiver,
    paymentMethod,
    transactionId,
    group,
  } = usePaymentStore();

  return (
    <View style={styles.container}>
      <View style={styles.successCircle}>
        <Text style={styles.checkmark}>
          ✓
        </Text>
      </View>

      <Text style={styles.title}>
        Payment Successful
      </Text>

      <Text style={styles.subtitle}>
        Your split payment was
        completed successfully
      </Text>

      <View style={styles.receiptCard}>
        <Text style={styles.receiptTitle}>
          Receipt
        </Text>

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
            Paid To
          </Text>

          <Text style={styles.value}>
            {receiver}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Group
          </Text>

          <Text style={styles.value}>
            {group}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Payment Method
          </Text>

          <Text style={styles.value}>
            {paymentMethod}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Transaction ID
          </Text>

          <Text style={styles.transaction}>
            {transactionId}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.replace("/")
        }
      >
        <Text style={styles.buttonText}>
          Back To Home
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        🔒 Secured by UPI
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  checkmark: {
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

  receiptCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
    width: "100%",
    marginBottom: 30,
  },

  receiptTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 22,
    color: "#111",
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

  transaction: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
    maxWidth: 180,
  },

  button: {
    backgroundColor: "#111",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  footer: {
    marginTop: 30,
    color: "#AAA",
    fontSize: 13,
  },
});