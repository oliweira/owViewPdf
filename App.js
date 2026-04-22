import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [pdfUri, setPdfUri] = useState(null);
  const [targetPage, setTargetPage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const pdfRef = useRef(null);

  const pickDocument = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setPdfUri(result.assets[0].uri);
        setCurrentPage(1); // Reseta para a primeira página ao trocar de arquivo
      }
    } catch (err) {
      console.log('Erro ao selecionar documento:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToPage = () => {
    const pageNum = parseInt(targetPage);
    if (pageNum && pageNum > 0 && pageNum <= totalPages && pdfRef.current) {
      pdfRef.current.setPage(pageNum);
      setTargetPage(''); // Limpa o campo após a busca
    }
  };

  if (!pdfUri) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="dark-content" />
        <MaterialIcons name="picture-as-pdf" size={80} color="#F44336" />
        <Text style={styles.title}>Visualizador de Playlist</Text>
        <TouchableOpacity style={styles.mainButton} onPress={pickDocument}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Selecionar Arquivo PDF</Text>}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Pdf
        ref={pdfRef}
        source={{ uri: pdfUri }}
        horizontal={true}
        enablePaging={true}
        fitPolicy={0}
        onLoadComplete={(numberOfPages) => {
          setTotalPages(numberOfPages);
        }}
        onPageChanged={(page) => {
          setCurrentPage(page);
        }}
        style={styles.pdf}
        onError={(error) => {
          console.log(error);
          setPdfUri(null);
        }}
      />

      {/* Container de Busca (Topo) */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Página"
          keyboardType="numeric"
          value={targetPage}
          onChangeText={(text) => setTargetPage(text.replace(/[^0-9]/g, ''))}
          onSubmitEditing={handleGoToPage}
        />
        <TouchableOpacity style={styles.button} onPress={handleGoToPage}>
          <Text style={styles.buttonText}>Pesquisar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.homeButton} onPress={() => pdfRef.current?.setPage(1)}>
          <MaterialIcons name="home" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.homeButton, {backgroundColor: '#F44336'}]} 
          onPress={() => setPdfUri(null)}
        >
          <MaterialIcons name="file-upload" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Indicador de Página (Rodapé) */}
      <View style={styles.bottomInfo}>
        <Text style={styles.pageText}>
          Página {currentPage} de {totalPages}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 20, color: '#333' },
  mainButton: { backgroundColor: '#2196F3', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10, elevation: 5 },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 30,
    right: 30,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 5,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pageText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  input: {
    width: 115,
    height: 40,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#eeeeee',
    borderRadius: 5,
    color: '#000',
  },
  button: { backgroundColor: '#2196F3', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  homeButton: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, padding: 2 },
});