import { StatusBar } from 'expo-status-bar';
import Home from './screens/home';
import Navigator from './routes/drawer'

export default function App() {
  return (
    <Navigator />
  );
}