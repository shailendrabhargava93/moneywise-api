import { 
    getAllBudgetsByEmailAndStatus,
    createBudget,
    updateBudget,
    getBudgetById,
    getBudgetStats
  } from '../services/budgetService.js';
  
  export const fetchAllBudgets = async (req, res) => {
    try {
      const { email, status } = req.params;
      
      if (!email || !status) {
        return res.status(400).json({ 
          error: 'Email and status parameters are required' 
        });
      }
  
      const budgets = await getAllBudgetsByEmailAndStatus(email, status);
      res.status(200).json(budgets);
    } catch (error) {
      console.error('Error in fetchAllBudgets:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  export const addBudget = async (req, res) => {
    try {
      const budgetData = req.body;
      
      // Validate required fields
      const requiredFields = ['name', 'totalBudget', 'startDate', 'endDate', 'createdBy', 'status'];
      const missingFields = requiredFields.filter(field => !budgetData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          missingFields 
        });
      }
  
      const result = await createBudget(budgetData);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error in addBudget:', error);
      res.status(400).json({ error: error.message });
    }
  };
  
  export const modifyBudget = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      if (!id) {
        return res.status(400).json({ 
          error: 'Budget ID is required' 
        });
      }
  
      const result = await updateBudget(id, updates);
      
      if (!result) {
        return res.status(404).json({ 
          error: 'Budget not found' 
        });
      }
  
      res.status(200).json({ 
        message: 'update success', 
        data: result 
      });
    } catch (error) {
      console.error('Error in modifyBudget:', error);
      res.status(400).json({ error: error.message });
    }
  };
  
  export const fetchBudgetById = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ 
          error: 'Budget ID is required' 
        });
      }
  
      const budget = await getBudgetById(id);
      
      if (budget === 'No such budget found!') {
        return res.status(404).json({ error: budget });
      }
  
      res.status(200).json(budget);
    } catch (error) {
      console.error('Error in fetchBudgetById:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  export const fetchBudgetStats = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ 
          error: 'Budget ID is required' 
        });
      }
  
      const budget = await getBudgetById(id);
      
      if (budget === 'No such budget found!') {
        return res.status(404).json({ error: budget });
      }
  
      const stats = await getBudgetStats(id);
      
      if (typeof stats === 'string') {
        return res.status(200).json({ message: stats });
      }
      
      res.status(200).json(stats);
    } catch (error) {
      console.error('Error in fetchBudgetStats:', error);
      res.status(500).json({ error: error.message });
    }
  };