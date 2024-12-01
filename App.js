import { Home } from './components/Home';
import { AuthProvider } from './contexts/authContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CarCard } from './components/CarCard';
import { Login } from './components/Login';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" 
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
