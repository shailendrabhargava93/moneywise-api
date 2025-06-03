import supabase from "../config/supabaseClient.js";

export const createTransaction = async (transactionData) => {
  const { data, error } = await supabase
    .from("transactions")
    .insert([transactionData])
    .select();

  if (error) throw new Error(error.message);
  return data;
};

export const getAllTransactions = async (email, page, count = 10) => {
  const budgetIdsResponse = await getBudgetIdsByEmail(email);
  if (!budgetIdsResponse.data || budgetIdsResponse.data.length === 0) {
    return { txns: [], max: null, count: 0 };
  }

  const budgetIds = budgetIdsResponse.data.map((budget) => budget.id);
  const maxAmountResponse = await getMaxTransactionAmount(budgetIds);
  const max = maxAmountResponse.data && maxAmountResponse.data.length > 0 ? maxAmountResponse.data[0].amount : null;
  const totalCountResponse = await getTransactionCount(budgetIds);
  const totalCount = totalCountResponse.count;
  const offset = (page - 1) * Number(count);
  const transactionsResponse = await getTransactionsByBudgetIds(budgetIds, offset, count);

  return {
    txns: transactionsResponse.data.map((txn) => ({ id: txn.id, data: txn })),
    max,
    count: totalCount,
  };
};

export const filterTransactions = async (filterData) => {
  const { email, categories, labels, min, max } = filterData;
  const budgetIdsResponse = await getBudgetIdsByEmail(email);
  if (!budgetIdsResponse.data || budgetIdsResponse.data.length === 0) {
    return [];
  }

  const budgetIds = budgetIdsResponse.data.map((budget) => budget.id);
  const query = supabase
    .from("transactions")
    .select("*")
    .in("budgetId", budgetIds);

  if (categories && categories.length > 0) {
    query.in("category", categories);
  }

  if (labels && labels.length > 0) {
    query.in("label", labels);
  }

  if (min !== undefined && min !== null) {
    query.gte("amount", Number(min));
  }

  if (max !== undefined && max !== null) {
    query.lte("amount", Number(max));
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data.map((txn) => ({ id: txn.id, data: txn }));
};

export const getTransactionById = async (id) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code === "PGRST116") return "No such txn found!";
  if (error) throw new Error(error.message);
  return data;
};

export const deleteTransaction = async (id) => {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error && error.code === "PGRST116") {
    const notFoundError = new Error("No such txn found!");
    notFoundError.code = "NOT_FOUND";
    throw notFoundError;
  }
  if (error) throw new Error(error.message);
  return { success: true, message: "Transaction deleted successfully" };
};

export const updateTransaction = async (id, updates) => {
  const { data, error } = await supabase
    .from("transactions")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
};

export const getUserSpent = async (email) => {
  const budgetIdsResponse = await getBudgetIdsByEmail(email);
  if (!budgetIdsResponse.data || budgetIdsResponse.data.length === 0) {
    return "No matching transaction found.";
  }

  const budgetIds = budgetIdsResponse.data.map((budget) => budget.id);
  const transactionsResponse = await getTransactionsByBudgetIdsAndEmail(budgetIds, email);

  if (!transactionsResponse.data || transactionsResponse.data.length === 0) {
    return "No matching transaction found.";
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const weekStart = getStartOfWeek(new Date());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  let totalAmountToday = 0;
  let totalAmountThisWeek = 0;

  transactionsResponse.data.forEach((txn) => {
    const txnDate = new Date(txn.date);
    if (txnDate >= todayStart && txnDate <= todayEnd) {
      totalAmountToday += txn.amount;
    }
    if (txnDate >= weekStart && txnDate <= weekEnd) {
      totalAmountThisWeek += txn.amount;
    }
  });

  return {
    totalAmountToday,
    totalAmountThisWeek,
  };
};

// Helper functions
const getBudgetIdsByEmail = async (email) => {
  const { data, error } = await supabase
    .from("budgets")
    .select("id")
    .eq("user", email)
    .eq("status", "active");

  if (error) throw new Error(error.message);
  return { data };
};

const getMaxTransactionAmount = async (budgetIds) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("amount")
    .in("budgetId", budgetIds)
    .order("amount", { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);
  return { data };
};

const getTransactionCount = async (budgetIds) => {
  const { count, error } = await supabase
    .from("transactions")
    .select("*", { count: "exact", head: true })
    .in("budgetId", budgetIds);

  if (error) throw new Error(error.message);
  return { count };
};

const getTransactionsByBudgetIds = async (budgetIds, offset, count) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .in("budgetId", budgetIds)
    .order("date", { ascending: false })
    .range(offset, offset + Number(count) - 1);

  if (error) throw new Error(error.message);
  return { data };
};

const getTransactionsByBudgetIdsAndEmail = async (budgetIds, email) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("amount, date")
    .eq("createdBy", email)
    .in("budgetId", budgetIds);

  if (error) throw new Error(error.message);
  return { data };
};

const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  const startOfWeek = new Date(d.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};