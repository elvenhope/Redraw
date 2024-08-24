import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LobbyProvider } from './context/lobbyContext';
import IndexPage from './pages/IndexPage';
import LobbyPage from './pages/LobbyPage';

const App: React.FC = () => {
	return (
		<LobbyProvider>
			<Router>
				<Routes>
					<Route path="/" element={<IndexPage />} />
					<Route path="/lobby" element={<LobbyPage />} />
				</Routes>
			</Router>
		</LobbyProvider>
	);
};

export default App;
