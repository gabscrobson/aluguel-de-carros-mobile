import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { login, loginWithGoogle } from '../firebase/auth';
import { useAuth } from '../contexts/authContext';

export function Login() {
  const { userLoggedIn } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (userLoggedIn) {
      navigation.replace('Home');
    }
  }, [userLoggedIn, navigation]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await login(email, password);
      } catch (error) {
        console.error('Error signing in:', error);
        setErrorMessage('Erro ao fazer login');
        setIsSigningIn(false);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      loginWithGoogle().catch(() => {
        setIsSigningIn(false);
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <Button title={isSigningIn ? 'Logando...' : 'Logar'} onPress={onSubmit} disabled={isSigningIn} />
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Não tem uma conta? Registre-se</Text>
        </TouchableOpacity>
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>OR</Text>
          <View style={styles.separator} />
        </View>
        <TouchableOpacity onPress={onGoogleSignIn} disabled={isSigningIn} style={styles.googleButton}>
          <Text>{isSigningIn ? 'Logando...' : 'Continuar com Google'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  link: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  separatorText: {
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  googleButton: {
    padding: 10,
    backgroundColor: '#4285F4',
    borderRadius: 5,
    alignItems: 'center',
  },
});