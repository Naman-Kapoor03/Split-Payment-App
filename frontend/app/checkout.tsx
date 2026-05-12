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
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import * as Linking from "expo-linking";

import { useRouter } from "expo-router";

import api from "../services/api";

import { usePaymentStore } from "../store/payment.store";

export default function CheckoutScreen() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [selectedMethod, setSelectedMethod] =
    useState<string | null>(null);

  const {
    amount,
    receiver,
    group,
    groupId,
    receiverId,
    setPaymentData,
  } = usePaymentStore();

  const paymentMethods = [
    {
      id: "gpay",
      name: "Google Pay",
      type: "upi",
      icon: "🟢",
    },

    {
      id: "phonepe",
      name: "PhonePe",
      type: "upi",
      icon: "🟣",
    },

    {
      id: "paytm",
      name: "Paytm",
      type: "upi",
      icon: "🔵",
    },

    {
      id: "card",
      name:
        "Credit / Debit Card",
      type: "gateway",
      icon: "💳",
    },

    {
      id: "wallet",
      name: "Wallets",
      type: "gateway",
      icon: "👛",
    },

    {
      id: "netbanking",
      name: "Net Banking",
      type: "gateway",
      icon: "🏦",
    },
  ];

  const handlePayment =
    async (method: any) => {
      try {
        setLoading(true);

        setSelectedMethod(
          method.id
        );

        // CARD FLOW
        if (
          method.id ===
          "card"
        ) {
          router.push(
            "/card-payment"
          );

          return;
        }

        // CREATE PAYMENT
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

        const paymentLink =
          response.data.data
            .paymentLink;

        const transactionId =
          payment._id;

        setPaymentData({
          amount,

          receiver,

          group,

          paymentMethod:
            method.name,

          transactionId,

          paymentStatus:
            "pending",

          paymentLink,
        });

        // UPI FLOW
        if (
          method.type ===
          "upi"
        ) {
          const encodedReceiver =
            encodeURIComponent(
              receiver ||
                "Receiver"
            );

          const note =
            encodeURIComponent(
              "Split Payment"
            );

          const transactionRef =
            `TXN${Date.now()}`;

          // STATIC UPI ID
          const upiId =
            "nk0030802@oksbi";

          const commonParams =
            `pa=${upiId}&pn=${encodedReceiver}&tn=${note}&tr=${transactionRef}&am=${amount}&cu=INR`;

          const upiUrls: Record<
            string,
            string
          > = {
            gpay:
              `tez://upi/pay?${commonParams}`,

            phonepe:
              `phonepe://upi/pay?${commonParams}`,

            paytm:
              `paytmmp://pay?${commonParams}`,
          };

          const paymentUrl =
            upiUrls[
              method.id
            ];

          console.log(
            "Opening:",
            paymentUrl
          );

          const supported =
            await Linking.canOpenURL(
              paymentUrl
            );

          if (
            !supported
          ) {
            Alert.alert(
              "Error",
              `${method.name} is not installed`
            );

            return;
          }

          router.push(
            "/processing"
          );

          setTimeout(
            async () => {
              await Linking.openURL(
                paymentUrl
              );
            },
            500
          );

          return;
        }

        // OTHER PAYMENT METHODS
        router.push(
          "/payment-webview"
        );
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

        setSelectedMethod(
          null
        );
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
          <Text style={styles.title}>
            Complete Payment
          </Text>

          <Text
            style={styles.amount}
          >
            ₹{amount}
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            {group}
          </Text>
        </View>

        <Text style={styles.section}>
          UPI Apps
        </Text>

        {paymentMethods
          .filter(
            (item) =>
              item.type ===
              "upi"
          )
          .map((method) => (
            <TouchableOpacity
              key={method.id}
              style={
                styles.card
              }
              onPress={() =>
                handlePayment(
                  method
                )
              }
              disabled={loading}
            >
              <View
                style={
                  styles.left
                }
              >
                <Text
                  style={
                    styles.icon
                  }
                >
                  {
                    method.icon
                  }
                </Text>

                <Text
                  style={
                    styles.methodName
                  }
                >
                  {
                    method.name
                  }
                </Text>
              </View>

              {loading &&
              selectedMethod ===
                method.id ? (
                <ActivityIndicator />
              ) : (
                <Text
                  style={
                    styles.arrow
                  }
                >
                  →
                </Text>
              )}
            </TouchableOpacity>
          ))}

        <Text style={styles.section}>
          Other Payment Options
        </Text>

        {paymentMethods
          .filter(
            (item) =>
              item.type ===
              "gateway"
          )
          .map((method) => (
            <TouchableOpacity
              key={method.id}
              style={
                styles.card
              }
              onPress={() =>
                handlePayment(
                  method
                )
              }
              disabled={loading}
            >
              <View
                style={
                  styles.left
                }
              >
                <Text
                  style={
                    styles.icon
                  }
                >
                  {
                    method.icon
                  }
                </Text>

                <Text
                  style={
                    styles.methodName
                  }
                >
                  {
                    method.name
                  }
                </Text>
              </View>

              {loading &&
              selectedMethod ===
                method.id ? (
                <ActivityIndicator />
              ) : (
                <Text
                  style={
                    styles.arrow
                  }
                >
                  →
                </Text>
              )}
            </TouchableOpacity>
          ))}

        <View style={styles.footer}>
          <Text
            style={
              styles.footerText
            }
          >
            🔒 100% Secure Payments
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#FAFAFA",
      paddingHorizontal: 22,
      paddingTop: 60,
    },

    header: {
      alignItems: "center",
      marginBottom: 34,
    },

    title: {
      fontSize: 34,
      fontWeight: "700",
      color: "#111",
    },

    amount: {
      fontSize: 48,
      fontWeight: "700",
      color: "#111",
      marginTop: 12,
    },

    subtitle: {
      fontSize: 15,
      color: "#888",
      marginTop: 6,
    },

    section: {
      fontSize: 18,
      fontWeight: "700",
      color: "#111",
      marginBottom: 16,
      marginTop: 10,
    },

    card: {
      backgroundColor:
        "#fff",
      borderRadius: 22,
      padding: 20,
      marginBottom: 16,
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
    },

    left: {
      flexDirection: "row",
      alignItems: "center",
    },

    icon: {
      fontSize: 28,
      marginRight: 16,
    },

    methodName: {
      fontSize: 17,
      fontWeight: "600",
      color: "#111",
    },

    arrow: {
      fontSize: 22,
      color: "#999",
    },

    footer: {
      alignItems: "center",
      marginTop: 30,
      marginBottom: 40,
    },

    footerText: {
      color: "#777",
      fontSize: 14,
    },
  });