const simplifyBalances = (
  balances
) => {
  const creditors = [];

  const debtors = [];

  const settlements = [];

  Object.entries(
    balances
  ).forEach(
    ([name, amount]) => {
      if (amount > 0) {
        creditors.push({
          name,
          amount,
        });
      }

      if (amount < 0) {
        debtors.push({
          name,
          amount:
            Math.abs(amount),
        });
      }
    }
  );

  let i = 0;

  let j = 0;

  while (
    i < debtors.length &&
    j < creditors.length
  ) {
    const debtor =
      debtors[i];

    const creditor =
      creditors[j];

    const settledAmount =
      Math.min(
        debtor.amount,
        creditor.amount
      );

    settlements.push({
      from: debtor.name,
      to: creditor.name,
      amount:
        Number(
          settledAmount.toFixed(
            2
          )
        ),
    });

    debtor.amount -=
      settledAmount;

    creditor.amount -=
      settledAmount;

    if (
      debtor.amount < 1
    ) {
      i++;
    }

    if (
      creditor.amount < 1
    ) {
      j++;
    }
  }

  return settlements;
};

module.exports =
  simplifyBalances;