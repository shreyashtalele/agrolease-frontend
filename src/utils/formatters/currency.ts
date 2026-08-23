export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

export const formatPricePerDay = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN")} / day`;
};
