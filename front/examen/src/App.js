import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SpacecraftList from './componente/SpacecraftList.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SpacecraftList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
