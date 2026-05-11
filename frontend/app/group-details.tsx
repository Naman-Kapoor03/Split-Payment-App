import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";

import { usePaymentStore } from "../store/payment.store";

import api from "../services/api";

export default function GroupDetails() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [group, setGroup] =
    useState<any>(null);

  const [expenses, setExpenses] =
    useState<any[]>([]);

  const {
    groupId,
    setPaymentData,
  } = usePaymentStore();

  useEffect(() => {
    fetchGroupDetails();
  }, []);

  const fetchGroupDetails =
    async () => {
      try {
        const response =
          await api.get(
            `/groups/${groupId}/details`
          );

        setGroup(
          response.data.data.group
        );

        setExpenses(
          response.data.data
            .expenses
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const handleSettle = (
    expense: any
  ) => {
    const splitAmount =
      expense.splitBetween.find(
        (split: any) =>
          split.user?._id !==
          expense.paidBy?._id
      )?.amount || 0;

    setPaymentData({
      amount: splitAmount,

      receiver:
        expense.paidBy?.name,

      receiverId:
        expense.paidBy?._id,

      group: group?.name,

      groupId,

      paymentMethod: "",

      transactionId: "",

      paymentStatus: "pending",
    });

    router.push("/checkout");
  };

  if (loading || !group) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#111"
        />
      </View>
    );
  }

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
          <Text style={styles.groupName}>
            {group.name}
          </Text>

          <Text style={styles.members}>
            {group.members?.length}{" "}
            Members
          </Text>
        </View>

        <TouchableOpacity
          style={styles.balanceButton}
          onPress={() =>
            router.push("/balances")
          }
        >
          <Text style={styles.balanceText}>
            View Balances
          </Text>
        </TouchableOpacity>

        <View style={styles.topRow}>
          <Text style={styles.sectionTitle}>
            Expenses
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              router.push(
                "/add-expense"
              )
            }
          >
            <Text style={styles.addText}>
              + Add
            </Text>
          </TouchableOpacity>
        </View>

        {expenses.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No expenses yet
            </Text>
          </View>
        )}

        {expenses.map((expense) => (
          <View
            key={expense._id}
            style={styles.expenseCard}
          >
            <View>
              <Text
                style={
                  styles.expenseTitle
                }
              >
                {expense.title}
              </Text>

              <Text
                style={
                  styles.expenseSubtitle
                }
              >
                Paid by{" "}
                {
                  expense.paidBy
                    ?.name
                }
              </Text>
            </View>

            <View
              style={{
                alignItems:
                  "flex-end",
              }}
            >
              <Text
                style={
                  styles.expenseAmount
                }
              >
                ₹{expense.amount}
              </Text>

              <TouchableOpacity
                style={
                  styles.settleButton
                }
                onPress={() =>
                  handleSettle(
                    expense
                  )
                }
              >
                <Text
                  style={
                    styles.settleText
                  }
                >
                  Settle
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },

  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 22,
    paddingTop: 60,
  },

  header: {
    marginBottom: 30,
  },

  groupName: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111",
  },

  members: {
    color: "#777",
    marginTop: 6,
    fontSize: 15,
  },

  balanceButton: {
    backgroundColor: "#111",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 24,
  },

  balanceText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  addButton: {
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },

  addText: {
    color: "#fff",
    fontWeight: "700",
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
  },

  emptyText: {
    color: "#777",
    fontSize: 16,
  },

  expenseCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  expenseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  expenseSubtitle: {
    color: "#777",
    marginTop: 6,
  },

  expenseAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },

  settleButton: {
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },

  settleText: {
    color: "#fff",
    fontWeight: "700",
  },
});