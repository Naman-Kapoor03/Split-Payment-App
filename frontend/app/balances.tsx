import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import api from "../services/api";

import { usePaymentStore } from "../store/payment.store";

export default function BalancesScreen() {
  const [loading, setLoading] =
    useState(true);

  const [balances, setBalances] =
    useState<any>({});

  const [settlements, setSettlements] =
    useState<any[]>([]);

  const { groupId, group } =
    usePaymentStore();

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances =
    async () => {
      try {
        const response =
          await api.get(
            `/groups/${groupId}/balances`
          );

        setBalances(
          response.data.balances
        );

        setSettlements(
          response.data
            .settlements || []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
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
          <Text style={styles.title}>
            Balances
          </Text>

          <Text style={styles.subtitle}>
            {group}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Member Balances
        </Text>

        {Object.keys(balances)
          .length === 0 && (
          <View style={styles.emptyCard}>
            <Text
              style={styles.emptyText}
            >
              No balances yet
            </Text>
          </View>
        )}

        {Object.entries(
          balances
        ).map(
          ([name, amount]: any) => (
            <View
              key={name}
              style={styles.card}
            >
              <View>
                <Text
                  style={
                    styles.name
                  }
                >
                  {name}
                </Text>

                <Text
                  style={
                    styles.status
                  }
                >
                  {amount > 0
                    ? "Gets Back"
                    : "Owes"}
                </Text>
              </View>

              <Text
                style={[
                  styles.amount,
                  {
                    color:
                      amount > 0
                        ? "#16A34A"
                        : "#DC2626",
                  },
                ]}
              >
                ₹
                {Math.abs(
                  amount
                ).toFixed(2)}
              </Text>
            </View>
          )
        )}

        <Text style={styles.sectionTitle}>
          Simplified Settlements
        </Text>

        {settlements.length === 0 && (
          <View style={styles.emptyCard}>
            <Text
              style={styles.emptyText}
            >
              All settled up 🎉
            </Text>
          </View>
        )}

        {settlements.map(
          (
            settlement,
            index
          ) => (
            <View
              key={index}
              style={
                styles.settlementCard
              }
            >
              <View
                style={
                  styles.settlementRow
                }
              >
                <Text
                  style={
                    styles.from
                  }
                >
                  {
                    settlement.from
                  }
                </Text>

                <Text
                  style={
                    styles.arrow
                  }
                >
                  pays
                </Text>

                <Text
                  style={styles.to}
                >
                  {
                    settlement.to
                  }
                </Text>
              </View>

              <Text
                style={
                  styles.settlementAmount
                }
              >
                ₹
                {settlement.amount.toFixed(
                  2
                )}
              </Text>
            </View>
          )
        )}
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

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111",
  },

  subtitle: {
    color: "#777",
    marginTop: 6,
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 18,
    marginTop: 10,
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    marginBottom: 18,
  },

  emptyText: {
    color: "#777",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  status: {
    color: "#777",
    marginTop: 6,
  },

  amount: {
    fontSize: 22,
    fontWeight: "700",
  },

  settlementCard: {
    backgroundColor: "#111",
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },

  settlementRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  from: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },

  arrow: {
    color: "#AAA",
    fontSize: 14,
    marginHorizontal: 10,
  },

  to: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    textAlign: "right",
  },

  settlementAmount: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 18,
  },
});