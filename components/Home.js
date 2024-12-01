import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Search, Calendar } from 'lucide-react-native';
import { useAuth } from '../contexts/authContext';
import { CarCard } from '../components/CarCard';
import { database } from '../firebase/firebase';
import { ref, get, push } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { Header } from './Header';

export function Home() {
  const { currentUser, userLoggedIn } = useAuth();
  const navigation = useNavigation();

  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!userLoggedIn) {
      navigation.replace('Login');
    }
  }, [userLoggedIn, navigation]);

  useEffect(() => {
    const fetchCars = async () => {
      const carsRef = ref(database, 'carros');
      const snapshot = await get(carsRef);
      if (snapshot.exists()) {
        const carsData = snapshot.val();
        const carsArray = Object.keys(carsData).map((key) => ({
          id: key,
          ...carsData[key],
        }));
        setCars(carsArray);
        console.log(carsArray);
      } else {
        console.log('No data available');
      }
    };

    fetchCars();
  }, []);

  const filteredCars = cars.filter(
    (car) =>
      car.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.cor.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRent = async (car) => {
    if (!startDate || !endDate) {
      alert('Please select start and end dates');
      return;
    }

    const rentalRef = ref(database, `usuarios/${currentUser.uid}/alugueis`);
    const newRental = {
      startDate,
      endDate,
      carRef: car.id,
      price: car.precoAtual,
    };

    try {
      const newRentalRef = await push(rentalRef, newRental);
      const rentalId = newRentalRef.key;
      console.log('Rental ID:', rentalId);
      const carRentalRef = ref(database, `carros/${car.id}/alugueis`);
      await push(carRentalRef, {
        aluguelRef: rentalId,
      });
    } catch (error) {
      console.error('Error reserving car:', error);
    }
  };

  return (
    <>
        <Header />
        <ScrollView style={styles.container}>
        <View style={styles.searchSection}>
            <Text style={styles.headerText}>Encontre o carro perfeito</Text>
            <View style={styles.filtersContainer}>
            <View style={styles.filterItem}>
                <Text style={styles.label}>Pesquisar carro</Text>
                <View style={styles.inputContainer}>
                <Search style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Sedan"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
                </View>
            </View>
            <View style={styles.filterItem}>
                <Text style={styles.label}>Data de retirada</Text>
                <View style={styles.inputContainer}>
                <Calendar style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={startDate}
                    onChangeText={setStartDate}
                />
                </View>
            </View>
            <View style={styles.filterItem}>
                <Text style={styles.label}>Data de devolução</Text>
                <View style={styles.inputContainer}>
                <Calendar style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={endDate}
                    onChangeText={setEndDate}
                />
                </View>
            </View>
            </View>
        </View>

        <View style={styles.carsSection}>
            <Text style={styles.carsHeader}>Carros disponíveis</Text>
            <View style={styles.carsContainer}>
            {filteredCars.map((car) => (
                <CarCard key={car.id} {...car} onClick={handleRent} />
            ))}
            </View>
        </View>
        </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333333',
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filterItem: {
    flex: 1,
    minWidth: '48%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#666666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
    color: '#9ca3af',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333333',
  },
  carsSection: {
    marginTop: 16,
  },
  carsHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333333',
  },
  carsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
});