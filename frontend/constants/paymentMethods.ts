const paymentMethods = [
  {
    category: "UPI Apps",

    methods: [
      {
        id: "gpay",

        name: "Google Pay",

        subtitle:
          "Pay using Google Pay",

        type: "upi",

        color: "#1A73E8",

        bgColor: "#F4F7FF",

        logo: require("../assets/images/gpay.png"),
      },

      {
        id: "phonepe",

        name: "PhonePe",

        subtitle:
          "Pay using PhonePe",

        type: "upi",

        color: "#5F259F",

        bgColor: "#F6F1FC",

        logo: require("../assets/images/phonepe.png"),
      },

      {
        id: "paytm",

        name: "Paytm",

        subtitle:
          "Pay using Paytm",

        type: "upi",

        color: "#00B9F1",

        bgColor: "#EDF9FF",

        logo: require("../assets/images/paytm.png"),
      },
    ],
  },

  {
    category: "Cards",

    methods: [
      {
        id: "visa",

        name: "Credit / Debit Card",

        subtitle:
          "Visa, Mastercard, RuPay",

        type: "card",

        color: "#111",

        bgColor: "#F5F5F5",

        logo: require("../assets/images/card.png"),
      },
    ],
  },

  {
    category: "Wallets",

    methods: [
      {
        id: "amazonpay",

        name: "Amazon Pay",

        subtitle:
          "Fast wallet payments",

        type: "wallet",

        color: "#FF9900",

        bgColor: "#FFF7EB",

        logo: require("../assets/images/wallet.png"),
      },
    ],
  },
];

export default paymentMethods;