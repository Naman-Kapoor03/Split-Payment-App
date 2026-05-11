import React, {
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
} from "react-native";

import * as Linking from "expo-linking";

import PaymentCard from "../components/payment/PaymentCard";

import paymentMethods from "../constants/paymentMethods";

import { useRouter } from "expo-router";

import { usePaymentStore } from "../store/payment.store";

import api from "../services/api";

export default function CheckoutScreen() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [selectedMethod, setSelectedMethod] =
    useState<string | null>(
      null
    );

  const {
    amount,
    receiver,
    receiverId,
    group,
    groupId,
    setPaymentData,
  } = usePaymentStore();

  const handlePayment =
    async (method: any) => {
      try {
        setLoading(true);

        setSelectedMethod(
          method.id
        );

        const response =
          await api.post(
            "/payments",
            {
              groupId,

              receiverId,

              amount,
            }
          );

        const payment =
          response.data.data
            .payment;

        console.log(
          "FULL PAYMENT:",
          payment
        );

        const receiverUpiId =
          payment.receiver
            ?.upiId;

        console.log(
          "Receiver UPI:",
          receiverUpiId
        );

        if (!receiverUpiId) {
          Alert.alert(
            "Error",
            "Receiver UPI ID not found"
          );

          return;
        }

        setPaymentData({
          paymentMethod:
            method.name,

          transactionId:
            payment._id,

          paymentStatus:
            "processing",
        });

        const encodedReceiver =
  encodeURIComponent(
    receiver
  );

const upiUrls: Record<
  string,
  string
> = {
  gpay:
    `upi://pay?pa=${receiverUpiId}&pn=${encodedReceiver}&am=${amount}&cu=INR`,

  phonepe:
    `phonepe://pay?pa=${receiverUpiId}&pn=${encodedReceiver}&am=${amount}&cu=INR`,

  paytm:
    `paytmmp://pay?pa=${receiverUpiId}&pn=${encodedReceiver}&am=${amount}&cu=INR`,
};
        if (
          method.type === "upi"
        ) {
          const paymentUrl =
            upiUrls[method.id];

          console.log(
            "UPI URL:",
            paymentUrl
          );

          router.push(
            "/processing"
          );

          await Linking.openURL(
            paymentUrl
          );
        }

        if (
          method.type === "card"
        ) {
          Alert.alert(
            "Coming Soon",
            "Card payments integration coming soon"
          );
        }

        if (
          method.type ===
          "wallet"
        ) {
          Alert.alert(
            "Coming Soon",
            "Wallet integration coming soon"
          );
        }
      } catch (error: any) {
        console.log(
          "PAYMENT ERROR:",
          error.response?.data ||
            error
        );

        Alert.alert(
          "Error",
          error.response?.data
            ?.message ||
            "Payment failed"
        );
      } finally {
        setLoading(false);

        setSelectedMethod(null);
      }
    };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Secure Checkout
            </Text>
          </View>

          <Text style={styles.amount}>
            ₹{amount}
          </Text>

          <Text style={styles.subtitle}>
            Choose payment method
          </Text>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>
            Payment Summary
          </Text>

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
              Amount
            </Text>

            <Text style={styles.value}>
              ₹{amount}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Pay To
            </Text>

            <Text style={styles.value}>
              {receiver}
            </Text>
          </View>
        </View>

        {paymentMethods.map(
          (section) => (
            <View
              key={section.category}
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                {section.category}
              </Text>

              {section.methods.map(
                (method) => (
                  <PaymentCard
                    key={method.id}
                    name={method.name}
                    subtitle={
                      method.subtitle
                    }
                    color={
                      method.color
                    }
                    bgColor={
                      method.bgColor
                    }
                    logo={method.logo}
                    loading={
                      loading &&
                      selectedMethod ===
                        method.id
                    }
                    selected={
                      selectedMethod ===
                      method.id
                    }
                    onPress={() =>
                      handlePayment(
                        method
                      )
                    }
                  />
                )
              )}
            </View>
          )
        )}

        <View style={styles.footer}>
          <Text
            style={styles.footerText}
          >
            🔒 100% Secure Payments
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 22,
    paddingTop: 60,
  },

  header: {
    alignItems: "center",
    marginBottom: 34,
  },

  badge: {
    backgroundColor: "#EFEFEF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
  },

  badgeText: {
    fontSize: 12,
    color: "#777",
    fontWeight: "600",
  },

  amount: {
    fontSize: 48,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: "#888",
  },

  summary: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 28,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 14,
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

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
    marginTop: 10,
  },

  footer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },

  footerText: {
    color: "#AAA",
    fontSize: 13,
  },
});