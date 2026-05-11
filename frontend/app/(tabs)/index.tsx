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

import { usePaymentStore } from "../../store/payment.store";

import api from "../../services/api";

export default function Index() {
  const router = useRouter();

  const [groups, setGroups] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const setPaymentData =
    usePaymentStore(
      (state) =>
        state.setPaymentData
    );

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups =
    async () => {
      try {
        const response =
          await api.get("/groups");

        setGroups(
          response.data.data
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const handleOpenGroup = (
    group: any
  ) => {
    setPaymentData({
      amount: 400,

      receiver: "Naman",

      group: group.name,

      groupId: group._id,

      paymentMethod: "",

      transactionId: "",

      paymentStatus: "pending",
    });

    router.push(
      "/group-details"
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

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello 👋
          </Text>

          <Text style={styles.title}>
            Split Dashboard
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Your Groups
        </Text>

        {groups.map((group) => (
          <TouchableOpacity
            key={group._id}
            style={styles.groupCard}
            onPress={() =>
              handleOpenGroup(
                group
              )
            }
          >
            <View>
              <Text
                style={
                  styles.groupName
                }
              >
                {group.name}
              </Text>

              <Text
                style={
                  styles.groupMembers
                }
              >
                {
                  group.members
                    ?.length
                }{" "}
                Members
              </Text>
            </View>

            <View
              style={
                styles.pendingBadge
              }
            >
              <Text
                style={
                  styles.pendingText
                }
              >
                Open
              </Text>
            </View>
          </TouchableOpacity>
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

  greeting: {
    fontSize: 16,
    color: "#777",
    marginBottom: 6,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 18,
  },

  groupCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  groupName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  groupMembers: {
    color: "#777",
    marginTop: 6,
    fontSize: 14,
  },

  pendingBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },

  pendingText: {
    color: "#16A34A",
    fontWeight: "700",
  },
});