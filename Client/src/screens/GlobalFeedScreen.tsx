// // // import React, { useState, useCallback } from 'react';
// // // import { 
// // //   View, Text, FlatList, Image, StyleSheet, 
// // //   SafeAreaView, TouchableOpacity, Alert, ActivityIndicator 
// // // } from 'react-native';
// // // import { useFocusEffect } from '@react-navigation/native';
// // // import { BASE_URL } from '../api/Constants';

// // // const GlobalFeedScreen = ({ route }: any) => {
// // //   // --- שליפה דינמית של שם המשתמש מהפרמטרים של הניווט ---
// // //   // אם אין שם משתמש בפרמטרים, נשים מחרוזת ריקה כדי שלא יקרוס
// // //   const { userName } = route.params || {}; 
  
// // //   const [posts, setPosts] = useState<any[]>([]);
// // //   const [loading, setLoading] = useState(true);

// // //   const fetchAllPosts = async () => {
// // //   setLoading(true);
// // //   try {
// // //     const response = await fetch(`${BASE_URL}/posts/all`); 
// // //     const data = await response.json();
    
// // //     // בדיקה שקיבלנו מערך לפני שמנסים למיין (sort)
// // //     if (data && Array.isArray(data)) {
// // //       const sorted = data.sort((a, b) => 
// // //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
// // //       );
// // //       setPosts(sorted);
// // //     } else {
// // //       console.log("השרת לא החזיר מערך פוסטים תקין");
// // //       setPosts([]);
// // //     }
// // //   } catch (error) {
// // //     console.error("שגיאה בשליפה:", error);
// // //     setPosts([]);
// // //   } finally {
// // //     setLoading(false);
// // //   }
// // // };

// // //   useFocusEffect(useCallback(() => { fetchAllPosts(); }, []));

// // //   const renderPost = ({ item }: { item: any }) => {
// // //     // בדיקה דינמית: האם ב-Map של userMessages יש מפתח שזהה ל-userName ששלפנו?
// // //     const mySecretMessage = item.userMessages && userName ? item.userMessages[userName] : null;

// // //     return (
// // //       <View style={styles.card}>
// // //         <View style={styles.cardHeader}>
// // //           <View style={styles.authorInfo}>
// // //              <View style={styles.avatar}><Text style={{color:'#fff'}}>👤</Text></View>
// // //              <View>
// // //                 <Text style={styles.userName}>{item.author}</Text>
// // //                 <Text style={styles.timestamp}>
// // //                    {item.target === 'world' ? '🌐 פיד גלובלי' : '👥 קבוצה'}
// // //                 </Text>
// // //              </View>
// // //           </View>
// // //         </View>
        
// // //         {item.imageUrl && (
// // //           <Image source={{ uri: item.imageUrl }} style={styles.image} />
// // //         )}
        
// // //         <View style={styles.cardFooter}>
// // //           <View style={styles.descriptionRow}>
// // //              {/* הכוכב יופיע רק אם נמצאה התאמה לשם המשתמש הדינמי */}
// // //              {mySecretMessage && (
// // //               <TouchableOpacity 
// // //                 style={styles.starCircle}
// // //                 onPress={() => Alert.alert("✨ מסר סודי במיוחד עבורך", mySecretMessage)}
// // //               >
// // //                 <Text style={{fontSize: 24}}>⭐</Text>
// // //               </TouchableOpacity>
// // //             )}
// // //             <Text style={styles.description}>{item.description}</Text>
// // //           </View>
// // //         </View>
// // //       </View>
// // //     );
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <View style={styles.header}>
// // //         <Text style={styles.headerTitle}>הפיד של כולם</Text>
// // //         <Text style={styles.subHeader}>מחובר כ: {userName || 'אורח'}</Text>
// // //       </View>

// // //       {loading ? (
// // //         <ActivityIndicator size="large" color="#075E54" style={{marginTop: 50}} />
// // //       ) : (
// // //         <FlatList
// // //           data={posts}
// // //           keyExtractor={(item) => item.id}
// // //           renderItem={renderPost}
// // //           contentContainerStyle={{ paddingBottom: 20 }}
// // //           ListEmptyComponent={<Text style={styles.empty}>אין פוסטים להצגה</Text>}
// // //         />
// // //       )}
// // //     </SafeAreaView>
// // //   );
// // // };

// // // // ... Styles (נשארים אותו דבר כמו הקוד הקודם שאהבת)
// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#E5DDD5' },
// // //   header: { backgroundColor: '#075E54', padding: 15, alignItems: 'center' },
// // //   headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
// // //   subHeader: { color: '#DCF8C6', fontSize: 12 },
// // //   card: { backgroundColor: '#fff', margin: 10, borderRadius: 12, elevation: 3, overflow: 'hidden' },
// // //   cardHeader: { padding: 10, flexDirection: 'row-reverse', alignItems: 'center' },
// // //   authorInfo: { flexDirection: 'row-reverse', alignItems: 'center' },
// // //   avatar: { width: 35, height: 35, borderRadius: 20, backgroundColor: '#128C7E', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
// // //   userName: { fontWeight: 'bold', fontSize: 16 },
// // //   timestamp: { fontSize: 11, color: '#888' },
// // //   image: { width: '100%', height: 300, resizeMode: 'cover' },
// // //   cardFooter: { padding: 15 },
// // //   descriptionRow: { flexDirection: 'row-reverse', alignItems: 'center' },
// // //   description: { textAlign: 'right', fontSize: 16, flex: 1 },
// // //   starCircle: { backgroundColor: '#FFF9C4', padding: 8, borderRadius: 25, marginLeft: 10, borderWidth: 1, borderColor: '#FFD700' },
// // //   empty: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#999' }
// // // });

// // // export default GlobalFeedScreen;
// // import React, { useState, useCallback, useRef } from 'react';
// // import { 
// //   View, Text, FlatList, Image, StyleSheet, 
// //   SafeAreaView, TouchableOpacity, ActivityIndicator,
// //   Alert // <--- תוסיף את המילה הזו כאן
// // } from 'react-native'; 
// // import { useFocusEffect } from '@react-navigation/native';
// // import { BASE_URL } from '../api/Constants';

// // const GlobalFeedScreen = ({ route }: any) => {
// //   const { userName } = route.params || {};
// //   const [posts, setPosts] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const flatListRef = useRef<FlatList>(null);

// //   const fetchAllPosts = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await fetch(`${BASE_URL}/posts/all`);
// //       const data = await response.json();

// //       if (data && Array.isArray(data)) {
// //         // מיון: הישן ביותר למעלה, החדש ביותר למטה
// //         const sorted = data.sort((a, b) => 
// //           new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
// //         );
// //         setPosts(sorted);
// //       }
// //     } catch (error) {
// //       console.error("Fetch error:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useFocusEffect(useCallback(() => { fetchAllPosts(); }, []));

// //   // פונקציה לעיצוב תאריך ושעה
// //   const formatDateTime = (dateStr: string) => {
// //     if (!dateStr) return "";
// //     const d = new Date(dateStr);
// //     return `${d.toLocaleDateString('he-IL')} | ${d.toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}`;
// //   };

// //   const renderPost = ({ item }: { item: any }) => {
// //     const mySecretMessage = item.userMessages && userName ? item.userMessages[userName] : null;

// //     return (
// //       <View style={styles.postContainer}>
// //         <View style={styles.card}>
// //           {/* תמונה מוקטנת ואלגנטית */}
// //           {item.imageUrl && (
// //             <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
// //           )}

// //           <View style={styles.contentArea}>
// //             <View style={styles.topRow}>
// //               <Text style={styles.authorName}>{item.author}</Text>
// //               <Text style={styles.dateText}>{formatDateTime(item.createdAt)}</Text>
// //             </View>

// //             <Text style={styles.descriptionText} numberOfLines={2}>
// //               {item.description}
// //             </Text>

// //             {mySecretMessage && (
// //               <TouchableOpacity 
// //                 style={styles.secretBadge}
// //                 onPress={() => Alert.alert("✨ מסר פרטי", mySecretMessage)}
// //               >
// //                 <Text style={styles.secretText}>⭐ יש לך הודעה</Text>
// //               </TouchableOpacity>
// //             )}
// //           </View>
// //         </View>
// //       </View>
// //     );
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <View style={styles.glassHeader}>
// //         <Text style={styles.headerTitle}>העולם ברגע זה</Text>
// //       </View>

// //       {loading ? (
// //         <ActivityIndicator size="large" color="#6200EE" style={{ flex: 1 }} />
// //       ) : (
// //         <FlatList
// //           ref={flatListRef}
// //           data={posts}
// //           keyExtractor={(item) => item.id}
// //           renderItem={renderPost}
// //           contentContainerStyle={styles.listContent}
// //           onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
// //           onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
// //         />
// //       )}
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#F0F2F5' },
// //   glassHeader: { 
// //     padding: 20, 
// //     backgroundColor: '#fff', 
// //     borderBottomWidth: 1, 
// //     borderBottomColor: '#E0E0E0',
// //     alignItems: 'center',
// //     elevation: 3
// //   },
// //   headerTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', letterSpacing: 0.5 },
// //   listContent: { padding: 12 },
// //   postContainer: { marginBottom: 15 },
// //   card: { 
// //     backgroundColor: '#fff', 
// //     borderRadius: 15, 
// //     flexDirection: 'row-reverse', // עיצוב מודרני אופקי
// //     overflow: 'hidden',
// //     elevation: 4,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   postImage: { width: 100, height: 100, borderRadius: 10, margin: 8 },
// //   contentArea: { flex: 1, padding: 12, justifyContent: 'space-between' },
// //   topRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
// //   authorName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
// //   dateText: { fontSize: 10, color: '#999' },
// //   descriptionText: { fontSize: 14, color: '#444', textAlign: 'right', marginTop: 4 },
// //   secretBadge: { 
// //     backgroundColor: '#FFF9C4', 
// //     alignSelf: 'flex-end', 
// //     paddingHorizontal: 8, 
// //     paddingVertical: 4, 
// //     borderRadius: 8,
// //     marginTop: 8,
// //     borderWidth: 1,
// //     borderColor: '#FFD700'
// //   },
// //   secretText: { fontSize: 11, fontWeight: '700', color: '#B8860B' }
// // });

// // export default GlobalFeedScreen;
// import React, { useState, useCallback, useRef } from 'react';
// import { 
//   View, Text, FlatList, Image, StyleSheet, 
//   SafeAreaView, TouchableOpacity, ActivityIndicator, Alert 
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { BASE_URL } from '../api/Constants';

// // הוספנו את navigation למאפיינים (Props)
// const GlobalFeedScreen = ({ route, navigation }: any) => {
//   const { userName } = route.params || {};
//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const flatListRef = useRef<FlatList>(null);

//   const fetchAllPosts = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${BASE_URL}/posts/all`);
//       const data = await response.json();
//       if (data && Array.isArray(data)) {
//         // מיון: חדש ביותר למטה
//         const sorted = data.sort((a, b) => 
//           new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//         );
//         setPosts(sorted);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(useCallback(() => { fetchAllPosts(); }, []));

//   const formatDateTime = (dateStr: string) => {
//     if (!dateStr) return "";
//     const d = new Date(dateStr);
//     return `${d.toLocaleDateString('he-IL')} | ${d.toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}`;
//   };

//   const renderPost = ({ item }: { item: any }) => {
//     const mySecretMessage = item.userMessages && userName ? item.userMessages[userName] : null;

//     return (
//       <TouchableOpacity 
//         activeOpacity={0.9}
//         style={styles.postContainer}
//         // לחיצה מעבירה למסך פרטים ושולחת את אובייקט הפוסט ואת שם המשתמש
//         onPress={() => navigation.navigate('PostDetails', { post: item, userName })}
//       >
//         <View style={styles.card}>
//           {item.imageUrl && (
//             <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
//           )}

//           <View style={styles.contentArea}>
//             <View style={styles.topRow}>
//               <Text style={styles.authorName}>{item.author}</Text>
//               <Text style={styles.dateText}>{formatDateTime(item.createdAt)}</Text>
//             </View>

//             <Text style={styles.descriptionText} numberOfLines={2}>
//               {item.description}
//             </Text>

//             <View style={styles.cardFooter}>
//                <Text style={styles.commentLink}>💬 לחץ לצפייה ותגובות...</Text>
//                {mySecretMessage && (
//                 <View style={styles.secretBadge}>
//                   <Text style={styles.secretText}>⭐ הודעה עבורך</Text>
//                 </View>
//               )}
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>הפיד העולמי</Text>
//         <Text style={styles.subHeader}>שלום, {userName}</Text>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />
//       ) : (
//         <FlatList
//           ref={flatListRef}
//           data={posts}
//           keyExtractor={(item) => item.id}
//           renderItem={renderPost}
//           contentContainerStyle={styles.listContent}
//           onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8F9FA' },
//   header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
//   headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
//   subHeader: { fontSize: 12, color: '#666' },
//   listContent: { padding: 12 },
//   postContainer: { marginBottom: 15 },
//   card: { 
//     backgroundColor: '#fff', borderRadius: 16, flexDirection: 'row-reverse', 
//     overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8,
//   },
//   postImage: { width: 110, height: 110, borderRadius: 12, margin: 10 },
//   contentArea: { flex: 1, padding: 12, justifyContent: 'space-between' },
//   topRow: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
//   authorName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
//   dateText: { fontSize: 10, color: '#999' },
//   descriptionText: { fontSize: 14, color: '#555', textAlign: 'right', marginVertical: 5 },
//   cardFooter: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
//   commentLink: { fontSize: 11, color: '#007AFF', fontWeight: '600' },
//   secretBadge: { backgroundColor: '#FFF9C4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
//   secretText: { fontSize: 10, color: '#B8860B', fontWeight: 'bold' }
// });

// export default GlobalFeedScreen;
import React, { useState, useCallback, useRef } from 'react';
import { 
  View, Text, FlatList, Image, StyleSheet, 
  SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, Animated 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../api/Constants';

const GlobalFeedScreen = ({ route, navigation }: any) => {
  const { userName } = route.params || {};
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  // אנימציה לכוכבים בפיד
  const starAnim = useRef(new Animated.Value(1)).current;

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/posts/all`);
      const data = await response.json();
      if (data && Array.isArray(data)) {
        // מיון: חדש ביותר למטה (כמו צ'אט)
        const sorted = data.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setPosts(sorted);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { 
    fetchAllPosts(); 
    // התחלת אנימציית פעימה לכוכבים
    Animated.loop(
      Animated.sequence([
        Animated.timing(starAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(starAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []));

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.toLocaleDateString('he-IL')} | ${d.toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}`;
  };

  const renderPost = ({ item }: { item: any }) => {
    const mySecretMessage = item.userMessages && userName ? item.userMessages[userName] : null;

    return (
      <View style={styles.postWrapper}>
        <TouchableOpacity 
          activeOpacity={0.9}
          style={styles.card}
          onPress={() => navigation.navigate('PostDetails', { post: item, userName })}
        >
          {/* תמונת הפוסט בריבוע פסטל מעוגל */}
          {item.imageUrl && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
            </View>
          )}

          <View style={styles.contentArea}>
            <View style={styles.topRow}>
              <Text style={styles.authorName}>{item.author}</Text>
              <Text style={styles.dateText}>{formatDateTime(item.createdAt)}</Text>
            </View>

            <Text style={styles.descriptionText} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.cardFooter}>
               <Text style={styles.commentLink}>💬 צפייה בשיחה...</Text>
               
               {/* כוכב הודעה מוצפנת - גדול ומרשים */}
               {mySecretMessage && (
                <TouchableOpacity 
                  onPress={() => Alert.alert(
                    "🔐 הודעה מפוענחת (AES-256)", 
                    mySecretMessage,
                    [{ text: "הבנתי", style: "cancel" }]
                  )}
                >
                  <Animated.View style={[styles.secretBadge, { transform: [{ scale: starAnim }] }]}>
                    <Text style={styles.secretText}>⭐ יש לך הודעה!</Text>
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* לוגו STEGOSHARE בראש הפיד */}
      <View style={styles.header}>
        <Text style={styles.logoText}>STEGO<Text style={{color: '#6366F1'}}>SHARE</Text></Text>
        <Text style={styles.subHeader}>העולם ברגע זה • {userName}</Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loaderText}>מפענח פיד גלובלי...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={<Text style={styles.emptyText}>הפיד ריק כרגע, שתף משהו מוצפן! 🛡️</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF' },
  
  // Header ממותג
  header: { 
    paddingVertical: 15, 
    backgroundColor: '#FFF', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9',
    elevation: 2 
  },
  logoText: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: 1 },
  subHeader: { fontSize: 13, color: '#94A3B8', fontWeight: '600', marginTop: 2 },

  listContent: { padding: 16, paddingBottom: 30 },
  postWrapper: { marginBottom: 20 },
  
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 30, 
    flexDirection: 'row-reverse', 
    overflow: 'hidden', 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },

  imageContainer: { padding: 10 },
  postImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 22, 
    backgroundColor: '#E0F2FE' // צבע פסטל למקרה שהתמונה נטענת
  },

  contentArea: { flex: 1, padding: 15, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  
  authorName: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  dateText: { fontSize: 11, color: '#CBD5E1' },
  
  descriptionText: { 
    fontSize: 16, 
    color: '#475569', 
    textAlign: 'right', 
    marginVertical: 8,
    lineHeight: 22 
  },

  cardFooter: { 
    flexDirection: 'row-reverse', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 5
  },

  commentLink: { fontSize: 13, color: '#6366F1', fontWeight: '800' },

  // עיצוב הכוכב וההודעה המוצפנת
  secretBadge: { 
    backgroundColor: '#FFFEEB', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FEF08A',
    flexDirection: 'row',
    alignItems: 'center'
  },
  secretText: { fontSize: 12, color: '#B45309', fontWeight: '900' },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 10, color: '#6366F1', fontWeight: '700' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#94A3B8' }
});

export default GlobalFeedScreen;