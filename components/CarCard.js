import { useState } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react-native';
import { useAuth } from '../contexts/authContext';
import { ref, update } from 'firebase/database';
import { database } from '../firebase/firebase';

export function CarCard({
  id,
  imagens,
  nome,
  cor,
  estado,
  precoAtual,
  onClick,
  disabled = false,
}) {
  const { isAdmin } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDisabled, setIsDisabled] = useState(disabled);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imagens.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imagens.length - 1 : prevIndex - 1,
    );
  };

  const handleDisable = async () => {
    const carRef = ref(database, `carros/${id}`);
    await update(carRef, { disabled: true });
    setIsDisabled(true);
  };

  const handleEnable = async () => {
    const carRef = ref(database, `carros/${id}`);
    await update(carRef, { disabled: false });
    setIsDisabled(false);
  };

  if (!isAdmin && isDisabled) {
    return null;
  }

  return (
    <View
      key={id}
      style={[
        styles.cardContainer,
        isAdmin && isDisabled ? styles.disabledBackground : {},
      ]}
    >
      <View style={styles.imageContainer}>
        {isAdmin && (
          <TouchableOpacity
            onPress={isDisabled ? handleEnable : handleDisable}
            style={[
              styles.adminButton,
              isDisabled ? styles.enableButton : styles.disableButton,
            ]}
          >
            {isDisabled ? <Check size={20} color="white" /> : <X size={20} color="white" />}
          </TouchableOpacity>
        )}
        <Image
          source={{ uri: imagens[currentImageIndex] }}
          style={styles.image}
        />
        {currentImageIndex > 0 && (
          <TouchableOpacity
            onPress={prevImage}
            style={styles.imageNavLeft}
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
        )}
        {currentImageIndex < imagens.length - 1 && (
          <TouchableOpacity
            onPress={nextImage}
            style={styles.imageNavRight}
          >
            <ChevronRight size={24} color="white" />
          </TouchableOpacity>
        )}
        <View style={styles.pagination}>
          {imagens.length > 1 &&
            imagens.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.carName}>{nome}</Text>
        <Text style={styles.carDetail}>Cor: {cor}</Text>
        <Text style={styles.carDetail}>Estado: {estado}</Text>
        <Text style={styles.carPrice}>R$ {precoAtual}/dia</Text>
        <TouchableOpacity
          onPress={() => onClick({ id, precoAtual })}
          style={styles.reserveButton}
        >
          <Text style={styles.reserveButtonText}>Reservar agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 8,
    flex: 1,
    minWidth: '48%',
  },
  disabledBackground: {
    backgroundColor: '#d3d3d3',
  },
  imageContainer: {
    position: 'relative',
  },
  adminButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 50,
    zIndex: 10,
  },
  enableButton: {
    backgroundColor: '#34d399',
  },
  disableButton: {
    backgroundColor: '#f87171',
  },
  image: {
    width: '100%',
    height: 192,
    resizeMode: 'cover',
  },
  imageNavLeft: {
    position: 'absolute',
    left: 8,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  imageNavRight: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  pagination: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    transform: [{ translateX: -50 }],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  inactiveDot: {
    backgroundColor: '#d1d1d1',
  },
  infoContainer: {
    padding: 16,
  },
  carName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  carDetail: {
    fontSize: 16,
    color: '#4a4a4a',
    marginBottom: 4,
  },
  carPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  reserveButton: {
    marginTop: 16,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
  },
  reserveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});