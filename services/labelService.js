import supabase from "../config/supabaseClient.js";

export const getAllLabelsByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from("labels")
      .select("labels")
      .eq("user", email);

    if (error) {
      throw new Error(`Error fetching labels: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Split the string by comma and flatten the array
    return data.flatMap(item => item.labels.split('|'));
  } catch (error) {
    console.error("Error in getAllLabelsByEmail:", error);
    throw error;
  }
};
