
import { Routes, Route } from "react-router-dom";

import LoginPage from "./features/auth/LoginPage.tsx";
import SignupPage from "./features/auth/SignupPage.tsx";
import ReadingPage from "./features/reading/ReadingPage.tsx";
import DashboardPage from "./features/dashboard/DashboardPage.tsx";
import CustomizeReading from "./features/reading/CustomizeReading.tsx";
import DeckViewer from "./features/flashcards/DeckViewer.tsx";

function App() {

  return (
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reading/generate" element={<CustomizeReading />} />
          <Route path="/flashcards" element={<DeckViewer />} />
      </Routes>
  )
}

export default App
