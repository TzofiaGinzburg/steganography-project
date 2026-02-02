import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView } from 'react-native';

const GlobalFeedScreen = ({ route }: any) => {
  // מקבלים את הפרמטרים מהניווט (האם באנו מקבוצה מסוימת או מהעולם)
  const { target, groupName } = route.params || { target: 'world' };

  // נתוני דמה של פוסטים (סטגנוגרפיה)
  const mockPosts = [
    { 
      id: '1', 
      author: 'ישראל ישראלי', 
      description: 'תמונה יפה מהטיול בצפון', 
      image: 'https://picsum.photos/id/10/400/300', 
      target: 'world' 
    },
    { 
      id: '2', 
      author: 'דנה כהן', 
      description: 'המשימה הסודית של הצוות', 
      image: 'https://picsum.photos/id/20/400/300', 
      target: '3' // ID של קבוצת "צוות פיתוח"
    },
    { 
      id: '3', 
      author: 'אבי לוי', 
      description: 'מתכון סודי לעוגה של סבתא', 
      image: 'https://picsum.photos/id/30/400/300', 
      target: '1' // ID של קבוצת "משפחה"
    },
  ];

  // סינון הפוסטים לפי היעד שנבחר
  const filteredPosts = target === 'world' 
    ? mockPosts.filter(p => p.target === 'world')
    : mockPosts.filter(p => p.target === target);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {target === 'world' ? 'פוסטים מהעולם' : `פוסטים של: ${groupName}`}
        </Text>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.author}</Text>
              <Text style={styles.postType}>{item.target === 'world' ? '🌐 ציבורי' : '👥 קבוצתי'}</Text>
            </View>
            
            <Image source={{ uri: item.image }} style={styles.image} />
            
            <View style={styles.details}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.stegoTag}>🔒 מכיל מסר סודי</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>אין פוסטים להצגה כרגע</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  header: { padding: 20, backgroundColor: '#6200EE', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', margin: 10, borderRadius: 15, elevation: 4, overflow: 'hidden' },
  userInfo: { padding: 12, flexDirection: 'row-reverse', justifyContent: 'space-between', borderBottomWidth: 0.5, borderColor: '#eee' },
  userName: { fontWeight: 'bold', fontSize: 16 },
  postType: { fontSize: 12, color: '#666' },
  image: { width: '100%', height: 250 },
  details: { padding: 15 },
  description: { textAlign: 'right', fontSize: 16, color: '#333' },
  stegoTag: { textAlign: 'right', color: '#00C853', fontSize: 12, marginTop: 5, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#999' }
});

export default GlobalFeedScreen;