import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GroupDetailScreen = ({ route }: any) => {
  const { groupName } = route.params || { groupName: 'קבוצה כללית' };
  const [activeTab, setActiveTab] = useState('posts');

  // נתונים לדוגמה
  const posts = [
    { id: '1', author: 'אבי', text: 'שלחתי תמונה עם קוד מוסתר', image: 'https://via.placeholder.com/150' },
    { id: '2', author: 'מיכל', text: 'מישהו הצליח לפענח?', image: null },
  ];

  const members = [
    { id: '1', name: 'אבי (מנהל)' },
    { id: '2', name: 'מיכל' },
    { id: '3', name: 'אתה' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.groupTitle}>{groupName}</Text>
      
      {/* תפריט בחירה בין פוסטים לחברים */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]} 
          onPress={() => setActiveTab('posts')}
        >
          <Text style={activeTab === 'posts' ? styles.activeTabText : styles.tabText}>פוסטים</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'members' && styles.activeTab]} 
          onPress={() => setActiveTab('members')}
        >
          <Text style={activeTab === 'members' ? styles.activeTabText : styles.tabText}>חברים</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'posts' ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              <Text style={styles.author}>{item.author}</Text>
              <Text style={styles.postText}>{item.text}</Text>
              {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>🔓 פענח תמונה</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.memberItem}>
              <Text style={styles.memberName}>{item.name}</Text>
              <TouchableOpacity><Text style={{color: 'red'}}>הסר</Text></TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  groupTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', margin: 15, color: '#6200EE' },
  tabContainer: { flexDirection: 'row-reverse', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd' },
  tab: { flex: 1, padding: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#6200EE' },
  tabText: { color: '#888', fontWeight: 'bold' },
  activeTabText: { color: '#6200EE', fontWeight: 'bold' },
  postCard: { backgroundColor: '#fff', margin: 10, padding: 15, borderRadius: 10, elevation: 3 },
  author: { fontWeight: 'bold', marginBottom: 5, textAlign: 'right' },
  postText: { textAlign: 'right', marginBottom: 10 },
  postImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
  actionButton: { backgroundColor: '#03DAC6', padding: 10, borderRadius: 5, alignItems: 'center' },
  actionButtonText: { fontWeight: 'bold' },
  memberItem: { backgroundColor: '#fff', padding: 15, marginHorizontal: 10, marginTop: 5, borderRadius: 8, flexDirection: 'row-reverse', justifyContent: 'space-between' },
  memberName: { fontSize: 16 }
});

export default GroupDetailScreen;