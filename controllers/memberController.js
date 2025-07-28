import { getMembers, createMembers } from "../services/memberService.js";


export const createMembersData = async (req, res) => {
  try {
    const membersData = req.body;
    console.log(membersData)
    // Validate required fields
    const requiredFields = ['email', "members"];
    const missingFields = requiredFields.filter(field => !membersData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields
      });
    }

    const memebers = await createMembers(membersData);
    res.status(201).json(memebers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getAllMembers = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        error: 'Email parameter is required'
      });
    }
    const members = await getMembers(email);
    res.status(200).json(members);
  } catch (error) {
    console.error('Error in getAllMembers:', error);
    res.status(500).json({ error: error.message });
  }
}