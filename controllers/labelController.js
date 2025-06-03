import { getAllLabelsByEmail } from "../services/labelService.js";

export const fetchAllLabels = async (req, res) => {
    try {
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({ 
          error: 'Email parameter is required' 
        });
      }
  
      const labels = await getAllLabelsByEmail(email);
      res.status(200).json(labels);
    } catch (error) {
      console.error('Error in fetchAllBudgets:', error);
      res.status(500).json({ error: error.message });
    }
  };