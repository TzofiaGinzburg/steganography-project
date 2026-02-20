import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  TouchableOpacity, ScrollView, ActivityIndicator, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../api/Constants';

// הגדרת מבנה הפוסט כדי שה-TypeScript לא יהיה "אדום"
interface Post {
  id: string;
  author: string;
  description: string;
  imageUrl: string;
  target: string;
  secretMessage?: string;
}

const GroupDetailScreen = ({ route, navigation }: any) => {
  const { groupId, groupName } = route.params || { groupId: '1', groupName: 'קבוצה' };
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      // שליפת פוסטים מהשרת לפי ה-ID של הקבוצה
      const postsRes = await fetch(`http://10.0.2.2:8080/api/posts/feed/${groupId}`);
      const postsData = await postsRes.json();
      setPosts(postsData);

      // נתוני דמה לחברים (כי עוד לא בנינו API כזה ב-Java)
      setMembers([
        { id: '1', name: 'אבי', avatar: '👨' },
        { id: '2', name: 'מיכל', avatar: '👩' },
        { id: '3', name: 'דני', avatar: '👦' },
      ]);
    } catch (error) {
      console.error("Error fetching group data:", error);
      Alert.alert("שגיאה", "לא ניתן היה למשוך נתונים מהשרת");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#6200EE" style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.container}>
      {/* כותרת הקבוצה */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={{color: '#fff'}}> חזור </Text>
        </TouchableOpacity>
        <Text style={styles.groupTitle}>{groupName}</Text>
      </View>

      {/* רשימת חברים אופקית */}
      <View style={styles.membersContainer}>
        <Text style={styles.sectionTitle}>חברי הקבוצה:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.membersList}>
          {members.map((member) => (
            <TouchableOpacity 
              key={member.id} 
              style={styles.memberCircle}
              onPress={() => navigation.navigate('GlobalFeed', { target: member.id, groupName: member.name })}
            >
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarEmoji}>{member.avatar || '👤'}</Text>
              </View>
              <Text style={styles.memberNameSmall}>{member.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* פיד פוסטים */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.emptyText}>אין עדיין פוסטים בקבוצה זו</Text>}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <Text style={styles.author}>{item.author}</Text>
              <Text style={styles.date}># {item.id.substring(0, 4)}</Text>
            </View>
            
            <Text style={styles.postText}>{item.description}</Text>
            
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.postImage} resizeMode="cover" />
            )}

            <TouchableOpacity 
              style={styles.stegoButton}
              onPress={() => Alert.alert("המסר הסודי שחולץ:", item.secretMessage || "לא נמצא מסר סודי בקובץ זה")}
            >
              <Text style={styles.stegoButtonText}>🔍 חלץ מסר סודי (סטגנוגרפיה)</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { padding: 15, backgroundColor: '#6200EE', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', right: 15 },
  groupTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  membersContainer: { backgroundColor: '#fff', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginRight: 15, textAlign: 'right', color: '#666', marginBottom: 5 },
  membersList: { paddingHorizontal: 10, flexDirection: 'row-reverse' },
  memberCircle: { alignItems: 'center', marginHorizontal: 8, width: 60 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#6200EE' },
  avatarEmoji: { fontSize: 24 },
  memberNameSmall: { fontSize: 10, marginTop: 4, textAlign: 'center' },
  postCard: { backgroundColor: '#fff', marginTop: 12, marginHorizontal: 10, borderRadius: 12, overflow: 'hidden', elevation: 2 },
  postHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 10, backgroundColor: '#fafafa' },
  author: { fontWeight: 'bold', color: '#333' },
  date: { fontSize: 11, color: '#999' },
  postText: { padding: 10, textAlign: 'right', fontSize: 15 },
  postImage: { width: '100%', height: 250, backgroundColor: '#eee' },
  stegoButton: { padding: 12, backgroundColor: '#F3E5F5', alignItems: 'center' },
  stegoButtonText: { color: '#6200EE', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
});

export default GroupDetailScreen;