// // // import React, { useState, useEffect } from 'react';
// // // import { 
// // //   View, Text, StyleSheet, FlatList, Image, 
// // //   TouchableOpacity, ScrollView, ActivityIndicator, Alert 
// // // } from 'react-native';
// // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // import { BASE_URL } from '../api/Constants';

// // // // הגדרת מבנה הפוסט כדי שה-TypeScript לא יהיה "אדום"
// // // interface Post {
// // //   id: string;
// // //   author: string;
// // //   description: string;
// // //   imageUrl: string;
// // //   target: string;
// // //   secretMessage?: string;
// // // }

// // // const GroupDetailScreen = ({ route, navigation }: any) => {
// // //   const { groupId, groupName } = route.params || { groupId: '1', groupName: 'קבוצה' };
  
// // //   const [posts, setPosts] = useState<Post[]>([]);
// // //   const [members, setMembers] = useState<any[]>([]);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     fetchGroupData();
// // //   }, [groupId]);

// // //   const fetchGroupData = async () => {
// // //     try {
// // //       // שליפת פוסטים מהשרת לפי ה-ID של הקבוצה
// // //       const postsRes = await fetch(`http://10.0.2.2:8080/api/posts/feed/${groupId}`);
// // //       const postsData = await postsRes.json();
// // //       setPosts(postsData);

// // //       // נתוני דמה לחברים (כי עוד לא בנינו API כזה ב-Java)
// // //       setMembers([
// // //         { id: '1', name: 'אבי', avatar: '👨' },
// // //         { id: '2', name: 'מיכל', avatar: '👩' },
// // //         { id: '3', name: 'דני', avatar: '👦' },
// // //       ]);
// // //     } catch (error) {
// // //       console.error("Error fetching group data:", error);
// // //       Alert.alert("שגיאה", "לא ניתן היה למשוך נתונים מהשרת");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   if (loading) return <ActivityIndicator size="large" color="#6200EE" style={{ flex: 1 }} />;

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       {/* כותרת הקבוצה */}
// // //       <View style={styles.header}>
// // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // //           <Text style={{color: '#fff'}}> חזור </Text>
// // //         </TouchableOpacity>
// // //         <Text style={styles.groupTitle}>{groupName}</Text>
// // //       </View>

// // //       {/* רשימת חברים אופקית */}
// // //       <View style={styles.membersContainer}>
// // //         <Text style={styles.sectionTitle}>חברי הקבוצה:</Text>
// // //         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.membersList}>
// // //           {members.map((member) => (
// // //             <TouchableOpacity 
// // //               key={member.id} 
// // //               style={styles.memberCircle}
// // //               onPress={() => navigation.navigate('GlobalFeed', { target: member.id, groupName: member.name })}
// // //             >
// // //               <View style={styles.avatarPlaceholder}>
// // //                 <Text style={styles.avatarEmoji}>{member.avatar || '👤'}</Text>
// // //               </View>
// // //               <Text style={styles.memberNameSmall}>{member.name}</Text>
// // //             </TouchableOpacity>
// // //           ))}
// // //         </ScrollView>
// // //       </View>

// // //       {/* פיד פוסטים */}
// // //       <FlatList
// // //         data={posts}
// // //         keyExtractor={(item) => item.id}
// // //         contentContainerStyle={{ paddingBottom: 20 }}
// // //         ListEmptyComponent={<Text style={styles.emptyText}>אין עדיין פוסטים בקבוצה זו</Text>}
// // //         renderItem={({ item }) => (
// // //           <View style={styles.postCard}>
// // //             <View style={styles.postHeader}>
// // //               <Text style={styles.author}>{item.author}</Text>
// // //               <Text style={styles.date}># {item.id.substring(0, 4)}</Text>
// // //             </View>
            
// // //             <Text style={styles.postText}>{item.description}</Text>
            
// // //             {item.imageUrl && (
// // //               <Image source={{ uri: item.imageUrl }} style={styles.postImage} resizeMode="cover" />
// // //             )}

// // //             <TouchableOpacity 
// // //               style={styles.stegoButton}
// // //               onPress={() => Alert.alert("המסר הסודי שחולץ:", item.secretMessage || "לא נמצא מסר סודי בקובץ זה")}
// // //             >
// // //               <Text style={styles.stegoButtonText}>🔍 חלץ מסר סודי (סטגנוגרפיה)</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         )}
// // //       />
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#f0f2f5' },
// // //   header: { padding: 15, backgroundColor: '#6200EE', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center' },
// // //   backButton: { position: 'absolute', right: 15 },
// // //   groupTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
// // //   membersContainer: { backgroundColor: '#fff', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ddd' },
// // //   sectionTitle: { fontSize: 14, fontWeight: 'bold', marginRight: 15, textAlign: 'right', color: '#666', marginBottom: 5 },
// // //   membersList: { paddingHorizontal: 10, flexDirection: 'row-reverse' },
// // //   memberCircle: { alignItems: 'center', marginHorizontal: 8, width: 60 },
// // //   avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#6200EE' },
// // //   avatarEmoji: { fontSize: 24 },
// // //   memberNameSmall: { fontSize: 10, marginTop: 4, textAlign: 'center' },
// // //   postCard: { backgroundColor: '#fff', marginTop: 12, marginHorizontal: 10, borderRadius: 12, overflow: 'hidden', elevation: 2 },
// // //   postHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 10, backgroundColor: '#fafafa' },
// // //   author: { fontWeight: 'bold', color: '#333' },
// // //   date: { fontSize: 11, color: '#999' },
// // //   postText: { padding: 10, textAlign: 'right', fontSize: 15 },
// // //   postImage: { width: '100%', height: 250, backgroundColor: '#eee' },
// // //   stegoButton: { padding: 12, backgroundColor: '#F3E5F5', alignItems: 'center' },
// // //   stegoButtonText: { color: '#6200EE', fontWeight: 'bold' },
// // //   emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
// // // });

// // // export default GroupDetailScreen;
// // import React, { useState, useEffect, useCallback } from 'react';
// // import { 
// //   View, Text, FlatList, Image, StyleSheet, 
// //   ActivityIndicator, Dimensions, RefreshControl 
// // } from 'react-native';
// // import { useFocusEffect } from '@react-navigation/native';
// // import { BASE_URL } from '../api/Constants';

// // const { width } = Dimensions.get('window');

// // const GroupDetailsScreen = ({ route }: any) => {
// //   const { groupId, groupName, userName } = route.params; // שם המשתמש הנוכחי לצורך זיהוי "שלי/שלו"
// //   const [posts, setPosts] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   const fetchPosts = async () => {
// //     try {
// //       // שליפת פוסטים לפי ה-ID של הקבוצה
// //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// //       const data = await response.json();
// //       setPosts(data);
// //     } catch (error) {
// //       console.error("Error fetching posts:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useFocusEffect(
// //     useCallback(() => {
// //       fetchPosts();
// //     }, [groupId])
// //   );

// //   const renderPost = ({ item }: { item: any }) => {
// //     const isMyPost = item.author === userName; // בדיקה אם אני שלחתי

// //     return (
// //       <View style={[styles.messageWrapper, isMyPost ? styles.myMessage : styles.theirMessage]}>
// //         <View style={[styles.bubble, isMyPost ? styles.myBubble : styles.theirBubble]}>
          
// //           <Text style={styles.authorName}>{isMyPost ? "אני" : item.author}</Text>
          
// //           {item.imageUrl && (
// //             <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
// //           )}
          
// //           <Text style={styles.description}>{item.description}</Text>
          
// //           <Text style={styles.timeText}>
// //             {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// //           </Text>
// //         </View>
// //       </View>
// //     );
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.header}>
// //         <Text style={styles.headerTitle}>{groupName}</Text>
// //       </View>

// //       {loading ? (
// //         <ActivityIndicator size="large" color="#6200EE" style={{ marginTop: 50 }} />
// //       ) : (
// //         <FlatList
// //           data={posts}
// //           keyExtractor={(item) => item.id}
// //           renderItem={renderPost}
// //           contentContainerStyle={styles.listContent}
// //           inverted={false} // אם אתה רוצה שהחדשים יהיו למטה, השאר false. אם החדשים למעלה - true.
// //           refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
// //           ListEmptyComponent={<Text style={styles.emptyText}>אין עדיין פוסטים בקבוצה הזו...</Text>}
// //         />
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#E5DDD5' }, // צבע רקע של וואטסאפ
// //   header: { padding: 15, backgroundColor: '#075E54', alignItems: 'center' },
// //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// //   listContent: { padding: 10 },
  
// //   messageWrapper: { flexDirection: 'row', marginBottom: 10, width: '100%' },
// //   myMessage: { justifyContent: 'flex-end' }, // הודעות שלי לימין
// //   theirMessage: { justifyContent: 'flex-start' }, // הודעות של אחרים לשמאל

// //   bubble: { 
// //     maxWidth: width * 0.75, 
// //     padding: 8, 
// //     borderRadius: 10, 
// //     elevation: 1,
// //     shadowColor: '#000',
// //     shadowOpacity: 0.1,
// //   },
// //   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
// //   theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },

// //   authorName: { fontSize: 12, fontWeight: 'bold', color: '#075E54', marginBottom: 4, textAlign: 'right' },
// //   postImage: { width: width * 0.65, height: 200, borderRadius: 8, marginBottom: 5, resizeMode: 'cover' },
// //   description: { fontSize: 16, color: '#333', textAlign: 'right' },
// //   timeText: { fontSize: 10, color: '#888', textAlign: 'left', marginTop: 4 },
// //   emptyText: { textAlign: 'center', marginTop: 100, color: '#666' }
// // });

// // export default GroupDetailsScreen;
// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   View, Text, FlatList, Image, StyleSheet, 
//   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity 
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
//       setPosts(data);
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
//     return (
//       <View style={[styles.messageWrapper, isMyPost ? styles.myMessage : styles.theirMessage]}>
//         <View style={[styles.bubble, isMyPost ? styles.myBubble : styles.theirBubble]}>
//           <Text style={styles.authorName}>{isMyPost ? "אני" : item.author}</Text>
//           {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.postImage} />}
//           <Text style={styles.description}>{item.description}</Text>
//           <Text style={styles.timeText}>
//              {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>{groupName}</Text>
//       </View>

//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item.id}
//         renderItem={renderPost}
//         contentContainerStyle={[styles.listContent, { paddingBottom: 80 }]}
//         refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
//         ListEmptyComponent={!loading ? <Text style={styles.emptyText}>אין עדיין פוסטים בקבוצה...</Text> : null}
//       />

//       {/* --- שורת קלט למטה (סגנון וואטסאפ) --- */}
//       <View style={styles.inputContainer}>
//         <TouchableOpacity 
//           style={styles.fakeInput} 
//           onPress={() => navigation.navigate('CreatePost', { 
//             target: 'group', 
//             groupId: groupId, 
//             groupName: groupName,
//             userName: userName 
//           })}
//         >
//           <Text style={styles.plusIcon}>+</Text>
//           <Text style={styles.placeholderText}>הוסף פוסט או מסר סודי לקבוצה...</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#E5DDD5' },
//   header: { padding: 15, backgroundColor: '#075E54', alignItems: 'center' },
//   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//   listContent: { padding: 10 },
//   messageWrapper: { flexDirection: 'row', marginBottom: 10, width: '100%' },
//   myMessage: { justifyContent: 'flex-end' },
//   theirMessage: { justifyContent: 'flex-start' },
//   bubble: { maxWidth: width * 0.75, padding: 8, borderRadius: 10, elevation: 1 },
//   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
//   theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },
//   authorName: { fontSize: 12, fontWeight: 'bold', color: '#075E54', marginBottom: 4, textAlign: 'right' },
//   postImage: { width: width * 0.65, height: 200, borderRadius: 8, marginBottom: 5 },
//   description: { fontSize: 16, color: '#333', textAlign: 'right' },
//   timeText: { fontSize: 10, color: '#888', textAlign: 'left', marginTop: 4 },
//   emptyText: { textAlign: 'center', marginTop: 100, color: '#666' },
  
//   // עיצוב שורת הקלט
//   inputContainer: {
//     position: 'absolute', bottom: 0, width: '100%',
//     padding: 10, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center'
//   },
//   fakeInput: {
//     flex: 1, backgroundColor: '#fff', borderRadius: 25, height: 50,
//     flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15,
//     elevation: 2
//   },
//   plusIcon: { fontSize: 30, color: '#075E54', marginLeft: 10, fontWeight: '300' },
//   placeholderText: { color: '#999', fontSize: 16, textAlign: 'right', flex: 1 }
// });

// // export default GroupDetailsScreen;
// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   View, Text, FlatList, Image, StyleSheet, 
//   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity 
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
//       setPosts(data);
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
//     // בדיקה האם אני השולח
//     const isMyPost = item.author === userName;
    
//     return (
//       <View style={[styles.messageWrapper, isMyPost ? styles.myMessage : styles.theirMessage]}>
//         <View style={[styles.bubble, isMyPost ? styles.myBubble : styles.theirBubble]}>
          
//           {/* שם השולח: אם זה אני כותב "אני", אם לא - את השם שלו */}
//           <Text style={[styles.authorName, isMyPost ? styles.myAuthorName : styles.theirAuthorName]}>
//             {isMyPost ? "אני" : item.author || "משתמש לא ידוע"}
//           </Text>

//           {item.imageUrl && (
//             <Image source={{ uri: item.imageUrl }} style={styles.postImage} resizeMode="cover" />
//           )}

//           <View style={styles.textContainer}>
//             <Text style={styles.description}>{item.description}</Text>
            
//             <Text style={styles.timeText}>
//               {item.createdAt 
//                 ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
//                 : '--:--'}
//             </Text>
//           </View>

//           {/* כפתור חילוץ מסר סודי (אם קיים)
//           {item.secretMessage && (
//             <TouchableOpacity 
//               style={styles.stegoTag} 
//               onPress={() => alert(`המסר הסודי: ${item.secretMessage}`)}
//             >
//               <Text style={styles.stegoText}>🔍 חלץ מסר סודי</Text>
//             </TouchableOpacity>
//           )} */}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* כותרת וואטסאפ */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={styles.backBtnText}>➜</Text>
//         </TouchableOpacity>
//         <View style={styles.headerInfo}>
//           <Text style={styles.headerTitle}>{groupName}</Text>
//           <Text style={styles.headerSubtitle}>לחץ לפרטי הקבוצה</Text>
//         </View>
//       </View>

//       {loading && posts.length === 0 ? (
//         <ActivityIndicator size="large" color="#075E54" style={{ marginTop: 50 }} />
//       ) : (
//         <FlatList
//           data={posts}
//           keyExtractor={(item) => item.id}
//           renderItem={renderPost}
//           contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
//           refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
//           ListEmptyComponent={<Text style={styles.emptyText}>אין עדיין הודעות בקבוצה...</Text>}
//         />
//       )}

//       {/* שורת קלט תחתונה */}
//       <View style={styles.footer}>
//         <TouchableOpacity 
//           style={styles.inputBar} 
//           onPress={() => navigation.navigate('CreatePost', { 
//             target: 'group', 
//             groupId, 
//             groupName, 
//             userName 
//           })}
//         >
//           <Text style={styles.plusSymbol}>+</Text>
//           <Text style={styles.inputText}>הקלד הודעה...</Text>
//           <Text style={styles.cameraIcon}>📷</Text>
//         </TouchableOpacity>
//         <View style={styles.micCircle}>
//           <Text style={{color: '#fff', fontSize: 20}}>🎙️</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#E5DDD5' },
  
//   // Header Style
//   header: { 
//     height: 90, 
//     backgroundColor: '#075E54', 
//     flexDirection: 'row-reverse', 
//     alignItems: 'center', 
//     paddingTop: 30, 
//     paddingHorizontal: 15 
//   },
//   headerInfo: { flex: 1, marginRight: 15 },
//   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'right' },
//   headerSubtitle: { color: '#A0D3C1', fontSize: 12, textAlign: 'right' },
//   backBtn: { padding: 5 },
//   backBtnText: { color: '#fff', fontSize: 24 },

//   // List Style
//   listContent: { padding: 10 },
//   messageWrapper: { flexDirection: 'row', marginBottom: 6, width: '100%' },
//   myMessage: { justifyContent: 'flex-end' },
//   theirMessage: { justifyContent: 'flex-start' },

//   // Bubble Style
//   bubble: { 
//     maxWidth: width * 0.8, 
//     padding: 6, 
//     borderRadius: 8, 
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//   },
//   myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
//   theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },

//   // Text inside bubble
//   authorName: { fontSize: 13, fontWeight: 'bold', marginBottom: 2, textAlign: 'right' },
//   myAuthorName: { color: '#075E54' }, // שם ירוק להודעות שלי
//   theirAuthorName: { color: '#E91E63' }, // שם צבעוני (ורוד/כחול) לאחרים
  
//   postImage: { width: width * 0.73, height: 220, borderRadius: 6, marginBottom: 4 },
  
//   textContainer: { 
//     flexDirection: 'row-reverse', 
//     alignItems: 'flex-end', 
//     justifyContent: 'space-between' 
//   },
//   description: { fontSize: 16, color: '#333', textAlign: 'right', flexShrink: 1, marginLeft: 10 },
//   timeText: { fontSize: 10, color: '#888', minWidth: 35, textAlign: 'left' },

//   stegoTag: { 
//     marginTop: 5, 
//     padding: 4, 
//     backgroundColor: 'rgba(7, 94, 84, 0.1)', 
//     borderRadius: 4, 
//     alignItems: 'center' 
//   },
//   stegoText: { fontSize: 12, color: '#075E54', fontWeight: 'bold' },

//   // Footer Style
//   footer: { 
//     position: 'absolute', 
//     bottom: 10, 
//     flexDirection: 'row-reverse', 
//     width: '100%', 
//     paddingHorizontal: 10, 
//     alignItems: 'center' 
//   },
//   inputBar: { 
//     flex: 1, 
//     backgroundColor: '#fff', 
//     height: 48, 
//     borderRadius: 24, 
//     flexDirection: 'row-reverse', 
//     alignItems: 'center', 
//     paddingHorizontal: 15,
//     elevation: 2
//   },
//   plusSymbol: { fontSize: 28, color: '#888', marginLeft: 10 },
//   inputText: { flex: 1, textAlign: 'right', color: '#999', fontSize: 17 },
//   cameraIcon: { fontSize: 20, marginRight: 5 },
//   micCircle: { 
//     width: 48, 
//     height: 48, 
//     backgroundColor: '#075E54', 
//     borderRadius: 24, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     marginRight: 5,
//     elevation: 2
//   },
//   emptyText: { textAlign: 'center', marginTop: 50, color: '#888' }
// });

// export default GroupDetailsScreen;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, Text, FlatList, Image, StyleSheet, 
  ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity, Animated, Easing, Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../api/Constants';

const { width } = Dimensions.get('window');

// --- רכיב הכוכב המנצנץ ---
const SparklingStar = ({ onExtract }: { onExtract: () => void }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '15deg'] });

  return (
    <TouchableOpacity onPress={onExtract} style={styles.starContainer}>
      <Animated.Text style={[styles.starEmoji, { transform: [{ scale }, { rotate }] }]}>
        ⭐
      </Animated.Text>
    </TouchableOpacity>
  );
};

const GroupDetailsScreen = ({ route, navigation }: any) => {
  const { groupId, groupName, userName } = route.params;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
      const data = await response.json();
      // וודא שה-Java מחזיר ב-Ascending (מהישן לחדש)
      setPosts(data);
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

  const renderPost = ({ item }: { item: any }) => {
  // 1. זיהוי אם זה אני: userName חייב להגיע מ-route.params
  const isMyPost = item.author === userName; 

  return (
    // messageWrapper גורם לכל הבועה לזוז ימינה (flex-end) או שמאלה (flex-start)
    <View style={[
      styles.messageWrapper, 
      isMyPost ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }
    ]}>
      
      {/* הבועה עצמה */}
      <View style={[
        styles.bubble, 
        isMyPost ? styles.myBubble : styles.theirBubble
      ]}>
        
        {/* נקודה 1: שם השולח מעל התמונה */}
        <Text style={[
          styles.authorName, 
          { textAlign: isMyPost ? 'right' : 'left' }
        ]}>
          {isMyPost ? "אני" : (item.author || "חבר קבוצה")}
        </Text>

        {/* תמונה */}
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
        )}

        {/* תיאור הפוסט */}
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
          {/* כוכב מנצנץ אם יש מסר סודי */}
          {item.secretMessage && (isMyPost || item.secretRecipients?.includes(userName)) && (
            <SparklingStar onExtract={() => Alert.alert("מסר סודי", item.secretMessage)} />
          )}
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <Text style={styles.timeText}>
          {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
        </Text>
      </View>
    </View>
  );
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{groupName}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>אין עדיין הודעות בקבוצה...</Text> : null}
      />

      {/* שורת קלט מעוצבת */}
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.fakeInput} 
          onPress={() => navigation.navigate('CreatePost', { 
            target: 'group', groupId, groupName, userName 
          })}
        >
          <Text style={styles.plusIcon}>+</Text>
          <Text style={styles.placeholderText}>הוסף פוסט או מסר סודי...</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
  container: { flex: 1, backgroundColor: '#E5DDD5' },
  header: { padding: 15, backgroundColor: '#075E54', alignItems: 'center', paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  listContent: { padding: 10 },
  
  messageWrapper: { flexDirection: 'row', marginBottom: 8, width: '100%' },
  myMessage: { justifyContent: 'flex-end' },
  theirMessage: { justifyContent: 'flex-start' },

  bubble: { maxWidth: width * 0.8, padding: 6, borderRadius: 8, elevation: 1 },
  myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 0 },
  theirBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 0 },

  authorName: { fontSize: 13, fontWeight: 'bold', marginBottom: 4, textAlign: 'right' },
  myAuthorName: { color: '#075E54' },
  theirAuthorName: { color: '#128C7E' },

  postImage: { width: width * 0.73, height: 220, borderRadius: 6, marginBottom: 5 },
  
  contentRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'flex-start' },
  description: { fontSize: 16, color: '#333', textAlign: 'right', flexShrink: 1 },
  
  starContainer: { marginLeft: 8 },
  starEmoji: { fontSize: 22 },

  timeText: { fontSize: 10, color: '#888', textAlign: 'left', marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 100, color: '#666' },

  inputContainer: { position: 'absolute', bottom: 15, width: '100%', paddingHorizontal: 10 },
  fakeInput: { 
    flexDirection: 'row-reverse', backgroundColor: '#fff', borderRadius: 25, 
    height: 50, alignItems: 'center', paddingHorizontal: 15, elevation: 3 
  },
  plusIcon: { fontSize: 30, color: '#075E54', marginLeft: 10 },
  placeholderText: { color: '#999', fontSize: 16, textAlign: 'right', flex: 1 }
});

export default GroupDetailsScreen;