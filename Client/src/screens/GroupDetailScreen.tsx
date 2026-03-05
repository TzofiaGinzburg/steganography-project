// // // // // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // // // // import { 
// // // // // // // // // // // // //   View, Text, StyleSheet, FlatList, Image, 
// // // // // // // // // // // // //   TouchableOpacity, ScrollView, ActivityIndicator, Alert 
// // // // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // // // // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // // // // // // // // // הגדרת מבנה הפוסט כדי שה-TypeScript לא יהיה "אדום"
// // // // // // // // // // // // // interface Post {
// // // // // // // // // // // // //   id: string;
// // // // // // // // // // // // //   author: string;
// // // // // // // // // // // // //   description: string;
// // // // // // // // // // // // //   imageUrl: string;
// // // // // // // // // // // // //   target: string;
// // // // // // // // // // // // //   secretMessage?: string;
// // // // // // // // // // // // // }

// // // // // // // // // // // // // const GroupDetailScreen = ({ route, navigation }: any) => {
// // // // // // // // // // // // //   const { groupId, groupName } = route.params || { groupId: '1', groupName: 'קבוצה' };
  
// // // // // // // // // // // // //   const [posts, setPosts] = useState<Post[]>([]);
// // // // // // // // // // // // //   const [members, setMembers] = useState<any[]>([]);
// // // // // // // // // // // // //   const [loading, setLoading] = useState(true);

// // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // //     fetchGroupData();
// // // // // // // // // // // // //   }, [groupId]);

// // // // // // // // // // // // //   const fetchGroupData = async () => {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       // שליפת פוסטים מהשרת לפי ה-ID של הקבוצה
// // // // // // // // // // // // //       const postsRes = await fetch(`http://10.0.2.2:8080/api/posts/feed/${groupId}`);
// // // // // // // // // // // // //       const postsData = await postsRes.json();
// // // // // // // // // // // // //       setPosts(postsData);

// // // // // // // // // // // // //       // נתוני דמה לחברים (כי עוד לא בנינו API כזה ב-Java)
// // // // // // // // // // // // //       setMembers([
// // // // // // // // // // // // //         { id: '1', name: 'אבי', avatar: '👨' },
// // // // // // // // // // // // //         { id: '2', name: 'מיכל', avatar: '👩' },
// // // // // // // // // // // // //         { id: '3', name: 'דני', avatar: '👦' },
// // // // // // // // // // // // //       ]);
// // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // //       console.error("Error fetching group data:", error);
// // // // // // // // // // // // //       Alert.alert("שגיאה", "לא ניתן היה למשוך נתונים מהשרת");
// // // // // // // // // // // // //     } finally {
// // // // // // // // // // // // //       setLoading(false);
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   if (loading) return <ActivityIndicator size="large" color="#6200EE" style={{ flex: 1 }} />;

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // // // // // // //       {/* כותרת הקבוצה */}
// // // // // // // // // // // // //       <View style={styles.header}>
// // // // // // // // // // // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // // // // // // // // // // //           <Text style={{color: '#fff'}}> חזור </Text>
// // // // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // // // //         <Text style={styles.groupTitle}>{groupName}</Text>
// // // // // // // // // // // // //       </View>

// // // // // // // // // // // // //       {/* רשימת חברים אופקית */}
// // // // // // // // // // // // //       <View style={styles.membersContainer}>
// // // // // // // // // // // // //         <Text style={styles.sectionTitle}>חברי הקבוצה:</Text>
// // // // // // // // // // // // //         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.membersList}>
// // // // // // // // // // // // //           {members.map((member) => (
// // // // // // // // // // // // //             <TouchableOpacity 
// // // // // // // // // // // // //               key={member.id} 
// // // // // // // // // // // // //               style={styles.memberCircle}
// // // // // // // // // // // // //               onPress={() => navigation.navigate('GlobalFeed', { target: member.id, groupName: member.name })}
// // // // // // // // // // // // //             >
// // // // // // // // // // // // //               <View style={styles.avatarPlaceholder}>
// // // // // // // // // // // // //                 <Text style={styles.avatarEmoji}>{member.avatar || '👤'}</Text>
// // // // // // // // // // // // //               </View>
// // // // // // // // // // // // //               <Text style={styles.memberNameSmall}>{member.name}</Text>
// // // // // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // // // // //           ))}
// // // // // // // // // // // // //         </ScrollView>
// // // // // // // // // // // // //       </View>

// // // // // // // // // // // // //       {/* פיד פוסטים */}
// // // // // // // // // // // // //       <FlatList
// // // // // // // // // // // // //         data={posts}
// // // // // // // // // // // // //         keyExtractor={(item) => item.id}
// // // // // // // // // // // // //         contentContainerStyle={{ paddingBottom: 20 }}
// // // // // // // // // // // // //         ListEmptyComponent={<Text style={styles.emptyText}>אין עדיין פוסטים בקבוצה זו</Text>}
// // // // // // // // // // // // //         renderItem={({ item }) => (
// // // // // // // // // // // // //           <View style={styles.postCard}>
// // // // // // // // // // // // //             <View style={styles.postHeader}>
// // // // // // // // // // // // //               <Text style={styles.author}>{item.author}</Text>
// // // // // // // // // // // // //               <Text style={styles.date}># {item.id.substring(0, 4)}</Text>
// // // // // // // // // // // // //             </View>
            
// // // // // // // // // // // // //             <Text style={styles.postText}>{item.description}</Text>
            
// // // // // // // // // // // // //             {item.imageUrl && (
// // // // // // // // // // // // //               <Image source={{ uri: item.imageUrl }} style={styles.postImage} resizeMode="cover" />
// // // // // // // // // // // // //             )}

// // // // // // // // // // // // //             <TouchableOpacity 
// // // // // // // // // // // // //               style={styles.stegoButton}
// // // // // // // // // // // // //               onPress={() => Alert.alert("המסר הסודי שחולץ:", item.secretMessage || "לא נמצא מסר סודי בקובץ זה")}
// // // // // // // // // // // // //             >
// // // // // // // // // // // // //               <Text style={styles.stegoButtonText}>🔍 חלץ מסר סודי (סטגנוגרפיה)</Text>
// // // // // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // // // // //           </View>
// // // // // // // // // // // // //         )}
// // // // // // // // // // // // //       />
// // // // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // };

// // // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // // //   container: { flex: 1, backgroundColor: '#f0f2f5' },
// // // // // // // // // // // // //   header: { padding: 15, backgroundColor: '#6200EE', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center' },
// // // // // // // // // // // // //   backButton: { position: 'absolute', right: 15 },
// // // // // // // // // // // // //   groupTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
// // // // // // // // // // // // //   membersContainer: { backgroundColor: '#fff', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ddd' },
// // // // // // // // // // // // //   sectionTitle: { fontSize: 14, fontWeight: 'bold', marginRight: 15, textAlign: 'right', color: '#666', marginBottom: 5 },
// // // // // // // // // // // // //   membersList: { paddingHorizontal: 10, flexDirection: 'row-reverse' },
// // // // // // // // // // // // //   memberCircle: { alignItems: 'center', marginHorizontal: 8, width: 60 },
// // // // // // // // // // // // //   avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#6200EE' },
// // // // // // // // // // // // //   avatarEmoji: { fontSize: 24 },
// // // // // // // // // // // // //   memberNameSmall: { fontSize: 10, marginTop: 4, textAlign: 'center' },
// // // // // // // // // // // // //   postCard: { backgroundColor: '#fff', marginTop: 12, marginHorizontal: 10, borderRadius: 12, overflow: 'hidden', elevation: 2 },
// // // // // // // // // // // // //   postHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 10, backgroundColor: '#fafafa' },
// // // // // // // // // // // // //   author: { fontWeight: 'bold', color: '#333' },
// // // // // // // // // // // // //   date: { fontSize: 11, color: '#999' },
// // // // // // // // // // // // //   postText: { padding: 10, textAlign: 'right', fontSize: 15 },
// // // // // // // // // // // // //   postImage: { width: '100%', height: 250, backgroundColor: '#eee' },
// // // // // // // // // // // // //   stegoButton: { padding: 12, backgroundColor: '#F3E5F5', alignItems: 'center' },
// // // // // // // // // // // // //   stegoButtonText: { color: '#6200EE', fontWeight: 'bold' },
// // // // // // // // // // // // //   emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
// // // // // // // // // // // // // });

// // // // // // // // // // // // // export default GroupDetailScreen;
// // // // // // // // // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // // // // // // // // import { 
// // // // // // // // // // // //   View, Text, FlatList, Image, StyleSheet, 
// // // // // // // // // // // //   ActivityIndicator, Dimensions, RefreshControl 
// // // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // // import { useFocusEffect } from '@react-navigation/native';
// // // // // // // // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // // // // // // // const { width } = Dimensions.get('window');

// // // // // // // // // // // // const GroupDetailsScreen = ({ route }: any) => {
// // // // // // // // // // // //   const { groupId, groupName, userName } = route.params; // שם המשתמש הנוכחי לצורך זיהוי "שלי/שלו"
// // // // // // // // // // // //   const [posts, setPosts] = useState<any[]>([]);
// // // // // // // // // // // //   const [loading, setLoading] = useState(true);

// // // // // // // // // // // //   const fetchPosts = async () => {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       // שליפת פוסטים לפי ה-ID של הקבוצה
// // // // // // // // // // // //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// // // // // // // // // // // //       const data = await response.json();
// // // // // // // // // // // //       setPosts(data);
// // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // //       console.error("Error fetching posts:", error);
// // // // // // // // // // // //     } finally {
// // // // // // // // // // // //       setLoading(false);
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };

// // // // // // // // // // // //   useFocusEffect(
// // // // // // // // // // // //     useCallback(() => {
// // // // // // // // // // // //       fetchPosts();
// // // // // // // // // // // //     }, [groupId])
// // // // // // // // // // // //   );

// // // // // // // // // // // //   const renderPost = ({ item }: { item: any }) => {
// // // // // // // // // // // //     const isMyPost = item.author === userName; // בדיקה אם אני שלחתי

// // // // // // // // // // // //     return (
// // // // // // // // // // // //       <View style={[styles.messageWrapper, isMyPost ? styles.myMessage : styles.theirMessage]}>
// // // // // // // // // // // //         <View style={[styles.bubble, isMyPost ? styles.myBubble : styles.theirBubble]}>
          
// // // // // // // // // // // //           <Text style={styles.authorName}>{isMyPost ? "אני" : item.author}</Text>
          
// // // // // // // // // // // //           {item.imageUrl && (
// // // // // // // // // // // //             <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
// // // // // // // // // // // //           )}
          
// // // // // // // // // // // //           <Text style={styles.description}>{item.description}</Text>
          
// // // // // // // // // // // //           <Text style={styles.timeText}>
// // // // // // // // // // // //             {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // // // // // // // // // // //           </Text>
// // // // // // // // // // // //         </View>
// // // // // // // // // // // //       </View>
// // // // // // // // // // // //     );
// // // // // // // // // // // //   };

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // // // //       <View style={styles.header}>
// // // // // // // // // // // //         <Text style={styles.headerTitle}>{groupName}</Text>
// // // // // // // // // // // //       </View>

// // // // // // // // // // // //       {loading ? (
// // // // // // // // // // // //         <ActivityIndicator size="large" color="#6200EE" style={{ marginTop: 50 }} />
// // // // // // // // // // // //       ) : (
// // // // // // // // // // // //         <FlatList
// // // // // // // // // // // //           data={posts}
// // // // // // // // // // // //           keyExtractor={(item) => item.id}
// // // // // // // // // // // //           renderItem={renderPost}
// // // // // // // // // // // //           contentContainerStyle={styles.listContent}
// // // // // // // // // // // //           inverted={false} // אם אתה רוצה שהחדשים יהיו למטה, השאר false. אם החדשים למעלה - true.
// // // // // // // // // // // //           refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
// // // // // // // // // // // //           ListEmptyComponent={<Text style={styles.emptyText}>אין עדיין פוסטים בקבוצה הזו...</Text>}
// // // // // // // // // // // //         />
// // // // // // // // // // // //       )}
// // // // // // // // // // // //     </View>
// // // // // // // // // // // //   );
// // // // // // // // // // // // };

// // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // //   container: { flex: 1, backgroundColor: '#E5DDD5' }, // צבע רקע של וואטסאפ
// // // // // // // // // // // //   header: { padding: 15, backgroundColor: '#075E54', alignItems: 'center' },
// // // // // // // // // // // //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// // // // // // // // // // // //   listContent: { padding: 10 },
  
// // // // // // // // // // // //   messageWrapper: { flexDirection: 'row', marginBottom: 10, width: '100%' },
// // // // // // // // // // // //   myMessage: { justifyContent: 'flex-end' }, // הודעות שלי לימין
// // // // // // // // // // // //   theirMessage: { justifyContent: 'flex-start' }, // הודעות של אחרים לשמאל

// // // // // // // // // // // //   bubble: { 
// // // // // // // // // // // //     maxWidth: width * 0.75, 
// // // // // // // // // // // //     padding: 8, 
// // // // // // // // // // // //     borderRadius: 10, 
// // // // // // // // // // // //     elevation: 1,
// // // // // // // // // // // //     shadowColor: '#000',
// // // // // // // // // // // //     shadowOpacity: 0.1,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
// // // // // // // // // // // //   theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },

// // // // // // // // // // // //   authorName: { fontSize: 12, fontWeight: 'bold', color: '#075E54', marginBottom: 4, textAlign: 'right' },
// // // // // // // // // // // //   postImage: { width: width * 0.65, height: 200, borderRadius: 8, marginBottom: 5, resizeMode: 'cover' },
// // // // // // // // // // // //   description: { fontSize: 16, color: '#333', textAlign: 'right' },
// // // // // // // // // // // //   timeText: { fontSize: 10, color: '#888', textAlign: 'left', marginTop: 4 },
// // // // // // // // // // // //   emptyText: { textAlign: 'center', marginTop: 100, color: '#666' }
// // // // // // // // // // // // });

// // // // // // // // // // // // export default GroupDetailsScreen;
// // // // // // // // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // // // // // // // import { 
// // // // // // // // // // //   View, Text, FlatList, Image, StyleSheet, 
// // // // // // // // // // //   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity 
// // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // import { useFocusEffect } from '@react-navigation/native';
// // // // // // // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // // // // // // const { width } = Dimensions.get('window');

// // // // // // // // // // // const GroupDetailsScreen = ({ route, navigation }: any) => {
// // // // // // // // // // //   const { groupId, groupName, userName } = route.params;
// // // // // // // // // // //   const [posts, setPosts] = useState<any[]>([]);
// // // // // // // // // // //   const [loading, setLoading] = useState(true);

// // // // // // // // // // //   const fetchPosts = async () => {
// // // // // // // // // // //     try {
// // // // // // // // // // //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// // // // // // // // // // //       const data = await response.json();
// // // // // // // // // // //       setPosts(data);
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Error fetching posts:", error);
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   useFocusEffect(
// // // // // // // // // // //     useCallback(() => {
// // // // // // // // // // //       fetchPosts();
// // // // // // // // // // //     }, [groupId])
// // // // // // // // // // //   );

// // // // // // // // // // //   const renderPost = ({ item }: { item: any }) => {
// // // // // // // // // // //     const isMyPost = item.author === userName;
// // // // // // // // // // //     return (
// // // // // // // // // // //       <View style={[styles.messageWrapper, isMyPost ? styles.myMessage : styles.theirMessage]}>
// // // // // // // // // // //         <View style={[styles.bubble, isMyPost ? styles.myBubble : styles.theirBubble]}>
// // // // // // // // // // //           <Text style={styles.authorName}>{isMyPost ? "אני" : item.author}</Text>
// // // // // // // // // // //           {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.postImage} />}
// // // // // // // // // // //           <Text style={styles.description}>{item.description}</Text>
// // // // // // // // // // //           <Text style={styles.timeText}>
// // // // // // // // // // //              {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
// // // // // // // // // // //           </Text>
// // // // // // // // // // //         </View>
// // // // // // // // // // //       </View>
// // // // // // // // // // //     );
// // // // // // // // // // //   };

// // // // // // // // // // //   return (
// // // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // // //       <View style={styles.header}>
// // // // // // // // // // //         <Text style={styles.headerTitle}>{groupName}</Text>
// // // // // // // // // // //       </View>

// // // // // // // // // // //       <FlatList
// // // // // // // // // // //         data={posts}
// // // // // // // // // // //         keyExtractor={(item) => item.id}
// // // // // // // // // // //         renderItem={renderPost}
// // // // // // // // // // //         contentContainerStyle={[styles.listContent, { paddingBottom: 80 }]}
// // // // // // // // // // //         refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
// // // // // // // // // // //         ListEmptyComponent={!loading ? <Text style={styles.emptyText}>אין עדיין פוסטים בקבוצה...</Text> : null}
// // // // // // // // // // //       />

// // // // // // // // // // //       {/* --- שורת קלט למטה (סגנון וואטסאפ) --- */}
// // // // // // // // // // //       <View style={styles.inputContainer}>
// // // // // // // // // // //         <TouchableOpacity 
// // // // // // // // // // //           style={styles.fakeInput} 
// // // // // // // // // // //           onPress={() => navigation.navigate('CreatePost', { 
// // // // // // // // // // //             target: 'group', 
// // // // // // // // // // //             groupId: groupId, 
// // // // // // // // // // //             groupName: groupName,
// // // // // // // // // // //             userName: userName 
// // // // // // // // // // //           })}
// // // // // // // // // // //         >
// // // // // // // // // // //           <Text style={styles.plusIcon}>+</Text>
// // // // // // // // // // //           <Text style={styles.placeholderText}>הוסף פוסט או מסר סודי לקבוצה...</Text>
// // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // //       </View>
// // // // // // // // // // //     </View>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // //   container: { flex: 1, backgroundColor: '#E5DDD5' },
// // // // // // // // // // //   header: { padding: 15, backgroundColor: '#075E54', alignItems: 'center' },
// // // // // // // // // // //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// // // // // // // // // // //   listContent: { padding: 10 },
// // // // // // // // // // //   messageWrapper: { flexDirection: 'row', marginBottom: 10, width: '100%' },
// // // // // // // // // // //   myMessage: { justifyContent: 'flex-end' },
// // // // // // // // // // //   theirMessage: { justifyContent: 'flex-start' },
// // // // // // // // // // //   bubble: { maxWidth: width * 0.75, padding: 8, borderRadius: 10, elevation: 1 },
// // // // // // // // // // //   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
// // // // // // // // // // //   theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },
// // // // // // // // // // //   authorName: { fontSize: 12, fontWeight: 'bold', color: '#075E54', marginBottom: 4, textAlign: 'right' },
// // // // // // // // // // //   postImage: { width: width * 0.65, height: 200, borderRadius: 8, marginBottom: 5 },
// // // // // // // // // // //   description: { fontSize: 16, color: '#333', textAlign: 'right' },
// // // // // // // // // // //   timeText: { fontSize: 10, color: '#888', textAlign: 'left', marginTop: 4 },
// // // // // // // // // // //   emptyText: { textAlign: 'center', marginTop: 100, color: '#666' },
  
// // // // // // // // // // //   // עיצוב שורת הקלט
// // // // // // // // // // //   inputContainer: {
// // // // // // // // // // //     position: 'absolute', bottom: 0, width: '100%',
// // // // // // // // // // //     padding: 10, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center'
// // // // // // // // // // //   },
// // // // // // // // // // //   fakeInput: {
// // // // // // // // // // //     flex: 1, backgroundColor: '#fff', borderRadius: 25, height: 50,
// // // // // // // // // // //     flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15,
// // // // // // // // // // //     elevation: 2
// // // // // // // // // // //   },
// // // // // // // // // // //   plusIcon: { fontSize: 30, color: '#075E54', marginLeft: 10, fontWeight: '300' },
// // // // // // // // // // //   placeholderText: { color: '#999', fontSize: 16, textAlign: 'right', flex: 1 }
// // // // // // // // // // // });

// // // // // // // // // // // // export default GroupDetailsScreen;
// // // // // // // // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // // // // // // // import { 
// // // // // // // // // // //   View, Text, FlatList, Image, StyleSheet, 
// // // // // // // // // // //   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity 
// // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // import { useFocusEffect } from '@react-navigation/native';
// // // // // // // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // // // // // // const { width } = Dimensions.get('window');

// // // // // // // // // // // const GroupDetailsScreen = ({ route, navigation }: any) => {
// // // // // // // // // // //   const { groupId, groupName, userName } = route.params;
// // // // // // // // // // //   const [posts, setPosts] = useState<any[]>([]);
// // // // // // // // // // //   const [loading, setLoading] = useState(true);

// // // // // // // // // // //   const fetchPosts = async () => {
// // // // // // // // // // //     try {
// // // // // // // // // // //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// // // // // // // // // // //       const data = await response.json();
// // // // // // // // // // //       setPosts(data);
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Error fetching posts:", error);
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   useFocusEffect(
// // // // // // // // // // //     useCallback(() => {
// // // // // // // // // // //       fetchPosts();
// // // // // // // // // // //     }, [groupId])
// // // // // // // // // // //   );

// // // // // // // // // // //   const renderPost = ({ item }: { item: any }) => {
// // // // // // // // // // //     // בדיקה האם אני השולח
// // // // // // // // // // //     const isMyPost = item.author === userName;
    
// // // // // // // // // // //     return (
// // // // // // // // // // //       <View style={[styles.messageWrapper, isMyPost ? styles.myMessage : styles.theirMessage]}>
// // // // // // // // // // //         <View style={[styles.bubble, isMyPost ? styles.myBubble : styles.theirBubble]}>
          
// // // // // // // // // // //           {/* שם השולח: אם זה אני כותב "אני", אם לא - את השם שלו */}
// // // // // // // // // // //           <Text style={[styles.authorName, isMyPost ? styles.myAuthorName : styles.theirAuthorName]}>
// // // // // // // // // // //             {isMyPost ? "אני" : item.author || "משתמש לא ידוע"}
// // // // // // // // // // //           </Text>

// // // // // // // // // // //           {item.imageUrl && (
// // // // // // // // // // //             <Image source={{ uri: item.imageUrl }} style={styles.postImage} resizeMode="cover" />
// // // // // // // // // // //           )}

// // // // // // // // // // //           <View style={styles.textContainer}>
// // // // // // // // // // //             <Text style={styles.description}>{item.description}</Text>
            
// // // // // // // // // // //             <Text style={styles.timeText}>
// // // // // // // // // // //               {item.createdAt 
// // // // // // // // // // //                 ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
// // // // // // // // // // //                 : '--:--'}
// // // // // // // // // // //             </Text>
// // // // // // // // // // //           </View>

// // // // // // // // // // //           {/* כפתור חילוץ מסר סודי (אם קיים)
// // // // // // // // // // //           {item.secretMessage && (
// // // // // // // // // // //             <TouchableOpacity 
// // // // // // // // // // //               style={styles.stegoTag} 
// // // // // // // // // // //               onPress={() => alert(`המסר הסודי: ${item.secretMessage}`)}
// // // // // // // // // // //             >
// // // // // // // // // // //               <Text style={styles.stegoText}>🔍 חלץ מסר סודי</Text>
// // // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // // //           )} */}
// // // // // // // // // // //         </View>
// // // // // // // // // // //       </View>
// // // // // // // // // // //     );
// // // // // // // // // // //   };

// // // // // // // // // // //   return (
// // // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // // //       {/* כותרת וואטסאפ */}
// // // // // // // // // // //       <View style={styles.header}>
// // // // // // // // // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
// // // // // // // // // // //           <Text style={styles.backBtnText}>➜</Text>
// // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // //         <View style={styles.headerInfo}>
// // // // // // // // // // //           <Text style={styles.headerTitle}>{groupName}</Text>
// // // // // // // // // // //           <Text style={styles.headerSubtitle}>לחץ לפרטי הקבוצה</Text>
// // // // // // // // // // //         </View>
// // // // // // // // // // //       </View>

// // // // // // // // // // //       {loading && posts.length === 0 ? (
// // // // // // // // // // //         <ActivityIndicator size="large" color="#075E54" style={{ marginTop: 50 }} />
// // // // // // // // // // //       ) : (
// // // // // // // // // // //         <FlatList
// // // // // // // // // // //           data={posts}
// // // // // // // // // // //           keyExtractor={(item) => item.id}
// // // // // // // // // // //           renderItem={renderPost}
// // // // // // // // // // //           contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
// // // // // // // // // // //           refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
// // // // // // // // // // //           ListEmptyComponent={<Text style={styles.emptyText}>אין עדיין הודעות בקבוצה...</Text>}
// // // // // // // // // // //         />
// // // // // // // // // // //       )}

// // // // // // // // // // //       {/* שורת קלט תחתונה */}
// // // // // // // // // // //       <View style={styles.footer}>
// // // // // // // // // // //         <TouchableOpacity 
// // // // // // // // // // //           style={styles.inputBar} 
// // // // // // // // // // //           onPress={() => navigation.navigate('CreatePost', { 
// // // // // // // // // // //             target: 'group', 
// // // // // // // // // // //             groupId, 
// // // // // // // // // // //             groupName, 
// // // // // // // // // // //             userName 
// // // // // // // // // // //           })}
// // // // // // // // // // //         >
// // // // // // // // // // //           <Text style={styles.plusSymbol}>+</Text>
// // // // // // // // // // //           <Text style={styles.inputText}>הקלד הודעה...</Text>
// // // // // // // // // // //           <Text style={styles.cameraIcon}>📷</Text>
// // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // //         <View style={styles.micCircle}>
// // // // // // // // // // //           <Text style={{color: '#fff', fontSize: 20}}>🎙️</Text>
// // // // // // // // // // //         </View>
// // // // // // // // // // //       </View>
// // // // // // // // // // //     </View>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // //   container: { flex: 1, backgroundColor: '#E5DDD5' },
  
// // // // // // // // // // //   // Header Style
// // // // // // // // // // //   header: { 
// // // // // // // // // // //     height: 90, 
// // // // // // // // // // //     backgroundColor: '#075E54', 
// // // // // // // // // // //     flexDirection: 'row-reverse', 
// // // // // // // // // // //     alignItems: 'center', 
// // // // // // // // // // //     paddingTop: 30, 
// // // // // // // // // // //     paddingHorizontal: 15 
// // // // // // // // // // //   },
// // // // // // // // // // //   headerInfo: { flex: 1, marginRight: 15 },
// // // // // // // // // // //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'right' },
// // // // // // // // // // //   headerSubtitle: { color: '#A0D3C1', fontSize: 12, textAlign: 'right' },
// // // // // // // // // // //   backBtn: { padding: 5 },
// // // // // // // // // // //   backBtnText: { color: '#fff', fontSize: 24 },

// // // // // // // // // // //   // List Style
// // // // // // // // // // //   listContent: { padding: 10 },
// // // // // // // // // // //   messageWrapper: { flexDirection: 'row', marginBottom: 6, width: '100%' },
// // // // // // // // // // //   myMessage: { justifyContent: 'flex-end' },
// // // // // // // // // // //   theirMessage: { justifyContent: 'flex-start' },

// // // // // // // // // // //   // Bubble Style
// // // // // // // // // // //   bubble: { 
// // // // // // // // // // //     maxWidth: width * 0.8, 
// // // // // // // // // // //     padding: 6, 
// // // // // // // // // // //     borderRadius: 8, 
// // // // // // // // // // //     elevation: 1,
// // // // // // // // // // //     shadowColor: '#000',
// // // // // // // // // // //     shadowOffset: { width: 0, height: 1 },
// // // // // // // // // // //     shadowOpacity: 0.1,
// // // // // // // // // // //   },
// // // // // // // // // // //   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
// // // // // // // // // // //   theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },

// // // // // // // // // // //   // Text inside bubble
// // // // // // // // // // //   authorName: { fontSize: 13, fontWeight: 'bold', marginBottom: 2, textAlign: 'right' },
// // // // // // // // // // //   myAuthorName: { color: '#075E54' }, // שם ירוק להודעות שלי
// // // // // // // // // // //   theirAuthorName: { color: '#E91E63' }, // שם צבעוני (ורוד/כחול) לאחרים
  
// // // // // // // // // // //   postImage: { width: width * 0.73, height: 220, borderRadius: 6, marginBottom: 4 },
  
// // // // // // // // // // //   textContainer: { 
// // // // // // // // // // //     flexDirection: 'row-reverse', 
// // // // // // // // // // //     alignItems: 'flex-end', 
// // // // // // // // // // //     justifyContent: 'space-between' 
// // // // // // // // // // //   },
// // // // // // // // // // //   description: { fontSize: 16, color: '#333', textAlign: 'right', flexShrink: 1, marginLeft: 10 },
// // // // // // // // // // //   timeText: { fontSize: 10, color: '#888', minWidth: 35, textAlign: 'left' },

// // // // // // // // // // //   stegoTag: { 
// // // // // // // // // // //     marginTop: 5, 
// // // // // // // // // // //     padding: 4, 
// // // // // // // // // // //     backgroundColor: 'rgba(7, 94, 84, 0.1)', 
// // // // // // // // // // //     borderRadius: 4, 
// // // // // // // // // // //     alignItems: 'center' 
// // // // // // // // // // //   },
// // // // // // // // // // //   stegoText: { fontSize: 12, color: '#075E54', fontWeight: 'bold' },

// // // // // // // // // // //   // Footer Style
// // // // // // // // // // //   footer: { 
// // // // // // // // // // //     position: 'absolute', 
// // // // // // // // // // //     bottom: 10, 
// // // // // // // // // // //     flexDirection: 'row-reverse', 
// // // // // // // // // // //     width: '100%', 
// // // // // // // // // // //     paddingHorizontal: 10, 
// // // // // // // // // // //     alignItems: 'center' 
// // // // // // // // // // //   },
// // // // // // // // // // //   inputBar: { 
// // // // // // // // // // //     flex: 1, 
// // // // // // // // // // //     backgroundColor: '#fff', 
// // // // // // // // // // //     height: 48, 
// // // // // // // // // // //     borderRadius: 24, 
// // // // // // // // // // //     flexDirection: 'row-reverse', 
// // // // // // // // // // //     alignItems: 'center', 
// // // // // // // // // // //     paddingHorizontal: 15,
// // // // // // // // // // //     elevation: 2
// // // // // // // // // // //   },
// // // // // // // // // // //   plusSymbol: { fontSize: 28, color: '#888', marginLeft: 10 },
// // // // // // // // // // //   inputText: { flex: 1, textAlign: 'right', color: '#999', fontSize: 17 },
// // // // // // // // // // //   cameraIcon: { fontSize: 20, marginRight: 5 },
// // // // // // // // // // //   micCircle: { 
// // // // // // // // // // //     width: 48, 
// // // // // // // // // // //     height: 48, 
// // // // // // // // // // //     backgroundColor: '#075E54', 
// // // // // // // // // // //     borderRadius: 24, 
// // // // // // // // // // //     justifyContent: 'center', 
// // // // // // // // // // //     alignItems: 'center', 
// // // // // // // // // // //     marginRight: 5,
// // // // // // // // // // //     elevation: 2
// // // // // // // // // // //   },
// // // // // // // // // // //   emptyText: { textAlign: 'center', marginTop: 50, color: '#888' }
// // // // // // // // // // // });

// // // // // // // // // // // export default GroupDetailsScreen;
// // // // // // // // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // // // // // // // import { 
// // // // // // // // // //   View, Text, FlatList, Image, StyleSheet, 
// // // // // // // // // //   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity, Animated, Easing, Alert 
// // // // // // // // // // } from 'react-native';
// // // // // // // // // // import { useFocusEffect } from '@react-navigation/native';
// // // // // // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // // // // // const { width } = Dimensions.get('window');

// // // // // // // // // // // --- רכיב הכוכב המנצנץ ---
// // // // // // // // // // const SparklingStar = ({ onExtract }: { onExtract: () => void }) => {
// // // // // // // // // //   const anim = useRef(new Animated.Value(0)).current;

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     Animated.loop(
// // // // // // // // // //       Animated.sequence([
// // // // // // // // // //         Animated.timing(anim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
// // // // // // // // // //         Animated.timing(anim, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
// // // // // // // // // //       ])
// // // // // // // // // //     ).start();
// // // // // // // // // //   }, []);

// // // // // // // // // //   const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });
// // // // // // // // // //   const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '15deg'] });

// // // // // // // // // //   return (
// // // // // // // // // //     <TouchableOpacity onPress={onExtract} style={styles.starContainer}>
// // // // // // // // // //       <Animated.Text style={[styles.starEmoji, { transform: [{ scale }, { rotate }] }]}>
// // // // // // // // // //         ⭐
// // // // // // // // // //       </Animated.Text>
// // // // // // // // // //     </TouchableOpacity>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // const GroupDetailsScreen = ({ route, navigation }: any) => {
// // // // // // // // // //   const { groupId, groupName, userName } = route.params;
// // // // // // // // // //   const [posts, setPosts] = useState<any[]>([]);
// // // // // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // // // // //   const flatListRef = useRef<FlatList>(null);

// // // // // // // // // //   const fetchPosts = async () => {
// // // // // // // // // //     try {
// // // // // // // // // //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// // // // // // // // // //       const data = await response.json();
// // // // // // // // // //       // וודא שה-Java מחזיר ב-Ascending (מהישן לחדש)
// // // // // // // // // //       setPosts(data);
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error("Error fetching posts:", error);
// // // // // // // // // //     } finally {
// // // // // // // // // //       setLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   useFocusEffect(
// // // // // // // // // //     useCallback(() => {
// // // // // // // // // //       fetchPosts();
// // // // // // // // // //     }, [groupId])
// // // // // // // // // //   );

// // // // // // // // // //   const renderPost = ({ item }: { item: any }) => {
// // // // // // // // // //   // 1. זיהוי אם זה אני: userName חייב להגיע מ-route.params
// // // // // // // // // //   const isMyPost = item.author === userName; 

// // // // // // // // // //   return (
// // // // // // // // // //     // messageWrapper גורם לכל הבועה לזוז ימינה (flex-end) או שמאלה (flex-start)
// // // // // // // // // //     <View style={[
// // // // // // // // // //       styles.messageWrapper, 
// // // // // // // // // //       isMyPost ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }
// // // // // // // // // //     ]}>
      
// // // // // // // // // //       {/* הבועה עצמה */}
// // // // // // // // // //       <View style={[
// // // // // // // // // //         styles.bubble, 
// // // // // // // // // //         isMyPost ? styles.myBubble : styles.theirBubble
// // // // // // // // // //       ]}>
        
// // // // // // // // // //         {/* נקודה 1: שם השולח מעל התמונה */}
// // // // // // // // // //         <Text style={[
// // // // // // // // // //           styles.authorName, 
// // // // // // // // // //           { textAlign: isMyPost ? 'right' : 'left' }
// // // // // // // // // //         ]}>
// // // // // // // // // //           {isMyPost ? "אני" : (item.author || "חבר קבוצה")}
// // // // // // // // // //         </Text>

// // // // // // // // // //         {/* תמונה */}
// // // // // // // // // //         {item.imageUrl && (
// // // // // // // // // //           <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
// // // // // // // // // //         )}

// // // // // // // // // //         {/* תיאור הפוסט */}
// // // // // // // // // //         <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
// // // // // // // // // //           {/* כוכב מנצנץ אם יש מסר סודי */}
// // // // // // // // // //           {item.secretMessage && (isMyPost || item.secretRecipients?.includes(userName)) && (
// // // // // // // // // //             <SparklingStar onExtract={() => Alert.alert("מסר סודי", item.secretMessage)} />
// // // // // // // // // //           )}
// // // // // // // // // //           <Text style={styles.description}>{item.description}</Text>
// // // // // // // // // //         </View>

// // // // // // // // // //         <Text style={styles.timeText}>
// // // // // // // // // //           {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
// // // // // // // // // //         </Text>
// // // // // // // // // //       </View>
// // // // // // // // // //     </View>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // //   return (
// // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // //       <View style={styles.header}>
// // // // // // // // // //         <Text style={styles.headerTitle}>{groupName}</Text>
// // // // // // // // // //       </View>

// // // // // // // // // //       <FlatList
// // // // // // // // // //         ref={flatListRef}
// // // // // // // // // //         data={posts}
// // // // // // // // // //         keyExtractor={(item) => item.id}
// // // // // // // // // //         renderItem={renderPost}
// // // // // // // // // //         contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
// // // // // // // // // //         onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
// // // // // // // // // //         onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
// // // // // // // // // //         refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
// // // // // // // // // //         ListEmptyComponent={!loading ? <Text style={styles.emptyText}>אין עדיין הודעות בקבוצה...</Text> : null}
// // // // // // // // // //       />

// // // // // // // // // //       {/* שורת קלט מעוצבת */}
// // // // // // // // // //       <View style={styles.inputContainer}>
// // // // // // // // // //         <TouchableOpacity 
// // // // // // // // // //           style={styles.fakeInput} 
// // // // // // // // // //           onPress={() => navigation.navigate('CreatePost', { 
// // // // // // // // // //             target: 'group', groupId, groupName, userName 
// // // // // // // // // //           })}
// // // // // // // // // //         >
// // // // // // // // // //           <Text style={styles.plusIcon}>+</Text>
// // // // // // // // // //           <Text style={styles.placeholderText}>הוסף פוסט או מסר סודי...</Text>
// // // // // // // // // //         </TouchableOpacity>
        
// // // // // // // // // //       </View>
// // // // // // // // // //     </View>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // const styles = StyleSheet.create({
  
// // // // // // // // // //   container: { flex: 1, backgroundColor: '#E5DDD5' },
// // // // // // // // // //   header: { padding: 15, backgroundColor: '#075E54', alignItems: 'center', paddingTop: 40 },
// // // // // // // // // //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// // // // // // // // // //   listContent: { padding: 10 },
  
// // // // // // // // // //   messageWrapper: { flexDirection: 'row', marginBottom: 8, width: '100%' },
// // // // // // // // // //   myMessage: { justifyContent: 'flex-end' },
// // // // // // // // // //   theirMessage: { justifyContent: 'flex-start' },

// // // // // // // // // //   bubble: { maxWidth: width * 0.8, padding: 6, borderRadius: 8, elevation: 1 },
// // // // // // // // // //   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
// // // // // // // // // //   theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },

// // // // // // // // // //   authorName: { fontSize: 13, fontWeight: 'bold', marginBottom: 4, textAlign: 'right' },
// // // // // // // // // //   myAuthorName: { color: '#075E54' },
// // // // // // // // // //   theirAuthorName: { color: '#128C7E' },

// // // // // // // // // //   postImage: { width: width * 0.73, height: 220, borderRadius: 6, marginBottom: 5 },
  
// // // // // // // // // //   contentRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'flex-start' },
// // // // // // // // // //   description: { fontSize: 16, color: '#333', textAlign: 'right', flexShrink: 1 },
  
// // // // // // // // // //   starContainer: { marginLeft: 8 },
// // // // // // // // // //   starEmoji: { fontSize: 22 },

// // // // // // // // // //   timeText: { fontSize: 10, color: '#888', textAlign: 'left', marginTop: 2 },
// // // // // // // // // //   emptyText: { textAlign: 'center', marginTop: 100, color: '#666' },

// // // // // // // // // //   inputContainer: { position: 'absolute', bottom: 15, width: '100%', paddingHorizontal: 10 },
// // // // // // // // // //   fakeInput: { 
// // // // // // // // // //     flexDirection: 'row-reverse', backgroundColor: '#fff', borderRadius: 25, 
// // // // // // // // // //     height: 50, alignItems: 'center', paddingHorizontal: 15, elevation: 3 
// // // // // // // // // //   },
// // // // // // // // // //   plusIcon: { fontSize: 30, color: '#075E54', marginLeft: 10 },
// // // // // // // // // //   placeholderText: { color: '#999', fontSize: 16, textAlign: 'right', flex: 1 }
// // // // // // // // // // });

// // // // // // // // // // export default GroupDetailsScreen;
// // // // // // // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // // // // // // import { 
// // // // // // // // //   View, Text, FlatList, Image, StyleSheet, 
// // // // // // // // //   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity, Animated, Easing, Alert 
// // // // // // // // // } from 'react-native';
// // // // // // // // // import { useFocusEffect } from '@react-navigation/native';
// // // // // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // // // // const { width } = Dimensions.get('window');

// // // // // // // // // // --- רכיב הכוכב המנצנץ והזז ---
// // // // // // // // // const SparklingStar = ({ onExtract }: { onExtract: () => void }) => {
// // // // // // // // //   const anim = useRef(new Animated.Value(0)).current;

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     // אנימציה אינסופית של הגדלה וסיבוב
// // // // // // // // //     Animated.loop(
// // // // // // // // //       Animated.sequence([
// // // // // // // // //         Animated.timing(anim, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
// // // // // // // // //         Animated.timing(anim, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
// // // // // // // // //       ])
// // // // // // // // //     ).start();
// // // // // // // // //   }, []);

// // // // // // // // //   const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });
// // // // // // // // //   const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '20deg'] });
// // // // // // // // //   const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

// // // // // // // // //   return (
// // // // // // // // //     <TouchableOpacity onPress={onExtract} style={styles.starOverlay}>
// // // // // // // // //       <Animated.View style={{ transform: [{ scale }, { rotate }], opacity }}>
// // // // // // // // //         <Text style={styles.starEmoji}>✨</Text>
// // // // // // // // //       </Animated.View>
// // // // // // // // //     </TouchableOpacity>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // const GroupDetailsScreen = ({ route, navigation }: any) => {
// // // // // // // // //   const { groupId, groupName, userName } = route.params;
// // // // // // // // //   const [posts, setPosts] = useState<any[]>([]);
// // // // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // // // //   const flatListRef = useRef<FlatList>(null);

// // // // // // // // //   const fetchPosts = async () => {
// // // // // // // // //     try {
// // // // // // // // //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// // // // // // // // //       const data = await response.json();
// // // // // // // // //       setPosts(data);
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Error fetching posts:", error);
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   useFocusEffect(useCallback(() => { fetchPosts(); }, [groupId]));

// // // // // // // // //   const renderPost = ({ item }: { item: any }) => {
// // // // // // // // //     const isMyPost = item.author === userName;
    
// // // // // // // // //     // בדיקה האם יש מסר סודי שמיועד למשתמש הנוכחי
// // // // // // // // //     // הערה: בשרת שלך וודא שאתה מחזיר שדה שנקרא secretMessage רק אם המשתמש מורשה לראות אותו
// // // // // // // // //     const hasSecret = item.secretMessage && item.secretMessage.length > 0;

// // // // // // // // //     return (
// // // // // // // // //       <View style={[styles.messageWrapper, isMyPost ? styles.myMessage : styles.theirMessage]}>
// // // // // // // // //         <View style={[styles.bubble, isMyPost ? styles.myBubble : styles.theirBubble]}>
          
// // // // // // // // //           <Text style={[styles.authorName, isMyPost ? styles.myAuthorName : styles.theirAuthorName]}>
// // // // // // // // //             {isMyPost ? "אני" : (item.author || "חבר")}
// // // // // // // // //           </Text>

// // // // // // // // //           <View style={styles.mediaContainer}>
// // // // // // // // //             {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.postImage} />}
            
// // // // // // // // //             {/* הכוכב המנצנץ יופיע כאן אם יש מסר */}
// // // // // // // // //             {hasSecret && (
// // // // // // // // //               <SparklingStar onExtract={() => Alert.alert("🤫 מסר סודי שהוחבא", item.secretMessage)} />
// // // // // // // // //             )}
// // // // // // // // //           </View>

// // // // // // // // //           <View style={styles.textFooter}>
// // // // // // // // //             <Text style={styles.description}>{item.description}</Text>
// // // // // // // // //             <Text style={styles.timeText}>
// // // // // // // // //               {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
// // // // // // // // //             </Text>
// // // // // // // // //           </View>
// // // // // // // // //         </View>
// // // // // // // // //       </View>
// // // // // // // // //     );
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <View style={styles.container}>
// // // // // // // // //       <View style={styles.header}>
// // // // // // // // //         <Text style={styles.headerTitle}>{groupName}</Text>
// // // // // // // // //       </View>

// // // // // // // // //       <FlatList
// // // // // // // // //         ref={flatListRef}
// // // // // // // // //         data={posts}
// // // // // // // // //         keyExtractor={(item) => item.id.toString()}
// // // // // // // // //         renderItem={renderPost}
// // // // // // // // //         contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
// // // // // // // // //         onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
// // // // // // // // //         refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
// // // // // // // // //         ListEmptyComponent={!loading ? <Text style={styles.emptyText}>אין הודעות בקבוצה</Text> : null}
// // // // // // // // //       />
// // // // // // // // // // בתוך כפתור הניווט ליצירת פוסט ב-GroupDetailScreen
// // // // // // // // // navigation.navigate('CreatePostScreen', { 
// // // // // // // // //   target: 'group', 
// // // // // // // // //   groupId: groupId, 
// // // // // // // // //   userName: userName // <--- לוודא שזה עובר כאן
// // // // // // // // // });
// // // // // // // // //       <View style={styles.inputArea}>
// // // // // // // // //         <TouchableOpacity 
// // // // // // // // //           style={styles.fakeInput} 
// // // // // // // // //           onPress={() => navigation.navigate('CreatePost', { target: 'group', groupId, groupName, userName })}
// // // // // // // // //         >
// // // // // // // // //           <Text style={styles.plusIcon}>+</Text>
// // // // // // // // //           <Text style={styles.placeholderText}>שלח פוסט או מסר מוחבא...</Text>
// // // // // // // // //         </TouchableOpacity>
// // // // // // // // //       </View>
// // // // // // // // //     </View>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //   container: { flex: 1, backgroundColor: '#E5DDD5' },
// // // // // // // // //   header: { padding: 15, backgroundColor: '#075E54', alignItems: 'center', paddingTop: 45 },
// // // // // // // // //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
// // // // // // // // //   messageWrapper: { flexDirection: 'row', marginBottom: 12, width: '100%' },
// // // // // // // // //   myMessage: { justifyContent: 'flex-end' },
// // // // // // // // //   theirMessage: { justifyContent: 'flex-start' },

// // // // // // // // //   bubble: { maxWidth: width * 0.8, padding: 4, borderRadius: 10, elevation: 1 },
// // // // // // // // //   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
// // // // // // // // //   theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },

// // // // // // // // //   authorName: { fontSize: 12, fontWeight: 'bold', marginHorizontal: 8, marginTop: 4 },
// // // // // // // // //   myAuthorName: { color: '#075E54', textAlign: 'right' },
// // // // // // // // //   theirAuthorName: { color: '#E91E63', textAlign: 'left' },

// // // // // // // // //   mediaContainer: { position: 'relative' }, // מאפשר לכוכב "לצוף" על התמונה
// // // // // // // // //   postImage: { width: width * 0.75, height: 200, borderRadius: 8, marginTop: 5 },
  
// // // // // // // // //   starOverlay: { 
// // // // // // // // //     position: 'absolute', 
// // // // // // // // //     top: 10, 
// // // // // // // // //     right: 10, 
// // // // // // // // //     backgroundColor: 'rgba(255, 255, 255, 0.6)', 
// // // // // // // // //     borderRadius: 20, 
// // // // // // // // //     padding: 5,
// // // // // // // // //     shadowColor: "#000",
// // // // // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // // // // //     shadowOpacity: 0.3,
// // // // // // // // //     shadowRadius: 3,
// // // // // // // // //     elevation: 5
// // // // // // // // //   },
// // // // // // // // //   starEmoji: { fontSize: 24 },

// // // // // // // // //   textFooter: { paddingHorizontal: 8, paddingVertical: 4 },
// // // // // // // // //   description: { fontSize: 16, color: '#333', textAlign: 'right' },
// // // // // // // // //   timeText: { fontSize: 10, color: '#888', textAlign: 'left', marginTop: 2 },

// // // // // // // // //   emptyText: { textAlign: 'center', marginTop: 100, color: '#999' },
// // // // // // // // //   inputArea: { position: 'absolute', bottom: 20, width: '100%', paddingHorizontal: 15 },
// // // // // // // // //   fakeInput: { 
// // // // // // // // //     flexDirection: 'row-reverse', backgroundColor: '#fff', borderRadius: 25, 
// // // // // // // // //     height: 50, alignItems: 'center', paddingHorizontal: 15, elevation: 5 
// // // // // // // // //   },
// // // // // // // // //   plusIcon: { fontSize: 30, color: '#075E54', marginLeft: 12 },
// // // // // // // // //   placeholderText: { color: '#999', fontSize: 16, textAlign: 'right', flex: 1 }
// // // // // // // // // });

// // // // // // // // // export default GroupDetailsScreen;
// // // // // // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // // // // // import { 
// // // // // // // //   View, Text, FlatList, Image, StyleSheet, 
// // // // // // // //   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity, Animated, Easing, Alert 
// // // // // // // // } from 'react-native';
// // // // // // // // import { useFocusEffect } from '@react-navigation/native';
// // // // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // // // const { width } = Dimensions.get('window');

// // // // // // // // // --- רכיב הכוכב המנצנץ למסרים סודיים ---
// // // // // // // // const SparklingStar = ({ onExtract }: { onExtract: () => void }) => {
// // // // // // // //   const anim = useRef(new Animated.Value(0)).current;

// // // // // // // //   useEffect(() => {
// // // // // // // //     Animated.loop(
// // // // // // // //       Animated.sequence([
// // // // // // // //         Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
// // // // // // // //         Animated.timing(anim, { toValue: 0, duration: 800, useNativeDriver: true }),
// // // // // // // //       ])
// // // // // // // //     ).start();
// // // // // // // //   }, []);

// // // // // // // //   return (
// // // // // // // //     <TouchableOpacity onPress={onExtract} style={{ marginLeft: 8 }}>
// // // // // // // //       <Animated.Text style={{ fontSize: 20, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }] }}>
// // // // // // // //         ⭐
// // // // // // // //       </Animated.Text>
// // // // // // // //     </TouchableOpacity>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const GroupDetailScreen = ({ route, navigation }: any) => {
// // // // // // // //   const { groupId, groupName, userName } = route.params || {};
// // // // // // // //   const [posts, setPosts] = useState<any[]>([]);
// // // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // // //   const flatListRef = useRef<FlatList>(null);

// // // // // // // //   const fetchPosts = async () => {
// // // // // // // //     try {
// // // // // // // //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// // // // // // // //       const data = await response.json();
// // // // // // // //       setPosts(data);
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Error fetching posts:", error);
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   useFocusEffect(
// // // // // // // //     useCallback(() => {
// // // // // // // //       fetchPosts();
// // // // // // // //     }, [groupId])
// // // // // // // //   );

// // // // // // // //   const renderPost = ({ item }: { item: any }) => {
// // // // // // // //     const isMyPost = item.author === userName;

// // // // // // // //     return (
// // // // // // // //       <View style={[styles.messageWrapper, isMyPost ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
// // // // // // // //         <View style={[styles.bubble, isMyPost ? styles.myBubble : styles.theirBubble]}>
          
// // // // // // // //           <Text style={[styles.authorName, { color: isMyPost ? '#075E54' : '#E91E63', textAlign: 'right' }]}>
// // // // // // // //             {isMyPost ? "אני" : item.author}
// // // // // // // //           </Text>

// // // // // // // //           {item.imageUrl && (
// // // // // // // //             <Image source={{ uri: item.imageUrl }} style={styles.postImage} resizeMode="cover" />
// // // // // // // //           )}

// // // // // // // //           <View style={styles.contentRow}>
// // // // // // // //             {/* מציג כוכב רק אם יש מסר סודי בפוסט */}
// // // // // // // //             {item.secretMessage && (
// // // // // // // //               <SparklingStar onExtract={() => Alert.alert("הודעה סודית שחולצה", item.secretMessage)} />
// // // // // // // //             )}
// // // // // // // //             <Text style={styles.description}>{item.description}</Text>
// // // // // // // //           </View>

// // // // // // // //           <Text style={styles.timeText}>
// // // // // // // //             {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
// // // // // // // //           </Text>
// // // // // // // //         </View>
// // // // // // // //       </View>
// // // // // // // //     );
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <View style={styles.container}>
// // // // // // // //       {/* Header */}
// // // // // // // //       <View style={styles.header}>
// // // // // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // //           <Text style={styles.backArrow}>➔</Text>
// // // // // // // //         </TouchableOpacity>
// // // // // // // //         <Text style={styles.headerTitle}>{groupName}</Text>
// // // // // // // //       </View>

// // // // // // // //       {loading && posts.length === 0 ? (
// // // // // // // //         <ActivityIndicator size="large" color="#075E54" style={{ marginTop: 50 }} />
// // // // // // // //       ) : (
// // // // // // // //         <FlatList
// // // // // // // //           ref={flatListRef}
// // // // // // // //           data={posts}
// // // // // // // //           keyExtractor={(item) => item.id.toString()}
// // // // // // // //           renderItem={renderPost}
// // // // // // // //           contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
// // // // // // // //           onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
// // // // // // // //           refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
// // // // // // // //           ListEmptyComponent={<Text style={styles.emptyText}>אין הודעות בקבוצה עדיין</Text>}
// // // // // // // //         />
// // // // // // // //       )}

// // // // // // // //       {/* שורת קלט תחתונה (Fake Input) */}
// // // // // // // //       <View style={styles.inputContainer}>
// // // // // // // //         <TouchableOpacity 
// // // // // // // //           style={styles.fakeInput} 
// // // // // // // //           onPress={() => navigation.navigate('CreatePost', { 
// // // // // // // //             target: 'group', groupId, groupName, userName 
// // // // // // // //           })}
// // // // // // // //         >
// // // // // // // //           <Text style={styles.plusIcon}>+</Text>
// // // // // // // //           <Text style={styles.placeholderText}>כתוב הודעה או מסר סודי...</Text>
// // // // // // // //         </TouchableOpacity>
// // // // // // // //       </View>
// // // // // // // //     </View>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   container: { flex: 1, backgroundColor: '#E5DDD5' },
// // // // // // // //   header: { 
// // // // // // // //     height: 90, backgroundColor: '#075E54', flexDirection: 'row-reverse', 
// // // // // // // //     alignItems: 'center', paddingHorizontal: 15, paddingTop: 30 
// // // // // // // //   },
// // // // // // // //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
// // // // // // // //   backArrow: { color: '#fff', fontSize: 24 },
// // // // // // // //   messageWrapper: { flexDirection: 'row', marginBottom: 8, width: '100%' },
// // // // // // // //   bubble: { maxWidth: width * 0.8, padding: 8, borderRadius: 10, elevation: 1 },
// // // // // // // //   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
// // // // // // // //   theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },
// // // // // // // //   authorName: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
// // // // // // // //   postImage: { width: width * 0.73, height: 220, borderRadius: 8, marginBottom: 5 },
// // // // // // // //   contentRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'flex-start' },
// // // // // // // //   description: { fontSize: 16, color: '#333', textAlign: 'right', flexShrink: 1 },
// // // // // // // //   timeText: { fontSize: 10, color: '#888', textAlign: 'left', marginTop: 4 },
// // // // // // // //   emptyText: { textAlign: 'center', marginTop: 100, color: '#666' },
  
// // // // // // // //   inputContainer: { position: 'absolute', bottom: 15, width: '100%', paddingHorizontal: 10 },
// // // // // // // //   fakeInput: { 
// // // // // // // //     backgroundColor: '#fff', borderRadius: 25, height: 50, 
// // // // // // // //     flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15, elevation: 3 
// // // // // // // //   },
// // // // // // // //   plusIcon: { fontSize: 28, color: '#075E54', marginLeft: 10 },
// // // // // // // //   placeholderText: { color: '#999', fontSize: 16, textAlign: 'right', flex: 1 }
// // // // // // // // });

// // // // // // // // export default GroupDetailScreen;
// // // // // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // // // // import { 
// // // // // // //   View, Text, FlatList, Image, StyleSheet, 
// // // // // // //   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity, Alert 
// // // // // // // } from 'react-native';
// // // // // // // import { useFocusEffect } from '@react-navigation/native';
// // // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // // const { width } = Dimensions.get('window');

// // // // // // // const GroupDetailScreen = ({ route, navigation }: any) => {
// // // // // // //   const { groupId, groupName, userName } = route.params || {};
// // // // // // //   const [posts, setPosts] = useState<any[]>([]);
// // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // //   const flatListRef = useRef<FlatList>(null);

// // // // // // //   const fetchPosts = async () => {
// // // // // // //     try {
// // // // // // //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// // // // // // //       const data = await response.json();
      
// // // // // // //       // אם השרת מחזיר מהחדש לישן, נהפוך את המערך כדי שהחדש יהיה למטה
// // // // // // //       // setPosts(data.reverse()); 
      
// // // // // // //       // אם השרת כבר מחזיר מהישן לחדש (מומלץ), פשוט נשמור:
// // // // // // //       setPosts(data);
// // // // // // //     } catch (error) {
// // // // // // //       console.error("Error fetching posts:", error);
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   useFocusEffect(
// // // // // // //     useCallback(() => {
// // // // // // //       fetchPosts();
// // // // // // //     }, [groupId])
// // // // // // //   );

// // // // // // //   // פונקציה לעיצוב תאריך ושעה
// // // // // // //   const formatDateTime = (dateString: string) => {
// // // // // // //     if (!dateString) return '--:--';
// // // // // // //     const date = new Date(dateString);
// // // // // // //     const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // // // // // //     const day = date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
// // // // // // //     return `${time} | ${day}`;
// // // // // // //   };

// // // // // // //   const renderItem = ({ item }: { item: any }) => {
// // // // // // //     const isMyPost = item.author === userName;

// // // // // // //     return (
// // // // // // //       <View style={[styles.messageWrapper, isMyPost ? styles.myMessage : styles.theirMessage]}>
// // // // // // //         <View style={[styles.bubble, isMyPost ? styles.myBubble : styles.theirBubble]}>
// // // // // // //           <Text style={[styles.authorName, { color: isMyPost ? '#075E54' : '#E91E63' }]}>
// // // // // // //             {isMyPost ? "אני" : item.author}
// // // // // // //           </Text>

// // // // // // //           {item.imageUrl && (
// // // // // // //             <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
// // // // // // //           )}

// // // // // // //           <View style={styles.contentRow}>
// // // // // // //             {item.secretMessage && (
// // // // // // //               <TouchableOpacity onPress={() => Alert.alert("מסר סודי", item.secretMessage)}>
// // // // // // //                 <Text style={{ fontSize: 18, marginLeft: 5 }}>⭐</Text>
// // // // // // //               </TouchableOpacity>
// // // // // // //             )}
// // // // // // //             <Text style={styles.description}>{item.description}</Text>
// // // // // // //           </View>

// // // // // // //           {/* הצגת שעה ותאריך */}
// // // // // // //           <Text style={styles.timeText}>{formatDateTime(item.createdAt)}</Text>
// // // // // // //         </View>
// // // // // // //       </View>
// // // // // // //     );
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <View style={styles.container}>
// // // // // // //       <View style={styles.header}>
// // // // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // //           <Text style={styles.backBtn}>➜</Text>
// // // // // // //         </TouchableOpacity>
// // // // // // //         <Text style={styles.headerTitle}>{groupName}</Text>
// // // // // // //       </View>

// // // // // // //       <FlatList
// // // // // // //         ref={flatListRef}
// // // // // // //         data={posts}
// // // // // // //         keyExtractor={(item) => item.id.toString()}
// // // // // // //         renderItem={renderItem}
// // // // // // //         contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
        
// // // // // // //         // גורם לרשימה לקפוץ לסוף כשהיא נטענת (כמו וואטסאפ)
// // // // // // //         onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
// // // // // // //         onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        
// // // // // // //         refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
// // // // // // //         ListEmptyComponent={<Text style={styles.emptyText}>אין הודעות בקבוצה</Text>}
// // // // // // //       />

// // // // // // //       <View style={styles.footer}>
// // // // // // //         <TouchableOpacity 
// // // // // // //           style={styles.inputBar} 
// // // // // // //           onPress={() => navigation.navigate('CreatePost', { target: 'group', groupId, groupName, userName })}
// // // // // // //         >
// // // // // // //           <Text style={styles.plusIcon}>+</Text>
// // // // // // //           <Text style={styles.inputText}>הקלד הודעה...</Text>
// // // // // // //         </TouchableOpacity>
// // // // // // //       </View>
// // // // // // //     </View>
// // // // // // //   );
// // // // // // // };

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   container: { flex: 1, backgroundColor: '#E5DDD5' },
// // // // // // //   header: { height: 90, backgroundColor: '#075E54', flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15, paddingTop: 30 },
// // // // // // //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
// // // // // // //   backBtn: { color: '#fff', fontSize: 24 },
// // // // // // //   messageWrapper: { flexDirection: 'row', marginBottom: 8, width: '100%' },
// // // // // // //   myMessage: { justifyContent: 'flex-end' },
// // // // // // //   theirMessage: { justifyContent: 'flex-start' },
// // // // // // //   bubble: { maxWidth: width * 0.8, padding: 8, borderRadius: 10, elevation: 1 },
// // // // // // //   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
// // // // // // //   theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },
// // // // // // //   authorName: { fontSize: 12, fontWeight: 'bold', marginBottom: 2, textAlign: 'right' },
// // // // // // //   postImage: { width: width * 0.73, height: 220, borderRadius: 8, marginBottom: 5 },
// // // // // // //   contentRow: { flexDirection: 'row-reverse', alignItems: 'center' },
// // // // // // //   description: { fontSize: 16, color: '#333', textAlign: 'right', flexShrink: 1 },
// // // // // // //   timeText: { fontSize: 10, color: '#888', textAlign: 'left', marginTop: 4 },
// // // // // // //   emptyText: { textAlign: 'center', marginTop: 100 },
// // // // // // //   footer: { position: 'absolute', bottom: 15, width: '100%', paddingHorizontal: 10 },
// // // // // // //   inputBar: { backgroundColor: '#fff', borderRadius: 25, height: 50, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15, elevation: 3 },
// // // // // // //   plusIcon: { fontSize: 28, color: '#075E54', marginLeft: 10 },
// // // // // // //   inputText: { color: '#999', fontSize: 16, textAlign: 'right', flex: 1 }
// // // // // // // });

// // // // // // // export default GroupDetailScreen;
// // // // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // // // import { 
// // // // // //   View, Text, FlatList, Image, StyleSheet, 
// // // // // //   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity, Alert 
// // // // // // } from 'react-native';
// // // // // // import { useFocusEffect } from '@react-navigation/native';
// // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // const { width } = Dimensions.get('window');

// // // // // // const GroupDetailScreen = ({ route, navigation }: any) => {
// // // // // //   const { groupId, groupName, userName } = route.params || {};
// // // // // //   const [posts, setPosts] = useState<any[]>([]);
// // // // // //   const [loading, setLoading] = useState(true);
  
// // // // // //   // Ref עבור הרשימה כדי שנוכל לשלוט בגלילה
// // // // // //   const flatListRef = useRef<FlatList>(null);

// // // // // //   const fetchPosts = async () => {
// // // // // //     try {
// // // // // //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// // // // // //       const data = await response.json();
      
// // // // // //       // כאן חשוב: השרת צריך להחזיר מהישן לחדש. 
// // // // // //       // אם הוא מחזיר מהחדש לישן, תוריד את ה-comment מהשורה הבאה:
// // // // // //       // const sortedData = data.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
// // // // // //       setPosts(data);
// // // // // //     } catch (error) {
// // // // // //       console.error("Error fetching posts:", error);
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   useFocusEffect(
// // // // // //     useCallback(() => {
// // // // // //       fetchPosts();
// // // // // //     }, [groupId])
// // // // // //   );

// // // // // //   const formatDateTime = (dateString: string) => {
// // // // // //     if (!dateString) return '--:--';
// // // // // //     const date = new Date(dateString);
// // // // // //     const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // // // // //     const day = date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
// // // // // //     return `${time} | ${day}`;
// // // // // //   };

// // // // // //   const renderItem = ({ item }: { item: any }) => {
// // // // // //     const isMyPost = item.author === userName;

// // // // // //     return (
// // // // // //       <View style={[styles.messageWrapper, isMyPost ? styles.myMessage : styles.theirMessage]}>
// // // // // //         <View style={[styles.bubble, isMyPost ? styles.myBubble : styles.theirBubble]}>
// // // // // //           <Text style={[styles.authorName, { color: isMyPost ? '#075E54' : '#E91E63' }]}>
// // // // // //             {isMyPost ? "אני" : item.author}
// // // // // //           </Text>

// // // // // //           {item.imageUrl && (
// // // // // //             <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
// // // // // //           )}

// // // // // //           <View style={styles.contentRow}>
// // // // // //             {item.secretMessage && (
// // // // // //               <TouchableOpacity onPress={() => Alert.alert("מסר סודי", item.secretMessage)}>
// // // // // //                 <Text style={{ fontSize: 18, marginLeft: 5 }}>⭐</Text>
// // // // // //               </TouchableOpacity>
// // // // // //             )}
// // // // // //             <Text style={styles.description}>{item.description}</Text>
// // // // // //           </View>

// // // // // //           <Text style={styles.timeText}>{formatDateTime(item.createdAt)}</Text>
// // // // // //         </View>
// // // // // //       </View>
// // // // // //     );
// // // // // //   };

// // // // // //   return (
// // // // // //     <View style={styles.container}>
// // // // // //       {/* Header */}
// // // // // //       <View style={styles.header}>
// // // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // //           <Text style={styles.backBtn}>➔</Text>
// // // // // //         </TouchableOpacity>
// // // // // //         <Text style={styles.headerTitle}>{groupName}</Text>
// // // // // //       </View>

// // // // // //       <FlatList
// // // // // //         ref={flatListRef}
// // // // // //         data={posts}
// // // // // //         keyExtractor={(item) => item.id.toString()}
// // // // // //         renderItem={renderItem}
// // // // // //         contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
        
// // // // // //         // --- הקסם קורה כאן ---
// // // // // //         // ברגע שהתוכן נטען או משתנה, אנחנו גוללים לסוף (animated: false כדי שזה יקרה מייד בטעינה)
// // // // // //         onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
// // // // // //         onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        
// // // // // //         refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
// // // // // //         ListEmptyComponent={!loading ? <Text style={styles.emptyText}>אין הודעות בקבוצה</Text> : null}
// // // // // //       />

// // // // // //       {/* Input Bar */}
// // // // // //       <View style={styles.footer}>
// // // // // //         <TouchableOpacity 
// // // // // //           style={styles.inputBar} 
// // // // // //           onPress={() => navigation.navigate('CreatePost', { target: 'group', groupId, groupName, userName })}
// // // // // //         >
// // // // // //           <Text style={styles.plusIcon}>+</Text>
// // // // // //           <Text style={styles.inputText}>הקלד הודעה...</Text>
// // // // // //         </TouchableOpacity>
// // // // // //       </View>
// // // // // //     </View>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: { flex: 1, backgroundColor: '#E5DDD5' },
// // // // // //   header: { height: 90, backgroundColor: '#075E54', flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15, paddingTop: 30 },
// // // // // //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
// // // // // //   backBtn: { color: '#fff', fontSize: 24, transform: [{ scaleX: -1 }] }, // היפוך חץ לשמאל
// // // // // //   messageWrapper: { flexDirection: 'row', marginBottom: 8, width: '100%' },
// // // // // //   myMessage: { justifyContent: 'flex-end' },
// // // // // //   theirMessage: { justifyContent: 'flex-start' },
// // // // // //   bubble: { maxWidth: width * 0.8, padding: 8, borderRadius: 10, elevation: 1 },
// // // // // //   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
// // // // // //   theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },
// // // // // //   authorName: { fontSize: 12, fontWeight: 'bold', marginBottom: 2, textAlign: 'right' },
// // // // // //   postImage: { width: width * 0.73, height: 220, borderRadius: 8, marginBottom: 5 },
// // // // // //   contentRow: { flexDirection: 'row-reverse', alignItems: 'center' },
// // // // // //   description: { fontSize: 16, color: '#333', textAlign: 'right', flexShrink: 1 },
// // // // // //   timeText: { fontSize: 10, color: '#888', textAlign: 'left', marginTop: 4 },
// // // // // //   emptyText: { textAlign: 'center', marginTop: 100, color: '#666' },
// // // // // //   footer: { position: 'absolute', bottom: 15, width: '100%', paddingHorizontal: 10 },
// // // // // //   inputBar: { backgroundColor: '#fff', borderRadius: 25, height: 50, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15, elevation: 3 },
// // // // // //   plusIcon: { fontSize: 28, color: '#075E54', marginLeft: 10 },
// // // // // //   inputText: { color: '#999', fontSize: 16, textAlign: 'right', flex: 1 }
// // // // // // });

// // // // // // export default GroupDetailScreen;
// // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // import { 
// // // // //   View, Text, FlatList, Image, StyleSheet, 
// // // // //   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity, Alert 
// // // // // } from 'react-native';
// // // // // import { useFocusEffect } from '@react-navigation/native';
// // // // // import { BASE_URL } from '../api/Constants';

// // // // // const { width } = Dimensions.get('window');

// // // // // const GroupDetailScreen = ({ route, navigation }: any) => {
// // // // //   const { groupId, groupName, userName } = route.params || {};
// // // // //   const [posts, setPosts] = useState<any[]>([]);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   console.log("HELLO TEST");
// // // // // console.log("Current User:", userName);
// // // // //   const fetchPosts = async () => {
// // // // //     try {
// // // // //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// // // // //       const data = await response.json();
      
// // // // //       // בגלל שאנחנו משתמשים ב-inverted, אנחנו צריכים שהמערך יהיה מסודר מהחדש לישן
// // // // //       // אם השרת שלך מחזיר ישן-חדש, נעשה reverse:
// // // // //       const sortedData = data.sort((a: any, b: any) => 
// // // // //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
// // // // //       );
      
// // // // //       setPosts(sortedData);
// // // // //     } catch (error) {
// // // // //       console.error("Error fetching posts:", error);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   useFocusEffect(
// // // // //     useCallback(() => {
// // // // //       fetchPosts();
// // // // //     }, [groupId])
// // // // //   );

// // // // //   const formatDateTime = (dateString: string) => {
// // // // //     if (!dateString) return '--:--';
// // // // //     const date = new Date(dateString);
// // // // //     const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // // // //     const day = date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
// // // // //     return `${time} | ${day}`;
// // // // //   };

// // // // //   const renderItem = ({ item }: { item: any }) => {
// // // // //     const isMyPost = item.author === userName;

// // // // //     return (
// // // // //       // בגלל ה-inverted, אנחנו לא צריכים לשנות כלום בעיצוב, ה-FlatList הופך הכל לבד
// // // // //       <View style={[styles.messageWrapper, isMyPost ? styles.myMessage : styles.theirMessage]}>
// // // // //         <View style={[styles.bubble, isMyPost ? styles.myBubble : styles.theirBubble]}>
// // // // //           <Text style={[styles.authorName, { color: isMyPost ? '#075E54' : '#E91E63' }]}>
// // // // //             {isMyPost ? "אני" : item.author}
// // // // //           </Text>

// // // // //           {item.imageUrl && (
// // // // //             <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
// // // // //           )}

// // // // //           <View style={styles.contentRow}>
// // // // //             {item.secretMessage && (
// // // // //               <TouchableOpacity onPress={() => Alert.alert("מסר סודי", item.secretMessage)}>
// // // // //                 <Text style={{ fontSize: 18, marginLeft: 5 }}>⭐</Text>
// // // // //               </TouchableOpacity>
// // // // //             )}
// // // // //             <Text style={styles.description}>{item.description}</Text>
// // // // //           </View>

// // // // //           <Text style={styles.timeText}>{formatDateTime(item.createdAt)}</Text>
// // // // //         </View>
// // // // //       </View>
// // // // //     );
// // // // //   };

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       <View style={styles.header}>
// // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // //           <Text style={styles.backBtn}>➔</Text>
// // // // //         </TouchableOpacity>
// // // // //         <Text style={styles.headerTitle}>{groupName}</Text>
// // // // //       </View>

// // // // //       <FlatList
// // // // //         data={posts}
// // // // //         keyExtractor={(item) => item.id.toString()}
// // // // //         renderItem={renderItem}
// // // // //         contentContainerStyle={{ padding: 10 }}
        
// // // // //         // --- זה התיקון הקריטי ---
// // // // //         inverted={true} 
// // // // //         // -----------------------

// // // // //         refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
// // // // //         ListEmptyComponent={!loading ? (
// // // // //             // בגלל ה-inverted, ה-EmptyComponent יופיע למטה, אז נהפוך גם אותו (אופציונלי)
// // // // //             <View style={{ transform: [{ scaleY: -1 }] }}>
// // // // //                 <Text style={styles.emptyText}>אין הודעות בקבוצה</Text>
// // // // //             </View>
// // // // //         ) : null}
// // // // //       />

// // // // //       <View style={styles.footer}>
// // // // //         <TouchableOpacity 
// // // // //           style={styles.inputBar} 
// // // // //           onPress={() => navigation.navigate('CreatePost', { target: 'group', groupId, groupName, userName })}
// // // // //         >
// // // // //           <Text style={styles.plusIcon}>+</Text>
// // // // //           <Text style={styles.inputText}>הקלד הודעה...</Text>
// // // // //         </TouchableOpacity>
// // // // //       </View>
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: { flex: 1, backgroundColor: '#E5DDD5' },
// // // // //   header: { height: 90, backgroundColor: '#075E54', flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15, paddingTop: 30 },
// // // // //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
// // // // //   backBtn: { color: '#fff', fontSize: 24, transform: [{ scaleX: -1 }] },
// // // // //   messageWrapper: { flexDirection: 'row', marginBottom: 8, width: '100%' },
// // // // //   myMessage: { justifyContent: 'flex-end' },
// // // // //   theirMessage: { justifyContent: 'flex-start' },
// // // // //   bubble: { maxWidth: width * 0.8, padding: 8, borderRadius: 10, elevation: 1 },
// // // // //   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
// // // // //   theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },
// // // // //   authorName: { fontSize: 12, fontWeight: 'bold', marginBottom: 2, textAlign: 'right' },
// // // // //   postImage: { width: width * 0.73, height: 220, borderRadius: 8, marginBottom: 5 },
// // // // //   contentRow: { flexDirection: 'row-reverse', alignItems: 'center' },
// // // // //   description: { fontSize: 16, color: '#333', textAlign: 'right', flexShrink: 1 },
// // // // //   timeText: { fontSize: 10, color: '#888', textAlign: 'left', marginTop: 4 },
// // // // //   emptyText: { textAlign: 'center', marginTop: 100, color: '#666' },
// // // // //   footer: { position: 'absolute', bottom: 15, width: '100%', paddingHorizontal: 10 },
// // // // //   inputBar: { backgroundColor: '#fff', borderRadius: 25, height: 50, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15, elevation: 3 },
// // // // //   plusIcon: { fontSize: 28, color: '#075E54', marginLeft: 10 },
// // // // //   inputText: { color: '#999', fontSize: 16, textAlign: 'right', flex: 1 }
// // // // // });

// // // // // export default GroupDetailScreen;
// // // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // // import { 
// // // // //   View, Text, FlatList, Image, StyleSheet, 
// // // // //   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity, Alert, Animated 
// // // // // } from 'react-native';
// // // // // import { useFocusEffect } from '@react-navigation/native';
// // // // // import { BASE_URL } from '../api/Constants';

// // // // // const { width } = Dimensions.get('window');

// // // // // const GroupDetailScreen = ({ route, navigation }: any) => {
// // // // //   const { groupId, groupName, userName } = route.params || {};
// // // // //   const [posts, setPosts] = useState<any[]>([]);
// // // // //   const [loading, setLoading] = useState(true);

// // // // //   const fetchPosts = async () => {
// // // // //     try {
// // // // //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// // // // //       const data = await response.json();
// // // // //       const sortedData = data.sort((a: any, b: any) => 
// // // // //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
// // // // //       );
// // // // //       setPosts(sortedData);
// // // // //     } catch (error) {
// // // // //       console.error("Error fetching posts:", error);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   useFocusEffect(useCallback(() => { fetchPosts(); }, [groupId]));

// // // // //   const renderItem = ({ item }: { item: any }) => {
// // // // //     const isMyPost = item.author === userName;
    
// // // // //     // --- לוגיקת בדיקה עם הדפסות מאסיביות ---
// // // // //     let messageForMe = null;

// // // // //     console.log("-----------------------------------------");
// // // // //     console.log(`🧐 בודק פוסט של: ${item.author} (ID: ${item.id})`);
// // // // //     console.log(`👤 משתמש נוכחי באפליקציה: "${userName}"`);

// // // // //     if (item.userMessagesJson) {
// // // // //       try {
// // // // //         const parsed = JSON.parse(item.userMessagesJson);
// // // // //         const keys = Object.keys(parsed);
        
// // // // //         console.log(`📦 תוכן ה-JSON שנמצא:`, parsed);
// // // // //         console.log(`🔑 שמות (Keys) בתוך ה-JSON:`, keys);

// // // // //         // חיפוש התאמה
// // // // //         const matchKey = keys.find(key => 
// // // // //           key.trim().toLowerCase() === userName?.trim().toLowerCase()
// // // // //         );

// // // // //         if (matchKey) {
// // // // //           messageForMe = parsed[matchKey];
// // // // //           console.log(`✅✅✅ מצאתי התאמה! כוכב אמור להופיע עכשיו. מסר: ${messageForMe}`);
// // // // //         } else {
// // // // //           console.log(`❌ לא נמצאה התאמה. השם "${userName}" לא מופיע ברשימת המפתחות.`);
// // // // //         }
// // // // //       } catch (e) {
// // // // //         console.log(`⚠️ שגיאה: השדה userMessagesJson קיים אבל הוא לא JSON תקין. ערך:`, item.userMessagesJson);
// // // // //       }
// // // // //     } else {
// // // // //       console.log(`⚪ לפוסט הזה אין בכלל הודעות סודיות (userMessagesJson ריק)`);
// // // // //     }
// // // // //     console.log("-----------------------------------------");

// // // // //     return (
// // // // //       <View style={[styles.messageWrapper, isMyPost ? styles.myMessage : styles.theirMessage]}>
// // // // //         <View style={[styles.bubble, isMyPost ? styles.myBubble : styles.theirBubble]}>
// // // // //           <Text style={[styles.authorName, { color: isMyPost ? '#075E54' : '#E91E63' }]}>
// // // // //             {isMyPost ? "אני" : item.author}
// // // // //           </Text>

// // // // //           {item.imageUrl && (
// // // // //             <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
// // // // //           )}

// // // // //           <View style={styles.contentRow}>
// // // // //             {/* הצגת הכוכב - הוספתי לו צבע רקע אדום זמני כדי שנדע אם הוא שם ופשוט קטן מדי */}
// // // // //             {messageForMe && (
// // // // //               <TouchableOpacity 
// // // // //                 style={[styles.starTouch, { backgroundColor: 'red' }]} 
// // // // //                 onPress={() => Alert.alert("✨ מסר סודי ✨", messageForMe)}
// // // // //               >
// // // // //                 <Text style={{ fontSize: 30 }}>⭐</Text>
// // // // //               </TouchableOpacity>
// // // // //             )}
// // // // //             <Text style={styles.description}>{item.description}</Text>
// // // // //           </View>

// // // // //           <Text style={styles.timeText}>
// // // // //             {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
// // // // //           </Text>
// // // // //         </View>
// // // // //       </View>
// // // // //     );
// // // // //   };
// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       <View style={styles.header}>
// // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // //           <Text style={styles.backBtn}>➔</Text>
// // // // //         </TouchableOpacity>
// // // // //         <Text style={styles.headerTitle}>{groupName}</Text>
// // // // //       </View>

// // // // //       <FlatList
// // // // //         data={posts}
// // // // //         keyExtractor={(item) => item.id.toString()}
// // // // //         renderItem={renderItem}
// // // // //         inverted={true} 
// // // // //         contentContainerStyle={{ padding: 10 }}
// // // // //         refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
// // // // //       />

// // // // //       <View style={styles.footer}>
// // // // //         <TouchableOpacity 
// // // // //           style={styles.inputBar} 
// // // // //           onPress={() => navigation.navigate('CreatePost', { target: 'group', groupId, groupName, userName })}
// // // // //         >
// // // // //           <Text style={styles.plusIcon}>+</Text>
// // // // //           <Text style={styles.inputText}>הקלד הודעה...</Text>
// // // // //         </TouchableOpacity>
// // // // //       </View>
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: { flex: 1, backgroundColor: '#E5DDD5' },
// // // // //   header: { height: 90, backgroundColor: '#075E54', flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15, paddingTop: 30 },
// // // // //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
// // // // //   backBtn: { color: '#fff', fontSize: 24, transform: [{ scaleX: -1 }] },
// // // // //   messageWrapper: { flexDirection: 'row', marginBottom: 8, width: '100%' },
// // // // //   myMessage: { justifyContent: 'flex-end' },
// // // // //   theirMessage: { justifyContent: 'flex-start' },
// // // // //   bubble: { maxWidth: width * 0.8, padding: 8, borderRadius: 10, elevation: 1 },
// // // // //   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
// // // // //   theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },
// // // // //   authorName: { fontSize: 12, fontWeight: 'bold', marginBottom: 2, textAlign: 'right' },
// // // // //   postImage: { width: width * 0.73, height: 220, borderRadius: 8, marginBottom: 5 },
  
// // // // //   // הגדרת הסטייל שהייתה חסרה לך:
// // // // //   contentRow: { 
// // // // //     flexDirection: 'row-reverse', 
// // // // //     alignItems: 'center', 
// // // // //     justifyContent: 'flex-start',
// // // // //     width: '100%'
// // // // //   },
// // // // //   starTouch: {
// // // // //     marginLeft: 10,
// // // // //     padding: 5,
// // // // //     backgroundColor: 'rgba(255, 215, 0, 0.2)',
// // // // //     borderRadius: 50
// // // // //   },
  
// // // // //   description: { fontSize: 16, color: '#333', textAlign: 'right', flexShrink: 1 },
// // // // //   timeText: { fontSize: 10, color: '#888', textAlign: 'left', marginTop: 4 },
// // // // //   footer: { position: 'absolute', bottom: 15, width: '100%', paddingHorizontal: 10 },
// // // // //   inputBar: { backgroundColor: '#fff', borderRadius: 25, height: 50, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15, elevation: 3 },
// // // // //   plusIcon: { fontSize: 28, color: '#075E54', marginLeft: 10 },
// // // // //   inputText: { color: '#999', fontSize: 16, textAlign: 'right', flex: 1 }
// // // // // });

// // // // // export default GroupDetailScreen;

// // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // import { 
// // // //   View, Text, FlatList, Image, StyleSheet, 
// // // //   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity, Alert, Animated 
// // // // } from 'react-native';
// // // // import { useFocusEffect } from '@react-navigation/native';
// // // // import { BASE_URL } from '../api/Constants';

// // // // const { width } = Dimensions.get('window');

// // // // const GroupDetailScreen = ({ route, navigation }: any) => {
// // // //   const { groupId, groupName, userName } = route.params || {};
// // // //   const [posts, setPosts] = useState<any[]>([]);
// // // //   const [loading, setLoading] = useState(true);

// // // //   const fetchPosts = async () => {
// // // //     console.log("--- מנסה למשוך נתונים מהשרת עבור קבוצה:", groupId);
// // // //     try {
// // // //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// // // //       const data = await response.json();
      
// // // //       // הדפסה קריטית - כאן נראה אם בכלל יש userMessagesJson
// // // //       console.log("--- הנתונים שהגיעו מהשרת: ---");
// // // //       console.log(JSON.stringify(data, null, 2)); 
      
// // // //       const sortedData = data.sort((a: any, b: any) => 
// // // //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
// // // //       );
// // // //       setPosts(sortedData);
// // // //     } catch (error) {
// // // //       console.error("❌ שגיאה במשיכת נתונים:", error);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   useFocusEffect(useCallback(() => { fetchPosts(); }, [groupId]));

// // // //   const renderItem = ({ item }: { item: any }) => {
// // // //   const isMyPost = item.author === userName;
  
// // // //   // 1. השרת שולח Map<String, String>, ב-JS זה אובייקט רגיל
// // // //   // 2. השם ב-Java הוא userMessages, אז זה השם שנחפש ב-item
// // // //   const messages = item.userMessages || {}; 
  
// // // //   // 3. חיפוש המסר עבור המשתמש הנוכחי (oooo)
// // // //   const mySecretMessage = messages[userName];

// // // //   // הדפסה לטרמינל כדי שתוכל לראות שזה עובד
// // // //   if (mySecretMessage) {
// // // //     console.log(`🌟 נמצא מסר ל-${userName}: ${mySecretMessage}`);
// // // //   }

// // // //   return (
// // // //     <View style={[styles.messageWrapper, isMyPost ? styles.myMessage : styles.theirMessage]}>
// // // //       <View style={[styles.bubble, isMyPost ? styles.myBubble : styles.theirBubble]}>
        
// // // //         <Text style={[styles.authorName, { color: isMyPost ? '#075E54' : '#E91E63' }]}>
// // // //           {isMyPost ? "אני" : item.author}
// // // //         </Text>

// // // //         {item.imageUrl && (
// // // //           <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
// // // //         )}

// // // //         <View style={styles.contentRow}>
// // // //           {/* הכוכב יופיע רק אם יש ערך בתוך mySecretMessage */}
// // // //           {mySecretMessage ? (
// // // //             <TouchableOpacity 
// // // //               style={styles.starTouch} 
// // // //               onPress={() => Alert.alert("✨ מסר סודי ✨", mySecretMessage)}
// // // //             >
// // // //               <Text style={{ fontSize: 24 }}>⭐</Text>
// // // //             </TouchableOpacity>
// // // //           ) : null}

// // // //           <Text style={styles.description}>{item.description}</Text>
// // // //         </View>

// // // //         <Text style={styles.timeText}>
// // // //           {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
// // // //         </Text>
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // };
// // // //   return (
// // // //     <View style={styles.container}>
// // // //       <View style={styles.header}>
// // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // //           <Text style={styles.backBtn}>➔</Text>
// // // //         </TouchableOpacity>
// // // //         <Text style={styles.headerTitle}>{groupName}</Text>
// // // //       </View>

// // // //       <FlatList
// // // //         data={posts}
// // // //         keyExtractor={(item) => item.id.toString()}
// // // //         renderItem={renderItem}
// // // //         inverted={true} 
// // // //         contentContainerStyle={{ padding: 10 }}
// // // //         refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
// // // //       />

// // // //       <View style={styles.footer}>
// // // //         <TouchableOpacity 
// // // //           style={styles.inputBar} 
// // // //           onPress={() => navigation.navigate('CreatePost', { target: 'group', groupId, groupName, userName })}
// // // //         >
// // // //           <Text style={styles.plusIcon}>+</Text>
// // // //           <Text style={styles.inputText}>הקלד הודעה...</Text>
// // // //         </TouchableOpacity>
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: { flex: 1, backgroundColor: '#E5DDD5' },
// // // //   header: { height: 90, backgroundColor: '#075E54', flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15, paddingTop: 30 },
// // // //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
// // // //   backBtn: { color: '#fff', fontSize: 24, transform: [{ scaleX: -1 }] },
// // // //   messageWrapper: { flexDirection: 'row', marginBottom: 8, width: '100%' },
// // // //   myMessage: { justifyContent: 'flex-end' },
// // // //   theirMessage: { justifyContent: 'flex-start' },
// // // //   bubble: { maxWidth: width * 0.8, padding: 8, borderRadius: 10, elevation: 1 },
// // // //   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
// // // //   theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },
// // // //   authorName: { fontSize: 12, fontWeight: 'bold', marginBottom: 2, textAlign: 'right' },
// // // //   postImage: { width: width * 0.73, height: 220, borderRadius: 8, marginBottom: 5 },
  
// // // //   // הגדרת הסטייל שהייתה חסרה לך:
// // // //   contentRow: { 
// // // //     flexDirection: 'row-reverse', 
// // // //     alignItems: 'center', 
// // // //     justifyContent: 'flex-start',
// // // //     width: '100%'
// // // //   },
// // // //   starTouch: {
// // // //     marginLeft: 10,
// // // //     padding: 5,
// // // //     backgroundColor: 'rgba(255, 215, 0, 0.2)',
// // // //     borderRadius: 50
// // // //   },
  
// // // //   description: { fontSize: 16, color: '#333', textAlign: 'right', flexShrink: 1 },
// // // //   timeText: { fontSize: 10, color: '#888', textAlign: 'left', marginTop: 4 },
// // // //   footer: { position: 'absolute', bottom: 15, width: '100%', paddingHorizontal: 10 },
// // // //   inputBar: { backgroundColor: '#fff', borderRadius: 25, height: 50, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15, elevation: 3 },
// // // //   plusIcon: { fontSize: 28, color: '#075E54', marginLeft: 10 },
// // // //   inputText: { color: '#999', fontSize: 16, textAlign: 'right', flex: 1 }
// // // // });

// // // // export default GroupDetailScreen;
// // // import React, { useState, useEffect, useCallback } from 'react';
// // // import { 
// // //   View, Text, FlatList, Image, StyleSheet, 
// // //   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity,
// // //   SafeAreaView, StatusBar
// // // } from 'react-native';
// // // import { useFocusEffect } from '@react-navigation/native';
// // // import { BASE_URL } from '../api/Constants';

// // // const { width } = Dimensions.get('window');

// // // const GroupDetailsScreen = ({ route, navigation }: any) => {
// // //   // קבלת נתונים מהניווט
// // //   const { groupId, groupName, userName } = route.params;
// // //   const [posts, setPosts] = useState<any[]>([]);
// // //   const [loading, setLoading] = useState(true);

// // //   // שליפת הפוסטים מהשרת
// // //   const fetchPosts = async () => {
// // //     try {
// // //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// // //       const data = await response.json();
// // //       // השרת מחזיר רשימה, נשמור אותה ב-State
// // //       setPosts(Array.isArray(data) ? data : []);
// // //     } catch (error) {
// // //       console.error("Error fetching posts:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // רענון הנתונים בכל פעם שהמסך חוזר לפוקוס
// // //   useFocusEffect(
// // //     useCallback(() => {
// // //       fetchPosts();
// // //     }, [groupId])
// // //   );

// // //   const renderPost = ({ item }: { item: any }) => {
// // //     const isMyPost = item.author === userName;
    
// // //     return (
// // //       <View style={styles.messageContainer}>
// // //         {/* לחיצה על כל הבועה מעבירה למסך פרטי פוסט ותגובות */}
// // //         <TouchableOpacity 
// // //           activeOpacity={0.9}
// // //           onPress={() => navigation.navigate('PostDetails', { 
// // //             post: item, 
// // //             userName: userName 
// // //           })}
// // //           style={styles.bubbleWrapper}
// // //         >
// // //           <View style={[styles.bubble, isMyPost ? styles.myBubble : styles.theirBubble]}>
            
// // //             {/* שם המפרסם - צבעוני להפרדה ויזואלית */}
// // //             <Text style={[styles.authorName, { color: isMyPost ? '#075E54' : '#E91E63' }]}>
// // //               {isMyPost ? "אני" : item.author}
// // //             </Text>

// // //             {/* תצוגת תמונה אם קיימת בפוסט */}
// // //             {item.imageUrl && (
// // //               <Image source={{ uri: item.imageUrl }} style={styles.postImage} resizeMode="cover" />
// // //             )}

// // //             <View style={styles.textAndInfo}>
// // //               {/* הצגת תיאור הפוסט - מוגבל ל-4 שורות בפיד הכללי */}
// // //               <Text style={styles.description} numberOfLines={4}>
// // //                 {item.description}
// // //               </Text>
              
// // //               <View style={styles.timeContainer}>
// // //                 <Text style={styles.timeText}>
// // //                   {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
// // //                 </Text>
// // //                 {isMyPost && <Text style={styles.ticks}> ✔️✔️</Text>}
// // //               </View>
// // //             </View>

// // //             {/* כפתור עדין שמסמן שיש עוד תוכן ותגובות בפנים */}
// // //             <View style={styles.commentBar}>
// // //                <Text style={styles.commentBarText}>לחץ לצפייה בתגובות 💬</Text>
// // //             </View>
// // //           </View>
// // //         </TouchableOpacity>
// // //       </View>
// // //     );
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <StatusBar barStyle="light-content" backgroundColor="#075E54" />
      
// // //       {/* Header - כותרת הקבוצה */}
// // //       <View style={styles.header}>
// // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
// // //           <Text style={styles.backBtnText}>➜</Text>
// // //         </TouchableOpacity>
        
// // //         <View style={styles.headerInfo}>
// // //           <Text style={styles.headerTitle}>{groupName}</Text>
// // //           <Text style={styles.headerSubtitle}>{posts.length} פוסטים בערוץ</Text>
// // //         </View>

// // //         <View style={styles.headerAvatar}>
// // //            <Text style={{fontSize: 20}}>👥</Text>
// // //         </View>
// // //       </View>

// // //       {/* רשימת הפוסטים */}
// // //       <FlatList
// // //         data={posts}
// // //         keyExtractor={(item) => item.id.toString()}
// // //         renderItem={renderPost}
// // //         contentContainerStyle={styles.listContent}
// // //         refreshControl={
// // //           <RefreshControl refreshing={loading} onRefresh={fetchPosts}  />
// // //         }
// // //         ListEmptyComponent={!loading ? <Text style={styles.emptyText}>אין עדיין הודעות בקבוצה זו...</Text> : null}
// // //       />

// // //       {/* שורת קלט תחתונה קבועה (סגנון וואטסאפ) */}
// // //       <View style={styles.footer}>
// // //         <View style={styles.micCircle}>
// // //            <Text style={styles.micIcon}>🎙️</Text>
// // //         </View>
        
// // //         <TouchableOpacity 
// // //           style={styles.inputBar} 
// // //           onPress={() => navigation.navigate('CreatePost', { 
// // //             target: 'group', 
// // //             groupId, 
// // //             groupName, 
// // //             userName 
// // //           })}
// // //         >
// // //           <Text style={styles.cameraIcon}>📷</Text>
// // //           <Text style={styles.inputText}>הוסף פוסט או מסר סודי...</Text>
// // //           <Text style={styles.plusIcon}>+</Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#E5DDD5' }, // רקע Doodle של וואטסאפ
  
// // //   // Header
// // //   header: { 
// // //     height: 65, 
// // //     backgroundColor: '#075E54', 
// // //     flexDirection: 'row-reverse', 
// // //     alignItems: 'center', 
// // //     paddingHorizontal: 15,
// // //     elevation: 4,
// // //     shadowColor: '#000',
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 5
// // //   },
// // //   headerInfo: { flex: 1, marginRight: 15 },
// // //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'right' },
// // //   headerSubtitle: { color: '#A0D3C1', fontSize: 12, textAlign: 'right' },
// // //   headerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#128C7E', justifyContent: 'center', alignItems: 'center' },
// // //   backBtn: { padding: 5 },
// // //   backBtnText: { color: '#fff', fontSize: 24 },

// // //   // List
// // //   listContent: { paddingHorizontal: 10, paddingVertical: 15, paddingBottom: 100 },
// // //   messageContainer: { marginBottom: 15, width: '100%', alignItems: 'flex-end' },
// // //   bubbleWrapper: { maxWidth: '88%' },
  
// // //   // Bubble
// // //   bubble: { 
// // //     padding: 6, 
// // //     borderRadius: 12, 
// // //     backgroundColor: '#fff',
// // //     elevation: 2,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.15,
// // //     shadowRadius: 2,
// // //   },
// // //   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 2 },
// // //   theirBubble: { backgroundColor: '#FFFFFF', borderTopRightRadius: 2 },

// // //   authorName: { fontSize: 13, fontWeight: 'bold', marginBottom: 4, textAlign: 'right', paddingHorizontal: 5 },
// // //   postImage: { width: width * 0.78, height: 220, borderRadius: 10, marginBottom: 8 },
  
// // //   textAndInfo: { paddingHorizontal: 8, paddingBottom: 5 },
// // //   description: { fontSize: 16, color: '#333', textAlign: 'right', lineHeight: 22 },
  
// // //   timeContainer: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 5 },
// // //   timeText: { fontSize: 10, color: '#888' },
// // //   ticks: { fontSize: 12, color: '#34B7F1' },

// // //   commentBar: {
// // //     borderTopWidth: 1,
// // //     borderTopColor: 'rgba(0,0,0,0.05)',
// // //     marginTop: 8,
// // //     paddingVertical: 6,
// // //     alignItems: 'center'
// // //   },
// // //   commentBarText: { fontSize: 11, color: '#075E54', fontWeight: '600' },

// // //   // Footer / Input Area
// // //   footer: { 
// // //     position: 'absolute', 
// // //     bottom: 15, 
// // //     flexDirection: 'row', 
// // //     width: '100%', 
// // //     paddingHorizontal: 10, 
// // //     alignItems: 'center' 
// // //   },
// // //   inputBar: { 
// // //     flex: 1, 
// // //     height: 50, 
// // //     backgroundColor: '#fff', 
// // //     borderRadius: 25, 
// // //     flexDirection: 'row', 
// // //     alignItems: 'center', 
// // //     paddingHorizontal: 15,
// // //     elevation: 5,
// // //     shadowColor: '#000',
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 5
// // //   },
// // //   inputText: { flex: 1, textAlign: 'right', color: '#999', fontSize: 16, marginRight: 10 },
// // //   plusIcon: { fontSize: 28, color: '#075E54', fontWeight: '300' },
// // //   cameraIcon: { fontSize: 20, marginRight: 10 },
// // //   micCircle: { 
// // //     width: 50, height: 50, backgroundColor: '#075E54', borderRadius: 25, 
// // //     justifyContent: 'center', alignItems: 'center', marginRight: 8, elevation: 5 
// // //   },
// // //   micIcon: { fontSize: 22 },
// // //   emptyText: { textAlign: 'center', marginTop: 100, color: '#666', fontSize: 16 }
// // // });

// // // export default GroupDetailsScreen;
// // import React, { useState, useEffect, useCallback } from 'react';
// // import { 
// //   View, Text, FlatList, Image, StyleSheet, 
// //   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity,
// //   SafeAreaView, StatusBar, Alert
// // } from 'react-native';
// // import { useFocusEffect } from '@react-navigation/native';
// // import { BASE_URL } from '../api/Constants';

// // const { width } = Dimensions.get('window');

// // const GroupDetailsScreen = ({ route, navigation }: any) => {
// //   // קבלת נתונים מהניווט
// //   const { groupId, groupName, userName } = route.params;
// //   const [posts, setPosts] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   // שליפת הפוסטים מהשרת
// //   const fetchPosts = async () => {
// //     try {
// //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// //       const data = await response.json();
// //       setPosts(Array.isArray(data) ? data : []);
// //     } catch (error) {
// //       console.error("Error fetching posts:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // רענון הנתונים בכל פעם שהמסך חוזר לפוקוס
// //   useFocusEffect(
// //     useCallback(() => {
// //       fetchPosts();
// //     }, [groupId])
// //   );

// //   const renderPost = ({ item }: { item: any }) => {
// //     // בדיקה דינמית: האם ב-Map של userMessages יש מפתח שזהה ל-userName?
// //     const mySecretMessage = item.userMessages && userName ? item.userMessages[userName] : null;
// //     const isMyPost = item.author === userName;

// //     return (
// //       <TouchableOpacity 
// //         activeOpacity={0.9}
// //         onPress={() => navigation.navigate('PostDetails', { 
// //           post: item, 
// //           userName: userName 
// //         })}
// //         style={styles.postWrapper}
// //       >
// //         <View style={styles.modernCard}>
// //           {/* 1. מימין: הקובץ (התמונה) במסגרת עדינה */}
// //           {item.imageUrl && (
// //             <View style={styles.imageContainer}>
// //               <Image source={{ uri: item.imageUrl }} style={styles.postImage} resizeMode="cover" />
// //             </View>
// //           )}

// //           {/* 2. משמאל: תיאור הקובץ והמידע */}
// //           <View style={styles.contentContainer}>
// //             <View style={styles.cardHeaderRow}>
// //                <Text style={[styles.authorName, { color: isMyPost ? '#075E54' : '#E91E63' }]}>
// //                   {isMyPost ? "אני" : item.author}
// //                </Text>
// //                <Text style={styles.timeText}>
// //                   {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
// //                </Text>
// //             </View>
            
// //             <View style={styles.descriptionRow}>
// //                 {/* הכוכב למסר סודי יופיע משמאל לטקסט התיאור */}
// //                 {mySecretMessage && (
// //                   <TouchableOpacity 
// //                     style={styles.starCircle}
// //                     onPress={() => Alert.alert("✨ מסר סודי במיוחד עבורך", mySecretMessage)}
// //                   >
// //                     <Text style={{fontSize: 20}}>⭐</Text>
// //                   </TouchableOpacity>
// //                 )}
// //                 <Text style={styles.descriptionText} numberOfLines={3}>
// //                   {item.description}
// //                 </Text>
// //             </View>
            
// //             {/* רמז עדין שאפשר להגיב */}
// //             <View style={styles.commentBar}>
// //                <Text style={styles.commentBarText}>💬 לחץ לצפייה והוספת תגובות...</Text>
// //             </View>
// //           </View>
// //         </View>
// //       </TouchableOpacity>
// //     );
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" backgroundColor="#075E54" />
      
// //       {/* Header - כותרת הקבוצה המודרנית */}
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
// //           <Text style={styles.backBtnText}>➜</Text>
// //         </TouchableOpacity>
        
// //         <View style={styles.headerInfo}>
// //           <Text style={styles.headerTitle}>{groupName}</Text>
// //           <Text style={styles.headerSubtitle}>{posts.length} פוסטים בערוץ</Text>
// //         </View>

// //         <View style={styles.headerAvatar}>
// //            <Text style={{fontSize: 20}}>👥</Text>
// //         </View>
// //       </View>

// //       {/* רשימת הפוסטים בעיצוב מודרני */}
// //       <FlatList
// //         data={posts}
// //         keyExtractor={(item) => item.id.toString()}
// //         renderItem={renderPost}
// //         contentContainerStyle={styles.listContent}
// //         refreshControl={
// //           <RefreshControl refreshing={loading} onRefresh={fetchPosts}  />
// //         }
// //         ListEmptyComponent={!loading ? <Text style={styles.emptyText}>אין עדיין תוכן בקבוצה זו...</Text> : null}
// //       />

// //       {/* שורת קלט תחתונה (וואטסאפ סטייל המאיר עיניים) */}
// //       <View style={styles.footer}>
// //         <View style={styles.micCircle}>
// //            <Text style={styles.micIcon}>🎙️</Text>
// //         </View>
        
// //         <TouchableOpacity 
// //           style={styles.inputBar} 
// //           onPress={() => navigation.navigate('CreatePost', { 
// //             target: 'group', 
// //             groupId, 
// //             groupName, 
// //             userName 
// //           })}
// //         >
// //           <Text style={styles.cameraIcon}>📷</Text>
// //           <Text style={styles.inputText}>הוסף פוסט או מסר סודי...</Text>
// //           <Text style={styles.plusIcon}>+</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#E5DDD5' }, // רקע וואטסאפ (אפשר לשנות ל-#F0F2F5 למראה נקי יותר)
  
// //   // Header
// //   header: { 
// //     height: 65, 
// //     backgroundColor: '#075E54', 
// //     flexDirection: 'row-reverse', 
// //     alignItems: 'center', 
// //     paddingHorizontal: 15,
// //     elevation: 4,
// //     shadowColor: '#000',
// //     shadowOpacity: 0.2,
// //     shadowRadius: 5
// //   },
// //   headerInfo: { flex: 1, marginRight: 15 },
// //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'right' },
// //   headerSubtitle: { color: '#A0D3C1', fontSize: 12, textAlign: 'right' },
// //   headerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#128C7E', justifyContent: 'center', alignItems: 'center' },
// //   backBtn: { padding: 5 },
// //   backBtnText: { color: '#fff', fontSize: 24 },

// //   // List
// //   listContent: { paddingHorizontal: 10, paddingVertical: 15, paddingBottom: 100 },
  
// //   postWrapper: { 
// //     marginBottom: 15, 
// //     width: '100%', 
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 5,
// //     elevation: 3
// //   },
  
// //   modernCard: { 
// //     backgroundColor: '#fff', 
// //     borderRadius: 18, 
// //     flexDirection: 'row-reverse', // RTL: ימין לשמאל
// //     overflow: 'hidden',
// //     borderWidth: 1,
// //     borderColor: '#EEE'
// //   },
  
// //   // מימין: הקובץ
// //   imageContainer: { 
// //     width: 110, 
// //     height: 110, 
// //     margin: 8, 
// //     borderRadius: 12, 
// //     overflow: 'hidden',
// //     borderWidth: 1,
// //     borderColor: '#eee'
// //   },
// //   postImage: { width: '100%', height: '100%' },
  
// //   // משמאל: תיאור הקובץ
// //   contentContainer: { 
// //     flex: 1, 
// //     padding: 12, 
// //     justifyContent: 'space-between' 
// //   },
  
// //   cardHeaderRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
// //   authorName: { fontSize: 15, fontWeight: 'bold' },
// //   timeText: { fontSize: 10, color: '#AAA', fontWeight: '400' },
  
// //   descriptionRow: { flexDirection: 'row-reverse', alignItems: 'center', marginVertical: 5 },
// //   descriptionText: { flex: 1, fontSize: 14, color: '#555', textAlign: 'right', lineHeight: 20 },
  
// //   starCircle: { 
// //     backgroundColor: '#FFF9C4', 
// //     padding: 6, 
// //     borderRadius: 20, 
// //     marginLeft: 10, 
// //     borderWidth: 1, 
// //     borderColor: '#FFD700' 
// //   },
  
// //   commentBar: {
// //     borderTopWidth: 1,
// //     borderTopColor: '#EEE',
// //     marginTop: 8,
// //     paddingTop: 6,
// //     alignItems: 'flex-end' // מיושר לימין כדי להתאים לעברית
// //   },
// //   commentBarText: { fontSize: 11, color: '#075E54', fontWeight: '600' },

// //   // Footer / Input Area
// //   footer: { 
// //     position: 'absolute', 
// //     bottom: 15, 
// //     flexDirection: 'row', 
// //     width: '100%', 
// //     paddingHorizontal: 10, 
// //     alignItems: 'center' 
// //   },
// //   inputBar: { 
// //     flex: 1, 
// //     height: 50, 
// //     backgroundColor: '#fff', 
// //     borderRadius: 25, 
// //     flexDirection: 'row', 
// //     alignItems: 'center', 
// //     paddingHorizontal: 15,
// //     elevation: 5,
// //     shadowColor: '#000',
// //     shadowOpacity: 0.1,
// //     shadowRadius: 5
// //   },
// //   inputText: { flex: 1, textAlign: 'right', color: '#999', fontSize: 16, marginRight: 10 },
// //   plusIcon: { fontSize: 28, color: '#075E54', fontWeight: '300' },
// //   cameraIcon: { fontSize: 20, marginRight: 10 },
// //   micCircle: { 
// //     width: 50, height: 50, backgroundColor: '#075E54', borderRadius: 25, 
// //     justifyContent: 'center', alignItems: 'center', marginRight: 8, elevation: 5 
// //   },
// //   micIcon: { fontSize: 22 },
// //   emptyText: { textAlign: 'center', marginTop: 100, color: '#666', fontSize: 16 }
// // });

// // export default GroupDetailsScreen;
// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   View, Text, FlatList, Image, StyleSheet, 
//   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity,
//   SafeAreaView, StatusBar, Alert
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { BASE_URL } from '../api/Constants';

// const { width } = Dimensions.get('window');

// const GroupDetailsScreen = ({ route, navigation }: any) => {
//   const { groupId, groupName, userName } = route.params;
//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchPosts = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
//       const data = await response.json();
//       setPosts(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchPosts();
//     }, [groupId])
//   );

//   const renderPost = ({ item }: { item: any }) => {
//     const isMyPost = item.author === userName;
//     const mySecretMessage = item.userMessages && userName ? item.userMessages[userName] : null;
    
//     // פורמט תאריך ושעה
//     const dateObj = new Date(item.createdAt);
//     const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

//     return (
//       <TouchableOpacity 
//         activeOpacity={0.9}
//         onPress={() => navigation.navigate('PostDetails', { post: item, userName })}
//         style={[styles.postWrapper, isMyPost && styles.myPostWrapper]}
//       >
//         <View style={[styles.modernCard, isMyPost ? styles.myCardBg : styles.theirCardBg]}>
          
//           {/* חלק ימני: תמונה / קובץ */}
//           {item.imageUrl && (
//             <View style={styles.imageSection}>
//               <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
//               {isMyPost && <View style={styles.myBadge}><Text style={styles.myBadgeText}>שלי</Text></View>}
//             </View>
//           )}

//           {/* חלק שמאלי: תוכן ומידע */}
//           <View style={styles.contentSection}>
//             <View style={styles.topRow}>
//               <Text style={[styles.authorName, { color: isMyPost ? '#075E54' : '#E91E63' }]}>
//                 {isMyPost ? "אני" : item.author}
//               </Text>
//               <View style={styles.dateTimeContainer}>
//                 <Text style={styles.dateTimeText}>{timeStr}</Text>
//                 <Text style={styles.separator}>|</Text>
//                 <Text style={styles.dateTimeText}>{dateStr}</Text>
//               </View>
//             </View>

//             <View style={styles.descriptionArea}>
//               <Text style={styles.descriptionText} numberOfLines={3}>
//                 {item.description}
//               </Text>
              
//               {mySecretMessage && (
//                 <TouchableOpacity 
//                   style={styles.starButton}
//                   onPress={() => Alert.alert("✨ מסר סודי", mySecretMessage)}
//                 >
//                   <Text style={styles.starEmoji}>⭐</Text>
//                 </TouchableOpacity>
//               )}
//             </View>

//             <View style={styles.footerRow}>
//               <Text style={[styles.actionText, { color: isMyPost ? '#075E54' : '#777' }]}>
//                 💬 {item.commentsCount || 0} תגובות • לחץ לפירוט
//               </Text>
//               {isMyPost && <Text style={styles.blueTicks}>✔️✔️</Text>}
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#075E54" />
      
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={styles.backBtnText}>➜</Text>
//         </TouchableOpacity>
//         <View style={styles.headerInfo}>
//           <Text style={styles.headerTitle}>{groupName}</Text>
//           <Text style={styles.headerSubtitle}>{posts.length} עדכונים בפיד</Text>
//         </View>
//         <View style={styles.headerIconContainer}>
//            <Text style={{fontSize: 22}}>📱</Text>
//         </View>
//       </View>

//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderPost}
//         contentContainerStyle={styles.listPadding}
//         refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
//         ListEmptyComponent={!loading ? <Text style={styles.emptyText}>הפיד ריק כרגע...</Text> : null}
//       />

//       {/* Footer הקלט המעוצב */}
//       <View style={styles.footerContainer}>
//         <TouchableOpacity style={styles.micBtn}>
//           <Text style={{fontSize: 24}}>🎙️</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.inputBox}
//           onPress={() => navigation.navigate('CreatePost', { target: 'group', groupId, groupName, userName })}
//         >
//           <Text style={styles.inputText}>שתף משהו עם הקבוצה...</Text>
//           <Text style={{fontSize: 20}}>📷</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F0F2F5' },
  
//   // Header
//   header: { 
//     height: 70, backgroundColor: '#075E54', flexDirection: 'row-reverse', 
//     alignItems: 'center', paddingHorizontal: 20, elevation: 5 
//   },
//   headerInfo: { flex: 1, marginRight: 15 },
//   headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'right' },
//   headerSubtitle: { color: '#A0D3C1', fontSize: 13, textAlign: 'right' },
//   headerIconContainer: { width: 45, height: 45, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
//   backBtn: { padding: 5 },
//   backBtnText: { color: '#fff', fontSize: 26 },

//   // List & Cards
//   listPadding: { padding: 12, paddingBottom: 100 },
//   postWrapper: { marginBottom: 15 },
//   myPostWrapper: { transform: [{ scale: 1.02 }] }, // הגדלה קלה לפוסט שלי
  
//   modernCard: { 
//     flexDirection: 'row-reverse', borderRadius: 20, overflow: 'hidden',
//     elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
//     borderWidth: 1, borderColor: '#E0E0E0'
//   },
//   myCardBg: { backgroundColor: '#E7FFDB', borderColor: '#C1E6B0' },
//   theirCardBg: { backgroundColor: '#FFFFFF' },

//   // Image Section
//   imageSection: { width: 120, height: 120, position: 'relative' },
//   postImage: { width: '100%', height: '100%' },
//   myBadge: { 
//     position: 'absolute', top: 5, right: 5, backgroundColor: '#075E54', 
//     paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 
//   },
//   myBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

//   // Content Section
//   contentSection: { flex: 1, padding: 12, justifyContent: 'space-between' },
//   topRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
//   authorName: { fontSize: 16, fontWeight: 'bold' },
//   dateTimeContainer: { flexDirection: 'row', alignItems: 'center' },
//   dateTimeText: { fontSize: 11, color: '#888' },
//   separator: { marginHorizontal: 4, color: '#DDD', fontSize: 10 },

//   descriptionArea: { flexDirection: 'row-reverse', alignItems: 'center', marginVertical: 8 },
//   descriptionText: { flex: 1, fontSize: 15, color: '#444', textAlign: 'right', lineHeight: 20 },
//   starButton: { 
//     backgroundColor: '#FFF', borderRadius: 20, padding: 5, marginLeft: 8,
//     elevation: 2, shadowOpacity: 0.1, borderWidth: 1, borderColor: '#FFD700'
//   },
//   starEmoji: { fontSize: 18 },

//   footerRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 0.5, borderTopColor: '#EEE', paddingTop: 8 },
//   actionText: { fontSize: 12, fontWeight: '600' },
//   blueTicks: { color: '#34B7F1', fontSize: 14, fontWeight: 'bold' },

//   // Footer Input
//   footerContainer: { 
//     position: 'absolute', bottom: 20, width: '100%', flexDirection: 'row', 
//     paddingHorizontal: 15, alignItems: 'center' 
//   },
//   inputBox: { 
//     flex: 1, height: 55, backgroundColor: '#FFF', borderRadius: 30, 
//     flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, elevation: 8
//   },
//   inputText: { flex: 1, textAlign: 'right', color: '#999', fontSize: 16, marginRight: 15 },
//   micBtn: { 
//     width: 55, height: 55, backgroundColor: '#075E54', borderRadius: 28, 
//     justifyContent: 'center', alignItems: 'center', marginRight: 10, elevation: 8
//   },
//   emptyText: { textAlign: 'center', marginTop: 100, color: '#999', fontSize: 18 }
// });

// export default GroupDetailsScreen;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, Text, FlatList, Image, StyleSheet, 
  ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity,
  SafeAreaView, StatusBar, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../api/Constants';

const { width } = Dimensions.get('window');

const GroupDetailsScreen = ({ route, navigation }: any) => {
  const { groupId, groupName, userName } = route.params;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null); // רפרנס כדי לשלוט בגלילה

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // מיון: הישן ביותר ראשון, החדש ביותר אחרון (כדי שיהיה בתחתית)
        const sortedData = data.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setPosts(sortedData);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [groupId])
  );

  // פונקציה שקופצת לסוף הרשימה כשהנתונים משתנים
  const handleContentSizeChange = () => {
    if (posts.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: false });
    }
  };

  const renderPost = ({ item }: { item: any }) => {
    const isMyPost = item.author === userName;
    const mySecretMessage = item.userMessages && userName ? item.userMessages[userName] : null;
    
    const dateObj = new Date(item.createdAt);
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('PostDetails', { post: item, userName })}
        style={styles.postWrapper}
      >
        <View style={[styles.modernCard, isMyPost ? styles.myCardBg : styles.theirCardBg]}>
          
          {/* ימין: תמונה */}
          {item.imageUrl && (
            <View style={styles.imageSection}>
              <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
              {isMyPost && <View style={styles.myBadge}><Text style={styles.myBadgeText}>שלי</Text></View>}
            </View>
          )}

          {/* שמאל: תוכן */}
          <View style={styles.contentSection}>
            <View style={styles.topRow}>
              <Text style={[styles.authorName, { color: isMyPost ? '#075E54' : '#E91E63' }]}>
                {isMyPost ? "אני" : item.author}
              </Text>
              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateTimeText}>{timeStr} | {dateStr}</Text>
              </View>
            </View>

            <View style={styles.descriptionArea}>
              <Text style={styles.descriptionText} numberOfLines={3}>
                {item.description}
              </Text>
              {mySecretMessage && (
                <TouchableOpacity 
                  style={styles.starButton}
                  onPress={() => Alert.alert("✨ מסר סודי", mySecretMessage)}
                >
                  <Text style={{fontSize: 18}}>⭐</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.actionText}>💬 תגובות ופירוט</Text>
              {isMyPost && <Text style={styles.blueTicks}>✔️✔️</Text>}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#075E54" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>➜</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{groupName}</Text>
          <Text style={styles.headerSubtitle}>{posts.length} פוסטים</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.listPadding}
        onContentSizeChange={handleContentSizeChange} // קופץ לסוף כשהרשימה נטענת
        onLayout={handleContentSizeChange} // קופץ לסוף בפתיחה
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>אין הודעות...</Text> : null}
      />

      {/* Footer למטה */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.micBtn}>
          <Text style={{fontSize: 24}}>🎙️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.inputBox}
          onPress={() => navigation.navigate('CreatePost', { target: 'group', groupId, groupName, userName })}
        >
          <Text style={styles.inputText}>כתוב משהו לקבוצה...</Text>
          <Text style={{fontSize: 20}}>📷</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E5DDD5' },
  header: { height: 70, backgroundColor: '#075E54', flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 20 },
  headerInfo: { flex: 1, marginRight: 15 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'right' },
  headerSubtitle: { color: '#A0D3C1', fontSize: 12, textAlign: 'right' },
  backBtn: { padding: 5 },
  backBtnText: { color: '#fff', fontSize: 24 },

  listPadding: { padding: 12, paddingBottom: 20 },
  postWrapper: { marginBottom: 12 },
  modernCard: { flexDirection: 'row-reverse', borderRadius: 15, overflow: 'hidden', elevation: 3, backgroundColor: '#fff' },
  myCardBg: { backgroundColor: '#E7FFDB' },
  theirCardBg: { backgroundColor: '#FFFFFF' },

  imageSection: { width: 100, height: 100 },
  postImage: { width: '100%', height: '100%' },
  myBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: '#075E54', paddingHorizontal: 6, borderRadius: 8 },
  myBadgeText: { color: '#fff', fontSize: 9 },

  contentSection: { flex: 1, padding: 10, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  authorName: { fontSize: 14, fontWeight: 'bold' },
  dateTimeText: { fontSize: 10, color: '#888' },

  descriptionArea: { flexDirection: 'row-reverse', alignItems: 'center', marginVertical: 5 },
  descriptionText: { flex: 1, fontSize: 14, color: '#444', textAlign: 'right' },
  starButton: { backgroundColor: '#FFF', borderRadius: 20, padding: 3, marginLeft: 5, borderWidth: 1, borderColor: '#FFD700' },

  footerRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: '#EEE', paddingTop: 5 },
  actionText: { fontSize: 11, color: '#777', fontWeight: '600' },
  blueTicks: { color: '#34B7F1', fontSize: 12 },
dateTimeContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
  footerContainer: { flexDirection: 'row', padding: 10, alignItems: 'center', backgroundColor: 'transparent' },
  inputBox: { flex: 1, height: 50, backgroundColor: '#FFF', borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, elevation: 3 },
  inputText: { flex: 1, textAlign: 'right', color: '#999', marginRight: 10 },
  micBtn: { width: 50, height: 50, backgroundColor: '#075E54', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default GroupDetailsScreen;