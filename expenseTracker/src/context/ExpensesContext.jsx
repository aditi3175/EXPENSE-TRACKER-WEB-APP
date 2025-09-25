import { createContext, useContext, useReducer, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";

const ExpensesContext = createContext();

const expensesReducer = (state, action) => {
  switch (action.type) {
    case "SET_EXPENSES":
      return { ...state, expenses: action.payload, loading: false };
    case "ADD_EXPENSE":
      return { ...state, expenses: [...state.expenses, action.payload] };
    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter((exp) => exp._id !== action.payload),
      };
    case "LOADING":
      return { ...state, loading: true };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  expenses: [],
  loading: false,
  error: null,
};

export const ExpensesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expensesReducer, initialState);
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Fetch all expenses
  const getExpenses = async () => {
    if (state.loading || !isAuthenticated) return;
    dispatch({ type: "LOADING" });
    try {
      const res = await axiosInstance.get("/expenses");
      dispatch({ type: "SET_EXPENSES", payload: res.data });
    } catch (err) {
      console.error("Failed to fetch expenses:", err.response || err);
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.message || "Failed to fetch expenses",
      });
    }
  };

  // Add expense
  const addExpense = async (expense) => {
    try {
      const res = await axiosInstance.post("/expenses", expense);
      dispatch({ type: "ADD_EXPENSE", payload: res.data });
    } catch (err) {
      console.error("Add expense failed:", err);
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(`/expenses/${id}`);
      dispatch({ type: "DELETE_EXPENSE", payload: id });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // useEffect(() => {
  //   getExpenses();
  // }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      getExpenses();
    }
  }, [authLoading, isAuthenticated]);

  return (
    <ExpensesContext.Provider
      value={{
        ...state,
        getExpenses,
        addExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpensesContext);
