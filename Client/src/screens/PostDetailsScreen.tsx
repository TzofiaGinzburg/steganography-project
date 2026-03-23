import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, FlatList, TextInput, 
  TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, 
  SafeAreaView, StatusBar
} from 'react-native';
import { BASE_URL } from '../api/Constants';

const PostDetailsScreen = ({ route, navigation }: any) => { 
  const { post, userName } = route.params;
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/posts/${post.id}/comments`);
      const data = await res.json();
      const sorted = Array.isArray(data) ? data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) : [];
      setComments(sorted);
    } catch (e) { console.log("Error fetching comments", e); }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await fetch(`${BASE_URL}/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: userName, text: newComment })
      });
      setNewComment('');
      fetchComments();
    } catch (e) { console.log("Error adding comment", e); }
  };

  useEffect(() => { fetchComments(); }, []);

  const formatCommentDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})} | ${d.toLocaleDateString('he-IL')}`;
  };

  const renderComment = ({ item }: { item: any }) => (
    <View style={styles.commentCard}>
      <View style={styles.commentHeaderRow}>
        <View style={styles.commentInfo}>
          <View style={styles.nameAndTime}>
             <Text style={styles.commentDate}>{formatCommentDate(item.createdAt)}</Text>
             <Text style={styles.commentUser}>{item.author}</Text>
          </View>
          <Text style={styles.commentContent}>{item.text}</Text>
        </View>
        <View style={styles.avatarMini}>
          <Text style={styles.avatarText}>{item.author?.charAt(0).toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* כותרת עמוד עליונה עם כפתור חזור */}
      <View style={styles.topPageHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>➜</Text>
        </TouchableOpacity>
        <Text style={styles.topPageTitle}>פרטי פוסט</Text>
        <View style={{ width: 40 }} /> {/* שומר על הכותרת במרכז */}
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
              <Text style={styles.mainAuthorName}>פורסם על ידי: {post.author}</Text>
              <View style={styles.imageFrame}>
                <Image source={{ uri: post.imageUrl }} style={styles.fullImage} />
              </View>
              <View style={styles.postDetails}>
                <Text style={styles.descriptionLabel}>תיאור הקובץ:</Text>
                <Text style={styles.detailDesc}>{post.description}</Text>
                <View style={styles.divider} />
                <Text style={styles.commentHeading}>תגובות ({comments.length})</Text>
              </View>
            </View>
          )}
          renderItem={renderComment}
        />

        <View style={styles.inputArea}>
          <TextInput 
            style={styles.textInput} 
            placeholder="הקלד תגובה חדשה..." 
            placeholderTextColor="#A0A0A0"
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity onPress={handleAddComment} style={styles.sendButtonGradient}>
             <Text style={styles.sendButtonText}>שלח</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  topPageHeader: { 
    height: 60, 
    backgroundColor: '#FFF', 
    flexDirection: 'row-reverse', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15,
    borderBottomWidth: 1, 
    borderBottomColor: '#E0E0E0',
    elevation: 2
  },
  topPageTitle: { fontSize: 20, fontWeight: '800', color: '#6200EE' },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: 20,
    transform: [{ scaleX: -1 }] // הופך את החץ לצד השני כדי שיסמן חזרה
  },
  backButtonText: { fontSize: 22, color: '#6200EE', fontWeight: 'bold' },
  listPadding: { paddingBottom: 20 },
  headerContainer: { padding: 15 },
  mainAuthorName: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#333', 
    textAlign: 'right', 
    marginBottom: 12,
    paddingRight: 5
  },
  imageFrame: { 
    width: '100%', 
    height: 300, 
    borderRadius: 20, 
    borderWidth: 4, 
    borderColor: '#FFF', 
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  fullImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  postDetails: { marginTop: 20 },
  descriptionLabel: { fontSize: 14, fontWeight: 'bold', color: '#6200EE', textAlign: 'right', marginBottom: 5 },
  detailDesc: { fontSize: 16, color: '#444', textAlign: 'right', lineHeight: 22 },
  divider: { height: 1, backgroundColor: '#DDD', marginVertical: 20 },
  commentHeading: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', textAlign: 'right', marginBottom: 10 },
  
  commentCard: { 
    backgroundColor: '#FFF', 
    marginHorizontal: 15, 
    marginVertical: 5, 
    padding: 12, 
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#6200EE'
  },
  commentHeaderRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  commentInfo: { flex: 1, marginRight: 12 },
  nameAndTime: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 4 },
  commentUser: { fontWeight: 'bold', color: '#333', fontSize: 14, marginLeft: 8 },
  commentDate: { fontSize: 10, color: '#999' },
  commentContent: { fontSize: 14, color: '#555', textAlign: 'right' },
  avatarMini: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E1D5FF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#6200EE', fontWeight: 'bold', fontSize: 12 },

  inputArea: { 
    flexDirection: 'row', 
    padding: 15, 
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center'
  },
  textInput: { 
    flex: 1, 
    backgroundColor: '#F1F3F5', 
    borderRadius: 25, 
    paddingHorizontal: 20, 
    paddingVertical: 10,
    textAlign: 'right',
    color: '#333'
  },
  sendButtonGradient: { 
    backgroundColor: '#6200EE', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 25, 
    marginLeft: 10,
    elevation: 3
  },
  sendButtonText: { color: '#FFF', fontWeight: 'bold' }
});

export default PostDetailsScreen;