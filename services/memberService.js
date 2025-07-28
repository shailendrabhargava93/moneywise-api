import supabase from "../config/supabaseClient.js";

export const createMembers = async (membersData) => {
  try {
    const { data, error } = await supabase
      .from("members")
      .insert([membersData])
      .select();

    if (error) {
      throw new Error(`Error creating members: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in createMembers:", error);
    throw error;
  }
}

export const getMembers = async (email) => {
  try {
    console.log("Fetching members for email:", email);
    const { data: members, error } = await supabase
      .from("members")
      .select("*")
      .eq("user", email);

    if (error) {
      throw new Error(`Error fetching members: ${error.message}`);
    }
    return members.map(m => ({
      name: m.memberName,
      avatar: m.memberAvatar
    }));
  } catch (error) {
    console.error("Error in getMembers:", error);
    throw error;
  }
}