import { 
  createTransaction, 
  getAllTransactions, 
  filterTransactions, 
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getUserSpent
} from "../services/transactionService.js";

export const addTransaction = async (req, res) => {
  try {
    const transactionData = req.body;
    const newTransaction = await createTransaction(transactionData);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const fetchTransactions = async (req, res) => {
  try {
    const { email, page, count } = req.params;
    const transactions = await getAllTransactions(email, page, count);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchFilteredTransactions = async (req, res) => {
  try {
    const filterData = req.body;
    const transactions = await filterTransactions(filterData);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await getTransactionById(id);
    if (transaction === 'No such txn found!') {
      return res.status(404).json({ error: transaction });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const modifyTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedTransaction = await updateTransaction(id, updates);
    res.status(200).json({ message: 'update success', data: updatedTransaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteTransaction(id);
    res.status(200).json(result);
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const fetchUserSpent = async (req, res) => {
  try {
    const { email } = req.params;
    const result = await getUserSpent(email);
    if (typeof result === 'string') {
      return res.status(200).json({ message: result });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};