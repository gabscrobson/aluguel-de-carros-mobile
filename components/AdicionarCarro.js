import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { database } from '../firebase/firebase';
import { ref, push } from 'firebase/database';
import ImageUrlManager from '../components/ImageUrlManager';
import { Header } from './Header';
import { Picker } from '@react-native-picker/picker';

export function AdicionarCarro() {
  const [carData, setCarData] = useState({
    nome: '',
    cor: '',
    estado: 'disponivel',
    precoAtual: '',
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (name, value) => {
    setCarData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!carData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!carData.cor.trim()) {
      newErrors.cor = 'Cor é obrigatória';
    }

    if (!carData.precoAtual || carData.precoAtual <= 0) {
      newErrors.precoAtual = 'Preço deve ser maior que zero';
    }

    if (imageUrls.length === 0) {
      newErrors.images = 'Adicione pelo menos uma imagem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await push(ref(database, 'carros'), {
        ...carData,
        imagens: imageUrls,
      });

      Alert.alert('Sucesso', 'Carro adicionado com sucesso');

      setCarData({
        nome: '',
        cor: '',
        estado: 'disponivel',
        precoAtual: '',
      });
      setImageUrls([]);
    }
  };

  return (
    <>
        <Header />
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
            <Text style={styles.title}>Adicionar Novo Carro</Text>
            <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Carro</Text>
            <TextInput
                value={carData.nome}
                onChangeText={(value) => handleInputChange('nome', value)}
                style={[styles.input, errors.nome && styles.errorInput]}
                placeholder="Ex: Sedan Luxo 2023"
            />
            {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>Cor</Text>
            <TextInput
                value={carData.cor}
                onChangeText={(value) => handleInputChange('cor', value)}
                style={[styles.input, errors.cor && styles.errorInput]}
                placeholder="Ex: Preto Metálico"
            />
            {errors.cor && <Text style={styles.errorText}>{errors.cor}</Text>}
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={carData.estado}
                    onValueChange={(value) => handleInputChange('estado', value)}
                    style={styles.picker}
                >
                    <Picker.Item label="Disponível" value="disponivel" />
                    <Picker.Item label="Alugado" value="alugado" />
                </Picker>
            </View>
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>Preço por Dia (R$)</Text>
            <TextInput
                value={carData.precoAtual}
                onChangeText={(value) => handleInputChange('precoAtual', value)}
                style={[styles.input, errors.precoAtual && styles.errorInput]}
                placeholder="0.00"
                keyboardType="numeric"
            />
            {errors.precoAtual && <Text style={styles.errorText}>{errors.precoAtual}</Text>}
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>Fotos do Carro</Text>
            <ImageUrlManager imageUrls={imageUrls} setImageUrls={setImageUrls} />
            {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
            </View>

            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Adicionar Carro</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    width: '100%',
  },
});