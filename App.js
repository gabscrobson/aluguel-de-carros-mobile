import { Home } from './components/Home';
import { AuthProvider } from './contexts/authContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AdicionarCarro } from './components/AdicionarCarro';
import { MeusAlugueis } from './components/MeusAlugueis';

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
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Adicionar" component={AdicionarCarro} />
          <Stack.Screen name="Alugueis" component={MeusAlugueis} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
