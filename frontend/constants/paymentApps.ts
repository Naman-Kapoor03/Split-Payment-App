const paymentApps = [
  {
    id: "gpay",
    name: "Google Pay",
    subtitle:
      "Pay with your Google account",

    color: "#1A73E8",

    bgColor: "#F4F7FF",

    logo: require("../assets/images/gpay.png"),

    url:
      "gpay://upi/pay?pa=test@upi&pn=SplitPay&am=400&cu=INR",
  },

  {
    id: "phonepe",
    name: "PhonePe",
    subtitle:
      "India's trusted UPI app",

    color: "#5F259F",

    bgColor: "#F6F1FC",

    logo: require("../assets/images/phonepe.png"),

    url:
      "phonepe://pay?transactionId=1&pa=test@upi&pn=SplitPay&am=400&cu=INR",
  },

  {
    id: "paytm",
    name: "Paytm",
    subtitle:
      "Fast & secure payments",

    color: "#00B9F1",

    bgColor: "#EDF9FF",

    logo: require("../assets/images/paytm.png"),

    url:
      "paytmmp://pay?pa=test@upi&pn=SplitPay&am=400&cu=INR",
  },
];

export default paymentApps;