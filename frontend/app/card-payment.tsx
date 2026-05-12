import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";

import { useRouter } from "expo-router";

import api from "../services/api";

import { usePaymentStore } from "../store/payment.store";

export default function CardPaymentScreen() {
  const router = useRouter();

  const {
    amount,
    receiver,
    group,
    groupId,
    receiverId,
    setPaymentData,
  } = usePaymentStore();

  const [cardNumber, setCardNumber] =
    useState("");

  const [cardHolder, setCardHolder] =
    useState("");

  const [expiry, setExpiry] =
    useState("");

  const [cvv, setCvv] =
    useState("");

  const [savedCards, setSavedCards] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const flip = useSharedValue(0);

  useEffect(() => {
    loadSavedCards();
  }, []);

  const loadSavedCards =
    async () => {
      try {
        const cards =
          await AsyncStorage.getItem(
            "saved_cards"
          );

        if (cards) {
          setSavedCards(
            JSON.parse(cards)
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

  const saveCard =
    async () => {
      try {
        const masked =
          `•••• ${cardNumber
            .replace(/\s/g, "")
            .slice(-4)}`;

        const newCard = {
          cardNumber,
          masked,
          cardHolder,
          expiry,
        };

        const updatedCards = [
          newCard,
          ...savedCards.filter(
            (item) =>
              item.cardNumber !==
              cardNumber
          ),
        ];

        setSavedCards(
          updatedCards
        );

        await AsyncStorage.setItem(
          "saved_cards",
          JSON.stringify(
            updatedCards
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

  const fillSavedCard = (
    card: any
  ) => {
    setCardNumber(
      card.cardNumber
    );

    setCardHolder(
      card.cardHolder
    );

    setExpiry(card.expiry);
  };

  const cardBrand = useMemo(() => {
    const cleaned =
      cardNumber.replace(
        /\s/g,
        ""
      );

    if (
      cleaned.startsWith("4")
    )
      return "VISA";

    if (
      /^(5[1-5])/.test(
        cleaned
      )
    )
      return "MASTERCARD";

    if (
      /^(60)/.test(
        cleaned
      )
    )
      return "RUPAY";

    return "CARD";
  }, [cardNumber]);

  const formatCardNumber = (
    text: string
  ) => {
    return text
      .replace(/\D/g, "")
      .replace(
        /(.{4})/g,
        "$1 "
      )
      .trim()
      .slice(0, 19);
  };

  const formatExpiry = (
    text: string
  ) => {
    const cleaned =
      text.replace(
        /\D/g,
        ""
      );

    if (
      cleaned.length >= 3
    ) {
      return `${cleaned.slice(
        0,
        2
      )}/${cleaned.slice(
        2,
        4
      )}`;
    }

    return cleaned;
  };

  const frontAnimatedStyle =
    useAnimatedStyle(() => {
      return {
        transform: [
          {
            perspective: 1000,
          },
          {
            rotateY: `${
              flip.value ===
              1
                ? 180
                : 0
            }deg`,
          },
        ],
      };
    });

  const backAnimatedStyle =
    useAnimatedStyle(() => {
      return {
        position: "absolute",

        transform: [
          {
            perspective: 1000,
          },
          {
            rotateY: `${
              flip.value ===
              1
                ? 0
                : -180
            }deg`,
          },
        ],
      };
    });

  const handleContinue =
    async () => {
      if (
        !cardNumber ||
        !cardHolder ||
        !expiry ||
        !cvv
      ) {
        Alert.alert(
          "Error",
          "Please fill all card details"
        );

        return;
      }

      try {
        setLoading(true);

        await saveCard();

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

        setPaymentData({
          amount,

          receiver,

          group,

          paymentMethod:
            "Card",

          transactionId:
            payment._id,

          paymentStatus:
            "pending",

          paymentLink,
        });

        router.push(
          "/payment-webview"
        );
      } catch (error: any) {
        console.log(error);

        Alert.alert(
          "Error",
          error.response?.data
            ?.message ||
            "Payment failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS ===
        "ios"
          ? "padding"
          : undefined
      }
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        <Text style={styles.heading}>
          Card Payment
        </Text>

        {savedCards.length >
          0 && (
          <>
            <Text
              style={
                styles.savedTitle
              }
            >
              Saved Cards
            </Text>

            {savedCards.map(
              (
                item,
                index
              ) => (
                <TouchableOpacity
                  key={index}
                  style={
                    styles.savedCard
                  }
                  onPress={() =>
                    fillSavedCard(
                      item
                    )
                  }
                >
                  <View>
                    <Text
                      style={
                        styles.savedNumber
                      }
                    >
                      {
                        item.masked
                      }
                    </Text>

                    <Text
                      style={
                        styles.savedExpiry
                      }
                    >
                      Exp:
                      {
                        item.expiry
                      }
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.useText
                    }
                  >
                    USE
                  </Text>
                </TouchableOpacity>
              )
            )}
          </>
        )}

        <View style={styles.cardWrap}>
          <Animated.View
            style={[
              styles.card,
              frontAnimatedStyle,
            ]}
          >
            <LinearGradient
              colors={[
                "#111",
                "#2C2C2C",
              ]}
              style={
                styles.gradient
              }
            >
              <View
                style={
                  styles.topRow
                }
              >
                <Text
                  style={
                    styles.brand
                  }
                >
                  {
                    cardBrand
                  }
                </Text>

                <Text
                  style={
                    styles.chip
                  }
                >
                  ▣
                </Text>
              </View>

              <Text
                style={
                  styles.cardNumber
                }
              >
                {cardNumber ||
                  "**** **** **** ****"}
              </Text>

              <View
                style={
                  styles.bottomRow
                }
              >
                <View>
                  <Text
                    style={
                      styles.label
                    }
                  >
                    CARD HOLDER
                  </Text>

                  <Text
                    style={
                      styles.value
                    }
                  >
                    {cardHolder ||
                      "YOUR NAME"}
                  </Text>
                </View>

                <View>
                  <Text
                    style={
                      styles.label
                    }
                  >
                    EXPIRES
                  </Text>

                  <Text
                    style={
                      styles.value
                    }
                  >
                    {expiry ||
                      "MM/YY"}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              backAnimatedStyle,
            ]}
          >
            <LinearGradient
              colors={[
                "#111",
                "#2C2C2C",
              ]}
              style={
                styles.gradient
              }
            >
              <View
                style={
                  styles.blackStrip
                }
              />

              <View
                style={
                  styles.cvvBox
                }
              >
                <Text
                  style={
                    styles.cvvText
                  }
                >
                  {cvv || "***"}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        <TextInput
          placeholder="Card Number"
          placeholderTextColor="#999"
          value={cardNumber}
          keyboardType="numeric"
          onChangeText={(
            text
          ) =>
            setCardNumber(
              formatCardNumber(
                text
              )
            )
          }
          style={styles.input}
        />

        <TextInput
          placeholder="Card Holder Name"
          placeholderTextColor="#999"
          value={cardHolder}
          onChangeText={
            setCardHolder
          }
          style={styles.input}
        />

        <View style={styles.row}>
          <TextInput
            placeholder="MM/YY"
            placeholderTextColor="#999"
            value={expiry}
            keyboardType="numeric"
            onChangeText={(
              text
            ) =>
              setExpiry(
                formatExpiry(
                  text
                )
              )
            }
            style={[
              styles.input,
              styles.smallInput,
            ]}
          />

          <TextInput
            placeholder="CVV"
            placeholderTextColor="#999"
            value={cvv}
            keyboardType="numeric"
            secureTextEntry
            onFocus={() => {
              flip.value =
                withTiming(1);
            }}
            onBlur={() => {
              flip.value =
                withTiming(0);
            }}
            onChangeText={setCvv}
            style={[
              styles.input,
              styles.smallInput,
            ]}
          />
        </View>

        <TouchableOpacity
          style={styles.payButton}
          onPress={
            handleContinue
          }
          disabled={loading}
        >
          <Text
            style={
              styles.payText
            }
          >
            {loading
              ? "Processing..."
              : `Pay ₹${amount}`}
          </Text>
        </TouchableOpacity>

        <Text style={styles.secure}>
          🔒 Secured with webhook
          verification
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingTop: 60,
    paddingHorizontal: 22,
  },

  heading: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111",
    marginBottom: 24,
  },

  savedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 14,
  },

  savedCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  savedNumber: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },

  savedExpiry: {
    marginTop: 4,
    color: "#777",
  },

  useText: {
    color: "#111",
    fontWeight: "700",
  },

  cardWrap: {
    height: 230,
    marginBottom: 30,
    marginTop: 10,
  },

  card: {
    width: "100%",
    height: 220,
    borderRadius: 30,
    overflow: "hidden",
    backfaceVisibility:
      "hidden",
  },

  gradient: {
    flex: 1,
    padding: 24,
    justifyContent:
      "space-between",
  },

  topRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  brand: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },

  chip: {
    color: "#fff",
    fontSize: 32,
  },

  cardNumber: {
    color: "#fff",
    fontSize: 28,
    letterSpacing: 2,
    marginTop: 20,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
  },

  label: {
    color: "#AAA",
    fontSize: 12,
    marginBottom: 4,
  },

  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  blackStrip: {
    height: 50,
    backgroundColor: "#000",
    marginTop: 20,
  },

  cvvBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    alignItems: "flex-end",
    marginTop: 30,
  },

  cvvText: {
    fontSize: 18,
    fontWeight: "700",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    fontSize: 16,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent:
      "space-between",
  },

  smallInput: {
    width: "48%",
  },

  payButton: {
    backgroundColor: "#111",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 20,
  },

  payText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  secure: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
    marginBottom: 40,
  },
});