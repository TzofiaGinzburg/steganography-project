import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MenuNew = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>תפריט חדש</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('MyGroups')}
        >
          <Text style={styles.buttonText}>הקבוצות שלי</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, {marginTop: 20}]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>חזור</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  button: { backgroundColor: '#6200EE', padding: 15, borderRadius: 10, width: '80%', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18 }
});

export default MenuNew;