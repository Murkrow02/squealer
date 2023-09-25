import logo from './logo.svg';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import TabBar from './components/TabBar';
import Feed from './pages/Feed';
function App() {
  return (
      <div>
        <Feed/>
        <TabBar/>
      </div>
  );
}

export default App;
