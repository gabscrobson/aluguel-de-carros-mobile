import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/authContext';
import { signout } from '../firebase/auth';
import { useNavigation } from '@react-navigation/native';

export function Header() {
  const { currentUser, isAdmin } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>CarRent</Text>
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navLink}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Alugueis')}>
          <Text style={styles.navLink}>Seus Aluguéis</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={signout}>
          <Text style={styles.navLink}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2563eb', // Tailwind's blue-600
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLink: {
    color: '#ffffff',
    marginHorizontal: 8,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});