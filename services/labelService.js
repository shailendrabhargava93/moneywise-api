import supabase from "../config/supabaseClient.js";

export const getAllLabelsByEmail = async (email) => {
  try {
    const { data: labels, error: error } = await supabase
      .from("labels")
      .select("*")
      .eq("user", email);

    if (error) {
      throw new Error(`Error fetching budgets: ${error.message}`);
    }

    if (!labels || labels.length === 0) {
      return [];
    }

    return labels;
  } catch (error) {
    console.error("Error in getAllLabelsByEmail:", error);
    throw error;
  }
};
