import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';

export default function ImageUrlManager({ imageUrls, setImageUrls }) {
  const [newUrl, setNewUrl] = useState('');

  const addImageUrl = () => {
    if (newUrl.trim() !== '') {
      setImageUrls([...imageUrls, newUrl.trim()]);
      setNewUrl('');
    }
  };

  const removeImageUrl = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          value={newUrl}
          onChangeText={setNewUrl}
          placeholder="Enter image URL"
          style={styles.input}
        />
        <TouchableOpacity onPress={addImageUrl} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageGrid}>
        {imageUrls.map((url, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: url }}
              style={styles.image}
              onError={(e) => {
                e.target.src =
                  'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg';
              }}
            />
            <TouchableOpacity
              onPress={() => removeImageUrl(index)}
              style={styles.removeButton}
              accessibilityLabel={`Remove image ${index + 1}`}
            >
              <X size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {imageUrls.length === 0 && (
        <Text style={styles.noImagesText}>Nenhuma imagem adicionada</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '48%',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 5,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'red',
    borderRadius: 50,
    padding: 4,
  },
  noImagesText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
});