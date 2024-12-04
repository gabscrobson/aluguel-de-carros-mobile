import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Calendar, Car, DollarSign, Palette } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/firebase';
import { useAuth } from '../contexts/authContext';
import { Header } from './Header';

export function MeusAlugueis() {
  const navigation = useNavigation();
  const [rentals, setRentals] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const fetchRentals = async () => {
        const rentalsRef = ref(database, `usuarios/${currentUser.uid}/alugueis`);
        const snapshot = await get(rentalsRef);
        if (snapshot.exists()) {
          const rentalsData = snapshot.val();
          const rentalsArray = await Promise.all(
            Object.keys(rentalsData).map(async (key) => {
              const rental = { id: key, ...rentalsData[key] };
              const carRef = ref(database, `carros/${rental.carRef}`);
              const carSnapshot = await get(carRef);
              if (carSnapshot.exists()) {
                rental.car = carSnapshot.val();
              }
              return rental;
            })
          );
          setRentals(rentalsArray);
          console.log(rentalsArray);
        } else {
          console.log('No data available');
        }
      };

      fetchRentals();
    }
  }, [currentUser]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <>
        <Header />
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.grid}>
            {rentals.map((rental) => (
            <View key={rental.id} style={styles.card}>
                <Image
                source={{ uri: rental.car.imagens[0] }}
                style={styles.image}
                resizeMode="cover"
                />
                <View style={styles.cardContent}>
                <Text style={styles.carName}>{rental.car.nome}</Text>
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                    <Calendar size={20} color="#666" />
                    <View>
                        <Text style={styles.infoLabel}>Período do aluguel:</Text>
                        <Text style={styles.infoValue}>
                        {formatDate(rental.startDate)} até {formatDate(rental.endDate)}
                        </Text>
                        <Text style={styles.infoSubValue}>
                        {calculateDuration(rental.startDate, rental.endDate)} dias
                        </Text>
                    </View>
                    </View>
                    <View style={styles.infoRow}>
                    <DollarSign size={20} color="#666" />
                    <View>
                        <Text style={styles.infoLabel}>Valor total:</Text>
                        <Text style={styles.infoValue}>
                        R${' '}
                        {parseFloat(rental.price).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                        </Text>
                    </View>
                    </View>
                    <View style={styles.infoRow}>
                    <Palette size={20} color="#666" />
                    <View>
                        <Text style={styles.infoLabel}>Cor:</Text>
                        <Text style={styles.infoValue}>{rental.car.cor}</Text>
                    </View>
                    </View>
                </View>
                </View>
            </View>
            ))}
        </View>

        {rentals.length === 0 && (
            <View style={styles.emptyContainer}>
            <Car size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Você ainda não possui nenhum aluguel</Text>
            <Text style={styles.emptySubtitle}>
                Explore nossos carros disponíveis e faça seu primeiro aluguel!
            </Text>
            <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.exploreButtonText}>Explorar carros</Text>
            </TouchableOpacity>
            </View>
        )}
        </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoContainer: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSubValue: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 16,
  },
  exploreButton: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 5,
    marginTop: 16,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});