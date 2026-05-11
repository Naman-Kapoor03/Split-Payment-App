import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";

type Props = {
  name: string;
  subtitle: string;
  color: string;
  bgColor: string;
  logo: any;
  loading: boolean;
  selected: boolean;
  onPress: () => void;
};

export default function PaymentCard({
  name,
  subtitle,
  color,
  bgColor,
  logo,
  loading,
  selected,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: bgColor,
          borderColor: selected
            ? color
            : "transparent",
        },
      ]}
    >
      <View style={styles.left}>
        <View style={styles.logoContainer}>
          <Image
            source={logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {name}
          </Text>

          <Text
            style={styles.subtitle}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          color={color}
        />
      ) : (
        <View
          style={[
            styles.arrowContainer,
            {
              backgroundColor:
                color,
            },
          ]}
        >
          <Text style={styles.arrow}>
            →
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginBottom: 18,
    borderWidth: 2,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.06,

    shadowRadius: 12,

    elevation: 3,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 34,
    height: 34,
  },

  textContainer: {
    marginLeft: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  arrow: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});