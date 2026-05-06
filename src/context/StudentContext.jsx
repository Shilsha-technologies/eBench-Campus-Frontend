import { createContext, useContext, useReducer, useCallback } from "react";

// Initial state
const initialState = {
  student: {
    name: "Aryan Mehta",
    email: "aryan.mehta@gmail.com",
    phone: "+91 9876543210",
    gender: "Male",
    college: "IIT Bombay",
    degree: "B.Tech",
    branch: "Computer Science",
    year: "3rd Year",
    skills: ["React", "Node.js", "Python", "DSA"],
    resume: null,
    avatar: null,
  },
  credits: 5,
  stats: { total: 12, passed: 8, failed: 4 },
  darkMode: false,
  toasts: [],
  tests: [
    { id: "T001", role: "SDE Intern", category: "DSA", date: "2026-04-20", status: "Completed", score: 82 },
    { id: "T002", role: "Frontend Dev", category: "React", date: "2026-04-15", status: "Completed", score: 91 },
    { id: "T003", role: "Data Analyst", category: "Aptitude", date: "2026-04-10", status: "Completed", score: 58 },
    { id: "T004", role: "Backend Intern", category: "Node.js", date: "2026-03-28", status: "Expired", score: null },
    { id: "T005", role: "Full Stack Dev", category: "React", date: "2026-03-20", status: "Completed", score: 76 },
    { id: "T006", role: "ML Intern", category: "Python", date: "2026-03-10", status: "Completed", score: 44 },
    { id: "T007", role: "SDE Intern", category: "DSA", date: "2026-02-25", status: "Completed", score: 88 },
    { id: "T008", role: "DevOps", category: "Linux", date: "2026-02-15", status: "Pending", score: null },
  ],
  creditHistory: [
    { id: 1, type: "purchase", amount: 5, date: "2026-04-01", note: "Pack of 5" },
    { id: 2, type: "used", amount: -1, date: "2026-04-10", note: "Data Analyst Test" },
    { id: 3, type: "used", amount: -1, date: "2026-04-15", note: "Frontend Dev Test" },
    { id: 4, type: "referral", amount: 2, date: "2026-04-18", note: "Referral: Sneha K." },
    { id: 5, type: "used", amount: -1, date: "2026-04-20", note: "SDE Intern Test" },
  ],
  loading: false,
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_DARK": 
      return { ...state, darkMode: !state.darkMode };
    
    case "ADD_TOAST": 
      return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload }] };
    
    case "REMOVE_TOAST": 
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    
    case "DEDUCT_CREDIT":
      return {
        ...state,
        credits: state.credits - 1,
        stats: { ...state.stats, total: state.stats.total + 1 },
        tests: [action.newTest, ...state.tests],
        creditHistory: [action.creditEntry, ...state.creditHistory],
      };
    
    case "BUY_CREDITS":
      return {
        ...state,
        credits: state.credits + action.amount,
        creditHistory: [action.creditEntry, ...state.creditHistory],
      };
    
    case "UPDATE_PROFILE":
      return { ...state, student: { ...state.student, ...action.payload } };
    
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    
    case "SET_STUDENT_DATA":
      return { ...state, student: { ...state.student, ...action.payload } };
    
    default: 
      return state;
  }
}

// Create context
const StudentContext = createContext();

// Provider component
export function StudentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Actions
  const addToast = useCallback((payload) => {
    dispatch({ type: "ADD_TOAST", payload });
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: "REMOVE_TOAST", id });
  }, []);

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: "TOGGLE_DARK" });
  }, []);

  const updateProfile = useCallback((payload) => {
    dispatch({ type: "UPDATE_PROFILE", payload });
    addToast({ type: "success", message: "Profile updated successfully!" });
  }, [addToast]);

  const requestTest = useCallback((testData) => {
    if (state.credits <= 0) {
      addToast({ type: "error", message: "Insufficient credits. Please purchase credits to continue." });
      return false;
    }

    const newTest = {
      id: `T${String(state.stats.total + 1).padStart(3, "0")}`,
      ...testData,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      score: null,
    };

    const creditEntry = {
      id: Date.now(),
      type: "used",
      amount: -1,
      date: new Date().toISOString().split("T")[0],
      note: `${testData.role} Test`,
    };

    dispatch({ type: "DEDUCT_CREDIT", newTest, creditEntry });
    addToast({ type: "success", message: "Test requested successfully! 1 credit deducted." });
    addToast({ type: "info", message: "📧 Test link sent to your email!" });
    return true;
  }, [state.credits, state.stats.total, addToast]);

  const buyCredits = useCallback((amount, price) => {
    const creditEntry = {
      id: Date.now(),
      type: "purchase",
      amount,
      date: new Date().toISOString().split("T")[0],
      note: `Pack of ${amount}`,
    };

    dispatch({ type: "BUY_CREDITS", amount, creditEntry });
    addToast({ type: "success", message: `✅ ${amount} credits added to your account!` });
  }, [addToast]);

  const setLoading = useCallback((loading) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setStudentData = useCallback((data) => {
    dispatch({ type: "SET_STUDENT_DATA", payload: data });
  }, []);

  const value = {
    state,
    dispatch,
    // Actions
    addToast,
    removeToast,
    toggleDarkMode,
    updateProfile,
    requestTest,
    buyCredits,
    setLoading,
    setStudentData,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

// Hook to use the context
export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}

export default StudentContext;
