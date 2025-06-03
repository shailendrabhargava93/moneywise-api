import supabase from "../config/supabaseClient.js";

export const getAllBudgetsByEmailAndStatus = async (email, status) => {
  try {
    // Get budgets where user email is equal to user and status matches
    const { data: budgets, error: budgetError } = await supabase
      .from("budgets")
      .select("*")
      .eq("user", email)
      .eq("status", status);

    if (budgetError) {
      throw new Error(`Error fetching budgets: ${budgetError.message}`);
    }

    if (!budgets || budgets.length === 0) {
      return [];
    }

    // For each budget, calculate spent amount from transactions
    const budgetsWithSpentAmount = await Promise.all(
      budgets.map(async (budget) => {
        const spentAmount = await calculateSpentAmount(budget.id);
        return {
          id: budget.id,
          data: {
            ...budget,
            spentAmount,
          },
        };
      })
    );

    return budgetsWithSpentAmount;
  } catch (error) {
    console.error("Error in getAllBudgetsByEmailAndStatus:", error);
    throw error;
  }
};

export const createBudget = async (budgetData) => {
  try {
    const newBudget = {
      name: budgetData.name,
      totalBudget: budgetData.totalBudget,
      startDate: budgetData.startDate,
      endDate: budgetData.endDate,
      createdBy: budgetData.createdBy,
      user: budgetData.createdBy, // Initialize with creator's email
      status: budgetData.status,
      createdDate: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("budgets")
      .insert([newBudget])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating budget: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in createBudget:", error);
    throw error;
  }
};

export const updateBudget = async (budgetId, updateData) => {
  try {
    // First, get the existing budget
    const { data: existingBudget, error: fetchError } = await supabase
      .from("budgets")
      .select("*")
      .eq("id", budgetId)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return null; // Budget not found
      }
      throw new Error(`Error fetching budget: ${fetchError.message}`);
    }

    if (!existingBudget) {
      return null;
    }

    // Prepare update object with fallback to existing values
    const updatedBudget = {
      name: updateData.name || existingBudget.name,
      totalBudget: updateData.totalBudget || existingBudget.totalBudget,
      startDate: updateData.startDate || existingBudget.startDate,
      endDate: updateData.endDate || existingBudget.endDate,
      status: updateData.status || existingBudget.status,
      user: updateData.user || existingBudget.user,
      // Keep createdBy unchanged
      createdBy: existingBudget.createdBy,
      updatedDate: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("budgets")
      .update(updatedBudget)
      .eq("id", budgetId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating budget: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in updateBudget:", error);
    throw error;
  }
};

export const getBudgetById = async (budgetId) => {
  try {
    const { data: budget, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("id", budgetId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return "No such budget found!"; // Budget not found
      }
      throw new Error(`Error fetching budget: ${error.message}`);
    }

    // Calculate spent amount
    const spentAmount = await calculateSpentAmount(budgetId);

    return {
      ...budget,
      spentAmount,
    };
  } catch (error) {
    console.error("Error in getBudgetById:", error);
    throw error;
  }
};

export const getBudgetStats = async (budgetId) => {
  try {
    // First check if budget exists
    const budgetExists = await getBudgetById(budgetId);
    if (budgetExists === "No such budget found!") {
      return "No such budget found!";
    }

    // Get all transactions for this budget
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("budgetId", budgetId);

    if (error) {
      throw new Error(`Error fetching transactions: ${error.message}`);
    }

    if (!transactions || transactions.length === 0) {
      return "No transactions found for this budget";
    }

    // Calculate category statistics
    const categoryTxnCount = {};
    const labelTxnCount = {};

    transactions.forEach((transaction) => {
      const { category, amount, label } = transaction;

      // Category statistics
      if (categoryTxnCount[category]) {
        categoryTxnCount[category].sumAmount += amount;
        categoryTxnCount[category].count += 1;
      } else {
        categoryTxnCount[category] = { sumAmount: amount, count: 1 };
      }

      // Label statistics
      if (labelTxnCount[label]) {
        labelTxnCount[label].sumAmount += amount;
        labelTxnCount[label].count += 1;
      } else {
        labelTxnCount[label] = { sumAmount: amount, count: 1 };
      }
    });

    // Calculate date-wise spending
    const dateSum = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const formattedDate = date.toISOString().split("T")[0];
      const amount = transaction.amount;

      if (dateSum[formattedDate]) {
        dateSum[formattedDate] += amount;
      } else {
        dateSum[formattedDate] = amount;
      }
    });

    // Sort dates
    const sortedKeys = Object.keys(dateSum).sort();
    const sortedData = {};
    sortedKeys.forEach((key) => {
      sortedData[key] = dateSum[key];
    });

    return {
      datesData: sortedData,
      categoryTxnCount,
      labelTxnCount,
    };
  } catch (error) {
    console.error("Error in getBudgetStats:", error);
    throw error;
  }
};

// Helper function to calculate spent amount for a budget
const calculateSpentAmount = async (budgetId) => {
  try {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("amount")
      .eq("budgetId", budgetId);

    if (error) {
      throw new Error(`Error fetching transactions: ${error.message}`);
    }

    if (!transactions || transactions.length === 0) {
      return 0;
    }

    return transactions.reduce((total, txn) => total + txn.amount, 0);
  } catch (error) {
    console.error("Error in calculateSpentAmount:", error);
    throw error;
  }
};
