import { create } from "zustand";

type PaymentStore = {
  amount: number;

  receiver: string;

  receiverId: string;

  group: string;

  groupId: string;

  paymentMethod: string;

  transactionId: string;

  paymentStatus: string;

  paymentLink: string;

  setPaymentData: (
    data: Partial<PaymentStore>
  ) => void;

  resetPayment: () => void;
};

export const usePaymentStore =
  create<PaymentStore>((set) => ({
    amount: 0,

    receiver: "",

    receiverId: "",

    group: "",

    groupId: "",

    paymentMethod: "",

    transactionId: "",

    paymentStatus: "",

    paymentLink: "",

    setPaymentData: (data) =>
      set((state) => ({
        ...state,
        ...data,
      })),

    resetPayment: () =>
      set({
        amount: 0,

        receiver: "",

        receiverId: "",

        group: "",

        groupId: "",

        paymentMethod: "",

        transactionId: "",

        paymentStatus: "",

        paymentLink: "",
      }),
  }));