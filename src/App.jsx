import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MateriPage from './pages/MateriPage';
import VideoPage from './pages/VideoPage';
import QuizPage from './pages/QuizPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/materi" element={<MateriPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;