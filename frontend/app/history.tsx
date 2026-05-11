import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from "react-native";

import api from "../services/api";

export default function HistoryScreen() {
  const [payments, setPayments] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments =
    async () => {
      try {
        const response =
          await api.get(
            "/payments"
          );

        setPayments(
          response.data.data
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);

        setRefreshing(false);
      }
    };

  const onRefresh = () => {
    setRefreshing(true);

    fetchPayments();
  };

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "success":
        return "#16A34A";

      case "pending":
        return "#F59E0B";

      case "failed":
        return "#DC2626";

      default:
        return "#777";
    }
  };

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
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

      <Text style={styles.heading}>
        Payment History
      </Text>

      {payments.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>
            No Payments Yet
          </Text>

          <Text
            style={
              styles.emptySubtitle
            }
          >
            Your settlements and
            payment activity will
            appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) =>
            item._id
          }
          showsVerticalScrollIndicator={
            false
          }
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={
                onRefresh
              }
            />
          }
          contentContainerStyle={{
            paddingBottom: 40,
          }}
          renderItem={({ item }) => (
            <View
              style={
                styles.card
              }
            >
              <View
                style={
                  styles.topRow
                }
              >
                <View>
                  <Text
                    style={
                      styles.amount
                    }
                  >
                    ₹
                    {item.amount}
                  </Text>

                  <Text
                    style={
                      styles.group
                    }
                  >
                    {
                      item.group
                        ?.name
                    }
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        getStatusColor(
                          item.status
                        ),
                    },
                  ]}
                >
                  <Text
                    style={
                      styles.statusText
                    }
                  >
                    {
                      item.status
                    }
                  </Text>
                </View>
              </View>

              <View
                style={
                  styles.infoSection
                }
              >
                <View
                  style={
                    styles.row
                  }
                >
                  <Text
                    style={
                      styles.label
                    }
                  >
                    Paid By
                  </Text>

                  <Text
                    style={
                      styles.value
                    }
                  >
                    {
                      item.payer
                        ?.name
                    }
                  </Text>
                </View>

                <View
                  style={
                    styles.row
                  }
                >
                  <Text
                    style={
                      styles.label
                    }
                  >
                    Receiver
                  </Text>

                  <Text
                    style={
                      styles.value
                    }
                  >
                    {
                      item
                        .receiver
                        ?.name
                    }
                  </Text>
                </View>

                <View
                  style={
                    styles.row
                  }
                >
                  <Text
                    style={
                      styles.label
                    }
                  >
                    Date
                  </Text>

                  <Text
                    style={
                      styles.value
                    }
                  >
                    {formatDate(
                      item.createdAt
                    )}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
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
    paddingTop: 60,
    paddingHorizontal: 22,
  },

  heading: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111",
    marginBottom: 28,
  },

  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
  },

  emptySubtitle: {
    fontSize: 15,
    color: "#777",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 24,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 26,
    padding: 22,
    marginBottom: 18,
  },

  topRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  amount: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111",
  },

  group: {
    color: "#777",
    marginTop: 6,
    fontSize: 14,
  },

  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  statusText: {
    color: "#fff",
    fontWeight: "700",
    textTransform:
      "capitalize",
  },

  infoSection: {
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
    paddingTop: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 14,
  },

  label: {
    color: "#777",
    fontSize: 14,
  },

  value: {
    color: "#111",
    fontWeight: "600",
    fontSize: 14,
  },
});