import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import store from './app/store';
import Layout from './components/layout/Layout';
import Home from './components/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
