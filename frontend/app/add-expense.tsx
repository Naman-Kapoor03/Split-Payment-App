import React, {
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from "react-native";

import { useRouter } from "expo-router";

import api from "../services/api";

import { usePaymentStore } from "../store/payment.store";

export default function AddExpense() {
  const router = useRouter();

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [category, setCategory] =
    useState("Other");

  const { groupId } =
    usePaymentStore();

  const categories = [
    {
      name: "Food",
      icon: "🍔",
    },

    {
      name: "Travel",
      icon: "✈️",
    },

    {
      name: "Shopping",
      icon: "🛍️",
    },

    {
      name: "Bills",
      icon: "💡",
    },

    {
      name:
        "Entertainment",
      icon: "🎬",
    },

    {
      name: "Other",
      icon: "📦",
    },
  ];

  const handleAddExpense =
    async () => {
      if (
        !title ||
        !amount
      ) {
        Alert.alert(
          "Error",
          "Please fill all fields"
        );

        return;
      }

      try {
        setLoading(true);

        await api.post(
          "/expenses",
          {
            title,

            amount:
              Number(
                amount
              ),

            groupId,

            category,
          }
        );

        Alert.alert(
          "Success",
          "Expense added successfully"
        );

        router.back();
      } catch (error: any) {
        console.log(error);

        Alert.alert(
          "Error",
          error.response?.data
            ?.message ||
            "Failed to add expense"
        );
      } finally {
        setLoading(false);
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
        <Text style={styles.heading}>
          Add Expense
        </Text>

        <Text style={styles.label}>
          Expense Title
        </Text>

        <TextInput
          placeholder="Dinner, Hotel, Fuel..."
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <Text style={styles.label}>
          Amount
        </Text>

        <TextInput
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>
          Category
        </Text>

        <View
          style={
            styles.categoryContainer
          }
        >
          {categories.map(
            (item) => (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor:
                      category ===
                      item.name
                        ? "#111"
                        : "#fff",
                  },
                ]}
                onPress={() =>
                  setCategory(
                    item.name
                  )
                }
              >
                <Text
                  style={
                    styles.categoryIcon
                  }
                >
                  {item.icon}
                </Text>

                <Text
                  style={[
                    styles.categoryText,
                    {
                      color:
                        category ===
                        item.name
                          ? "#fff"
                          : "#111",
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={
            handleAddExpense
          }
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={
                styles.buttonText
              }
            >
              Add Expense
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 24,
    paddingTop: 70,
  },

  heading: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111",
    marginBottom: 40,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    fontSize: 16,
    marginBottom: 24,
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
    marginBottom: 30,
  },

  categoryButton: {
    width: "48%",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 14,
  },

  categoryIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  categoryText: {
    fontSize: 15,
    fontWeight: "700",
  },

  button: {
    backgroundColor: "#111",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});