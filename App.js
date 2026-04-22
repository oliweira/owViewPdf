import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [pdfUri, setPdfUri] = useState(null);
  const [targetPage, setTargetPage] = useState('');
  const [loading, setLoading] = useState(false);
  const pdfRef = useRef(null);

  // Função para abrir o seletor de arquivos
  const pickDocument = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setPdfUri(result.assets[0].uri);
      }
    } catch (err) {
      console.log('Erro ao selecionar documento:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToPage = () => {
    const pageNum = parseInt(targetPage);
    if (pageNum && pdfRef.current) {
      pdfRef.current.setPage(pageNum);
    }
  };

  // 1. Tela Inicial (Sem PDF selecionado)
  if (!pdfUri) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="dark-content" />
        <MaterialIcons name="picture-as-pdf" size={80} color="#F44336" />
        <Text style={styles.title}>Visualizador de Playlist</Text>
        <TouchableOpacity style={styles.mainButton} onPress={pickDocument}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Selecionar Arquivo PDF</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // 2. Tela do Visualizador (Com PDF carregado)
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Pdf
        ref={pdfRef}
        source={{ uri: pdfUri }}
        horizontal={true}
        enablePaging={true}
        fitPolicy={1}
        style={styles.pdf}
        onError={(error) => {
          console.log(error);
          setPdfUri(null); // Volta para a tela inicial se der erro
        }}
      />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pág"
          keyboardType="numeric"
          value={targetPage}
          onChangeText={setTargetPage}
          onSubmitEditing={handleGoToPage}
        />
        <TouchableOpacity style={styles.button} onPress={handleGoToPage}>
          <Text style={styles.buttonText}>Ir</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={() => pdfRef.current?.setPage(1)}
        >
          <MaterialIcons name="home" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Botão para trocar de arquivo */}
        <TouchableOpacity 
          style={[styles.homeButton, {backgroundColor: '#F44336'}]} 
          onPress={() => setPdfUri(null)}
        >
          <MaterialIcons name="file-upload" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5' 
  },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 20, color: '#333' },
  mainButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 5,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 5,
    elevation: 10,
    alignItems: 'center',
    gap: 5
  },
  input: { width: 45, height: 40, textAlign: 'center', fontSize: 16 },
  button: { backgroundColor: '#2196F3', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  homeButton: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});