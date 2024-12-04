import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/authContext';
import { signup } from '../firebase/auth';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { userLoggedIn } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (userLoggedIn) {
      navigation.replace('Home');
    }
  }, [userLoggedIn, navigation]);

  const onSubmit = async () => {
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await signup(email, password);
        Alert.alert('Verificação de Email', 'Por favor, verifique seu email antes de fazer login.');
        navigation.navigate('Login');
      } catch (error) {
        console.error('Error signing up:', error);
        setErrorMessage('Erro ao registrar');
        setIsRegistering(false);
      } finally {
        setIsRegistering(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {userLoggedIn && navigation.replace('Home')}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Criar uma nova conta</Text>
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
        <TextInput
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry
        />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <Button title={isRegistering ? 'Registrando...' : 'Registrar'} onPress={onSubmit} disabled={isRegistering} />
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Já tem uma conta? Login</Text>
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
});