// // import React, { useState, useEffect } from 'react';
// // import { 
// //   View, Text, Image, FlatList, TextInput, 
// //   TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform 
// // } from 'react-native';
// // import { BASE_URL } from '../api/Constants';

// // const PostDetailsScreen = ({ route }: any) => {
// //   const { post, userName } = route.params;
// //   const [comments, setComments] = useState<any[]>([]);
// //   const [newComment, setNewComment] = useState('');

// //   // שליפת תגובות מהשרת
// //   const fetchComments = async () => {
// //     try {
// //       const res = await fetch(`${BASE_URL}/posts/${post.id}/comments`);
// //       const data = await res.json();
// //       setComments(data);
// //     } catch (e) { console.log("Error fetching comments", e); }
// //   };

// //   // שליחת תגובה חדשה
// //   const handleAddComment = async () => {
// //     if (!newComment.trim()) return;
// //     try {
// //       await fetch(`${BASE_URL}/posts/${post.id}/comments`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ author: userName, text: newComment })
// //       });
// //       setNewComment('');
// //       fetchComments(); // רענון הרשימה
// //     } catch (e) { console.log("Error adding comment", e); }
// //   };

// //   useEffect(() => { fetchComments(); }, []);

// //   return (
// //     <KeyboardAvoidingView 
// //       behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
// //       style={styles.container}
// //     >
// //       <FlatList
// //         data={comments}
// //         keyExtractor={(item) => item.id}
// //         ListHeaderComponent={() => (
// //           <View>
// //             <Image source={{ uri: post.imageUrl }} style={styles.fullImage} />
// //             <View style={styles.postInfo}>
// //               <Text style={styles.detailAuthor}>{post.author}</Text>
// //               <Text style={styles.detailDesc}>{post.description}</Text>
// //               <View style={styles.separator} />
// //               <Text style={styles.commentHeader}>תגובות ({comments.length})</Text>
// //             </View>
// //           </View>
// //         )}
// //         renderItem={({ item }) => (
// //           <View style={styles.commentBox}>
// //             <Text style={styles.commentUser}>{item.author}</Text>
// //             <Text style={styles.commentText}>{item.text}</Text>
// //           </View>
// //         )}
// //       />

// //       {/* אזור כתיבת התגובה */}
// //       <View style={styles.inputArea}>
// //         <TextInput 
// //           style={styles.textInput} 
// //           placeholder="כתוב תגובה..." 
// //           value={newComment}
// //           onChangeText={setNewComment}
// //           multiline
// //         />
// //         <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
// //           <Text style={styles.sendText}>שלח</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </KeyboardAvoidingView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#fff' },
// //   fullImage: { width: '100%', height: 350, resizeMode: 'cover' },
// //   postInfo: { padding: 20 },
// //   detailAuthor: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: 'right' },
// //   detailDesc: { fontSize: 16, color: '#444', textAlign: 'right' },
// //   separator: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
// //   commentHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'right' },
// //   commentBox: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
// //   commentUser: { fontWeight: 'bold', color: '#007AFF', textAlign: 'right' },
// //   commentText: { textAlign: 'right', marginTop: 3 },
// //   inputArea: { 
// //     flexDirection: 'row-reverse', 
// //     padding: 10, 
// //     borderTopWidth: 1, 
// //     borderColor: '#eee', 
// //     alignItems: 'center',
// //     backgroundColor: '#fff'
// //   },
// //   textInput: { 
// //     flex: 1, 
// //     backgroundColor: '#f0f2f5', 
// //     borderRadius: 20, 
// //     paddingHorizontal: 15, 
// //     paddingVertical: 8,
// //     textAlign: 'right' 
// //   },
// //   sendButton: { marginRight: 10, padding: 10 },
// //   sendText: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 }
// // });

// // export default PostDetailsScreen;
// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, Image, FlatList, TextInput, 
//   TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, 
//   SafeAreaView, StatusBar
// } from 'react-native';
// import { BASE_URL } from '../api/Constants';

// const PostDetailsScreen = ({ route }: any) => {
//   const { post, userName } = route.params;
//   const [comments, setComments] = useState<any[]>([]);
//   const [newComment, setNewComment] = useState('');

//   const fetchComments = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/posts/${post.id}/comments`);
//       const data = await res.json();
//       // מיון תגובות: החדשה ביותר למעלה
//       const sorted = Array.isArray(data) ? data.sort((a, b) => 
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//       ) : [];
//       setComments(sorted);
//     } catch (e) { console.log("Error fetching comments", e); }
//   };

//   const handleAddComment = async () => {
//     if (!newComment.trim()) return;
//     try {
//       await fetch(`${BASE_URL}/posts/${post.id}/comments`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ author: userName, text: newComment })
//       });
//       setNewComment('');
//       fetchComments();
//     } catch (e) { console.log("Error adding comment", e); }
//   };

//   useEffect(() => { fetchComments(); }, []);

//   const formatCommentDate = (dateStr: string) => {
//     if (!dateStr) return "";
//     const d = new Date(dateStr);
//     return `${d.toLocaleDateString('he-IL')} בשעה ${d.toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}`;
//   };

//   const renderComment = ({ item }: { item: any }) => (
//     <View style={styles.commentCard}>
//       <View style={styles.commentHeaderRow}>
//         <View style={styles.commentInfo}>
//           <Text style={styles.commentUser}>{item.author}</Text>
//           <Text style={styles.commentDate}>{formatCommentDate(item.createdAt)}</Text>
//         </View>
//         {/* תמונת פרופיל אנונימית בעיגול */}
//         <View style={styles.avatarMini}>
//           <Text style={styles.avatarText}>{item.author?.charAt(0).toUpperCase()}</Text>
//         </View>
//       </View>
//       <Text style={styles.commentContent}>{item.text}</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />
//       <KeyboardAvoidingView 
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//       >
//         <FlatList
//           data={comments}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.listPadding}
//           ListHeaderComponent={() => (
//             <View style={styles.headerContainer}>
//               <View style={styles.imageWrapper}>
//                 <Image source={{ uri: post.imageUrl }} style={styles.fullImage} />
//                 <View style={styles.authorOverlay}>
//                   <Text style={styles.authorOverlayText}>פורסם ע"י {post.author}</Text>
//                 </View>
//               </View>
              
//               <View style={styles.postDetails}>
//                 <Text style={styles.pageTitle}>פרטי הפוסט</Text>
//                 <Text style={styles.detailDesc}>{post.description}</Text>
//                 <View style={styles.statsRow}>
//                    <Text style={styles.commentCount}>💬 {comments.length} תגובות</Text>
//                 </View>
//               </View>
//             </View>
//           )}
//           renderItem={renderComment}
//         />

//         <View style={styles.inputArea}>
//           <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
//             <Text style={styles.sendText}>פרסם</Text>
//           </TouchableOpacity>
//           <TextInput 
//             style={styles.textInput} 
//             placeholder="הוספת תגובה..." 
//             placeholderTextColor="#999"
//             value={newComment}
//             onChangeText={setNewComment}
//             multiline
//           />
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F0F2F5' },
//   listPadding: { paddingBottom: 30 },
//   headerContainer: { backgroundColor: '#fff', borderBottomLeftRadius: 25, borderBottomRightRadius: 25, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 15 },
//   imageWrapper: { width: '100%', height: 350, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, overflow: 'hidden' },
//   fullImage: { width: '100%', height: '100%' },
//   authorOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.4)', padding: 10 },
//   authorOverlayText: { color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'right' },
//   postDetails: { padding: 20 },
//   pageTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', textAlign: 'right', marginBottom: 10 },
//   detailDesc: { fontSize: 16, color: '#4A4A4A', textAlign: 'right', lineHeight: 22 },
//   statsRow: { marginTop: 15, flexDirection: 'row-reverse' },
//   commentCount: { fontSize: 14, color: '#6200EE', fontWeight: 'bold' },
  
//   commentCard: { 
//     backgroundColor: '#fff', 
//     marginHorizontal: 15, 
//     marginVertical: 6, 
//     padding: 15, 
//     borderRadius: 18,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 5
//   },
//   commentHeaderRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 8 },
//   commentInfo: { marginRight: 12 },
//   commentUser: { fontWeight: '800', color: '#1A1A1A', textAlign: 'right', fontSize: 14 },
//   commentDate: { fontSize: 10, color: '#AAA', textAlign: 'right' },
//   avatarMini: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#6200EE', justifyContent: 'center', alignItems: 'center' },
//   avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
//   commentContent: { fontSize: 14, color: '#333', textAlign: 'right', lineHeight: 20, paddingRight: 47 },

//   inputArea: { 
//     flexDirection: 'row', 
//     padding: 12, 
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderColor: '#EFEFEF',
//     alignItems: 'center'
//   },
//   textInput: { 
//     flex: 1, 
//     backgroundColor: '#F0F2F5', 
//     borderRadius: 25, 
//     paddingHorizontal: 20, 
//     paddingVertical: 10,
//     textAlign: 'right',
//     fontSize: 15,
//     maxHeight: 100
//   },
//   sendButton: { paddingHorizontal: 15 },
//   sendText: { color: '#6200EE', fontWeight: 'bold', fontSize: 16 }
// });

// export default PostDetailsScreen;
import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, FlatList, TextInput, 
  TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, 
  SafeAreaView, StatusBar
} from 'react-native';
import { BASE_URL } from '../api/Constants';

const PostDetailsScreen = ({ route }: any) => {
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
      
      {/* כותרת עמוד עליונה */}
      <View style={styles.topPageHeader}>
        <Text style={styles.topPageTitle}>פרטי פוסט</Text>
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
              
              {/* שם מפרסם ללא רקע אפור */}
              <Text style={styles.mainAuthorName}>פורסם על ידי: {post.author}</Text>

              {/* מסגרת יפה לקובץ/תמונה */}
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

        {/* אזור שליחת תגובה מעוצב */}
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
    justifyContent: 'center', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E0E0E0',
    elevation: 2
  },
  topPageTitle: { fontSize: 20, fontWeight: '800', color: '#6200EE' },
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