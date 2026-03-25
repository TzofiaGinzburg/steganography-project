// // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // import { 
// // //   View, Text, FlatList, Image, StyleSheet, 
// // //   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity,
// // //   SafeAreaView, StatusBar, Alert
// // // } from 'react-native';
// // // import { useFocusEffect } from '@react-navigation/native';
// // // import { BASE_URL } from '../api/Constants';

// // // const { width } = Dimensions.get('window');

// // // const GroupDetailsScreen = ({ route, navigation }: any) => {
// // //   const { groupId, groupName, userName } = route.params;
// // //   const [posts, setPosts] = useState<any[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const flatListRef = useRef<FlatList>(null); 
// // //   const [isDecrypting, setIsDecrypting] = useState(false);// רפרנס כדי לשלוט בגלילה

// // //   const fetchPosts = async () => {
// // //     try {
// // //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// // //       const data = await response.json();
      
// // //       if (Array.isArray(data)) {
// // //         // מיון: הישן ביותר ראשון, החדש ביותר אחרון (כדי שיהיה בתחתית)
// // //         const sortedData = data.sort((a, b) => 
// // //           new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
// // //         );
// // //         setPosts(sortedData);
// // //       }
// // //     } catch (error) {
// // //       console.error("Error fetching posts:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useFocusEffect(
// // //     useCallback(() => {
// // //       fetchPosts();
// // //     }, [groupId])
// // //   );

// // //   // פונקציה שקופצת לסוף הרשימה כשהנתונים משתנים
// // //   const handleContentSizeChange = () => {
// // //     if (posts.length > 0) {
// // //       flatListRef.current?.scrollToEnd({ animated: false });
// // //     }
// // //   };
// // // const handleDecrypt = async (post: any) => {
// // //   setIsDecrypting(true);
// // //   try {
// // //     const response = await fetch(`${BASE_URL}/posts/${post.id}/decrypt?userName=${userName}`);
// // //     const data = await response.json();

// // //     if (data.secret) {
// // //       Alert.alert(
// // //         "🔓 חילוץ מדעי מהפיקסלים הושלם",
// // //         `המסר: ${data.secret}\n\n` +
// // //         `🔬 אלגוריתם: ${post.chosenAlgorithm}\n` + // יגיע מה-DB
// // //         `📊 איכות (PSNR): ${post.psnr.toFixed(2)} dB\n` +
// // //         `🔗 דמיון (SSIM): ${post.ssim.toFixed(4)}\n` +
// // //         `🌀 אנטרופיה: ${post.entropy.toFixed(4)}\n` +
// // //         `📐 צפיפות קצוות: ${post.edgeDensity.toFixed(2)}%\n` +
// // //         `📦 יעילות (BPP): ${post.bpp.toFixed(4)}`,
// // //         [{ text: "סגור" }]
// // //       );
// // //     }
// // //   } catch (e) {
// // //     Alert.alert("שגיאה", "נכשל החילוץ מהשרת");
// // //   } finally {
// // //     setIsDecrypting(false);
// // //   }
// // // };
// // //   const renderPost = ({ item }: { item: any }) => {
// // //     const isMyPost = item.author === userName;
// // //     const mySecretMessage = item.userMessages && userName ? item.userMessages[userName] : null;
    
// // //     const dateObj = new Date(item.createdAt);
// // //     const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // //     const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

// // //     return (
// // //       <TouchableOpacity 
// // //         activeOpacity={0.9}
// // //         onPress={() => navigation.navigate('PostDetails', { post: item, userName })}
// // //         style={styles.postWrapper}
// // //       >
// // //         <View style={[styles.modernCard, isMyPost ? styles.myCardBg : styles.theirCardBg]}>
          
// // //           {/* ימין: תמונה */}
// // //           {item.imageUrl && (
// // //             <View style={styles.imageSection}>
// // //               <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
// // //               {isMyPost && <View style={styles.myBadge}><Text style={styles.myBadgeText}>שלי</Text></View>}
// // //             </View>
// // //           )}

// // //           {/* שמאל: תוכן */}
// // //           <View style={styles.contentSection}>
// // //             <View style={styles.topRow}>
// // //               <Text style={[styles.authorName, { color: isMyPost ? '#075E54' : '#E91E63' }]}>
// // //                 {isMyPost ? "אני" : item.author}
// // //               </Text>
// // //               <View style={styles.dateTimeContainer}>
// // //                 <Text style={styles.dateTimeText}>{timeStr} | {dateStr}</Text>
// // //               </View>
// // //             </View>

// // //             <View style={styles.descriptionArea}>
// // //               <Text style={styles.descriptionText} numberOfLines={3}>
// // //                 {item.description}
// // //               </Text>
// // //              {mySecretMessage && (
// // //   <TouchableOpacity 
// // //     style={styles.starButton}
// // //     onPress={() => handleDecrypt(item)}
// // //     disabled={isDecrypting} // מונע לחיצות כפולות
// // //   >
// // //     {isDecrypting ? (
// // //       <ActivityIndicator size="small" color="#FFD700" />
// // //     ) : (
// // //       <Text style={{fontSize: 18}}>⭐</Text>
// // //     )}
// // //   </TouchableOpacity>
// // // )}
// // //             </View>

// // //             <View style={styles.footerRow}>
// // //               <Text style={styles.actionText}>💬 תגובות ופירוט</Text>
// // //               {isMyPost && <Text style={styles.blueTicks}>✔️✔️</Text>}
// // //             </View>
// // //           </View>
// // //         </View>
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <StatusBar barStyle="light-content" backgroundColor="#075E54" />
      
// // //       <View style={styles.header}>
// // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
// // //           <Text style={styles.backBtnText}>➜</Text>
// // //         </TouchableOpacity>
// // //         <View style={styles.headerInfo}>
// // //           <Text style={styles.headerTitle}>{groupName}</Text>
// // //           <Text style={styles.headerSubtitle}>{posts.length} פוסטים</Text>
// // //         </View>
// // //       </View>

// // //       <FlatList
// // //         ref={flatListRef}
// // //         data={posts}
// // //         keyExtractor={(item) => item.id.toString()}
// // //         renderItem={renderPost}
// // //         contentContainerStyle={styles.listPadding}
// // //         onContentSizeChange={handleContentSizeChange} // קופץ לסוף כשהרשימה נטענת
// // //         onLayout={handleContentSizeChange} // קופץ לסוף בפתיחה
// // //         refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
// // //         ListEmptyComponent={!loading ? <Text style={styles.emptyText}>אין הודעות...</Text> : null}
// // //       />

// // //       {/* Footer למטה */}
// // //       <View style={styles.footerContainer}>
// // //         <TouchableOpacity style={styles.micBtn}>
// // //           <Text style={{fontSize: 24}}>🎙️</Text>
// // //         </TouchableOpacity>
// // //         <TouchableOpacity 
// // //           style={styles.inputBox}
// // //           onPress={() => navigation.navigate('CreatePost', { target: 'group', groupId, groupName, userName })}
// // //         >
// // //           <Text style={styles.inputText}>כתוב משהו לקבוצה...</Text>
// // //           <Text style={{fontSize: 20}}>📷</Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#E5DDD5' },
// // //   header: { height: 70, backgroundColor: '#075E54', flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 20 },
// // //   headerInfo: { flex: 1, marginRight: 15 },
// // //   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'right' },
// // //   headerSubtitle: { color: '#A0D3C1', fontSize: 12, textAlign: 'right' },
// // //   backBtn: { padding: 5 },
// // //   backBtnText: { color: '#fff', fontSize: 24 },

// // //   listPadding: { padding: 12, paddingBottom: 20 },
// // //   postWrapper: { marginBottom: 12 },
// // //   modernCard: { flexDirection: 'row-reverse', borderRadius: 15, overflow: 'hidden', elevation: 3, backgroundColor: '#fff' },
// // //   myCardBg: { backgroundColor: '#E7FFDB' },
// // //   theirCardBg: { backgroundColor: '#FFFFFF' },

// // //   imageSection: { width: 100, height: 100 },
// // //   postImage: { width: '100%', height: '100%' },
// // //   myBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: '#075E54', paddingHorizontal: 6, borderRadius: 8 },
// // //   myBadgeText: { color: '#fff', fontSize: 9 },

// // //   contentSection: { flex: 1, padding: 10, justifyContent: 'space-between' },
// // //   topRow: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
// // //   authorName: { fontSize: 14, fontWeight: 'bold' },
// // //   dateTimeText: { fontSize: 10, color: '#888' },

// // //   descriptionArea: { flexDirection: 'row-reverse', alignItems: 'center', marginVertical: 5 },
// // //   descriptionText: { flex: 1, fontSize: 14, color: '#444', textAlign: 'right' },
// // //   starButton: { backgroundColor: '#FFF', borderRadius: 20, padding: 3, marginLeft: 5, borderWidth: 1, borderColor: '#FFD700' },

// // //   footerRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: '#EEE', paddingTop: 5 },
// // //   actionText: { fontSize: 11, color: '#777', fontWeight: '600' },
// // //   blueTicks: { color: '#34B7F1', fontSize: 12 },
// // // dateTimeContainer: {
// // //   flexDirection: 'row',
// // //   alignItems: 'center',
// // // },
// // //   footerContainer: { flexDirection: 'row', padding: 10, alignItems: 'center', backgroundColor: 'transparent' },
// // //   inputBox: { flex: 1, height: 50, backgroundColor: '#FFF', borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, elevation: 3 },
// // //   inputText: { flex: 1, textAlign: 'right', color: '#999', marginRight: 10 },
// // //   micBtn: { width: 50, height: 50, backgroundColor: '#075E54', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
// // //   emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
// // // });

// // // export default GroupDetailsScreen;
// // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // import { 
// //   View, Text, FlatList, Image, StyleSheet, Modal,
// //   ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity,
// //   SafeAreaView, StatusBar, Alert
// // } from 'react-native';
// // import { useFocusEffect } from '@react-navigation/native';
// // import { BASE_URL } from '../api/Constants';

// // const GroupDetailsScreen = ({ route, navigation }: any) => {
// //   const { groupId, groupName, userName } = route.params;
// //   const [posts, setPosts] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [isDecrypting, setIsDecrypting] = useState(false);
// //   const [heatmapVisible, setHeatmapVisible] = useState(false);
// //   const [currentHeatmapUrl, setCurrentHeatmapUrl] = useState<string | null>(null);
// //   const flatListRef = useRef<FlatList>(null);

// //   const fetchPosts = async () => {
// //     try {
// //       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
// //       const data = await response.json();
// //       if (Array.isArray(data)) {
// //         const sorted = data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
// //         setPosts(sorted);
// //       }
// //     } catch (e) { console.error(e); } finally { setLoading(false); }
// //   };

// //   useFocusEffect(useCallback(() => { fetchPosts(); }, [groupId]));

// //   const handleDecrypt = async (post: any) => {
// //     setIsDecrypting(true);
// //     try {
// //       const res = await fetch(`${BASE_URL}/posts/${post.id}/decrypt?userName=${userName}`);
// //       const data = await res.json();
// //       if (data.secret) {
// //         Alert.alert(
// //           "🔓 חילוץ מדעי הושלם",
// //           `המסר: ${data.secret}\n\n` +
// //           `📊 PSNR: ${post.psnr.toFixed(2)} dB\n` +
// //           `🌀 אנטרופיה: ${post.entropy.toFixed(4)}`,
// //           [
// //             { text: "סגור", style: "cancel" },
// //             { text: "🔥 הצג מפת חום", onPress: () => {
// //               setCurrentHeatmapUrl(post.heatmapUrl);
// //               setHeatmapVisible(true);
// //             }}
// //           ]
// //         );
// //       }
// //     } catch (e) { Alert.alert("שגיאה", "נכשל החילוץ"); } finally { setIsDecrypting(false); }
// //   };

// //   const renderPost = ({ item }: { item: any }) => {
// //     const isMyPost = item.author === userName;
    
// //     // בדיקת מסר עבורי (Case Insensitive)
// //     const messageKeys = item.userMessages ? Object.keys(item.userMessages) : [];
// //     const myNameKey = messageKeys.find(k => k.toLowerCase() === userName.toLowerCase());
// //     const hasSecret = !!myNameKey;

// //     return (
// //       <View style={styles.postWrapper}>
// //         <View style={[styles.modernCard, isMyPost ? styles.myCardBg : styles.theirCardBg]}>
// //           {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.postImage} />}
// //           <View style={styles.contentSection}>
// //             <Text style={styles.authorName}>{isMyPost ? "אני" : item.author}</Text>
// //             <Text style={styles.descriptionText}>{item.description}</Text>
            
// //             {hasSecret && (
// //               <TouchableOpacity style={styles.starButton} onPress={() => handleDecrypt(item)}>
// //                 <Text style={{fontSize: 20}}>⭐</Text>
// //               </TouchableOpacity>
// //             )}
// //           </View>
// //         </View>
// //       </View>
// //     );
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <FlatList
// //         ref={flatListRef}
// //         data={posts}
// //         renderItem={renderPost}
// //         keyExtractor={(item) => item.id.toString()}
// //         refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
// //       />

// //       {/* מודל מפת חום */}
// //       <Modal visible={heatmapVisible} transparent={true} animationType="fade">
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalTitle}>🔥 מפת חשיפת פיקסלים</Text>
// //             {currentHeatmapUrl && <Image source={{ uri: currentHeatmapUrl }} style={styles.heatmapImg} resizeMode="contain" />}
// //             <TouchableOpacity style={styles.closeBtn} onPress={() => setHeatmapVisible(false)}>
// //               <Text style={{color: '#fff'}}>סגור</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>

// //       <View style={styles.footerContainer}>
// //         <TouchableOpacity 
// //           style={styles.inputBox}
// //           onPress={() => navigation.navigate('CreatePost', { target: 'group', groupId, groupName, userName })}
// //         >
// //           <Text>שלח תמונה מוצפנת...</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#E5DDD5' },
// //   postWrapper: { padding: 10 },
// //   modernCard: { flexDirection: 'row-reverse', backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' },
// //   myCardBg: { backgroundColor: '#E7FFDB' },
// //   theirCardBg: { backgroundColor: '#fff' },
// //   postImage: { width: 100, height: 100 },
// //   contentSection: { flex: 1, padding: 10 },
// //   authorName: { fontWeight: 'bold', textAlign: 'right' },
// //   descriptionText: { textAlign: 'right', marginTop: 5 },
// //   starButton: { alignSelf: 'flex-start', padding: 5, borderColor: '#FFD700', borderRadius: 20 },
// //   footerContainer: { padding: 10, backgroundColor: '#fff' },
// //   inputBox: { height: 50, backgroundColor: '#eee', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
// //   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
// //   modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center' },
// //   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
// //   heatmapImg: { width: '100%', height: 300 },
// //   closeBtn: { marginTop: 15, backgroundColor: '#075E54', padding: 10, borderRadius: 10 }
// // });

// // export default GroupDetailsScreen;
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { 
//   View, Text, FlatList, Image, StyleSheet, Modal,
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
//   const [isDecrypting, setIsDecrypting] = useState(false);
//   const [heatmapVisible, setHeatmapVisible] = useState(false);
//   const [currentHeatmapUrl, setCurrentHeatmapUrl] = useState<string | null>(null);
//   const flatListRef = useRef<FlatList>(null);

//   const fetchPosts = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
//       const data = await response.json();
      
//       if (Array.isArray(data)) {
//         // מיון: ישן למעלה, חדש למטה
//         const sortedData = data.sort((a, b) => 
//           new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//         );
//         setPosts(sortedData);
//       }
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

//   const handleContentSizeChange = () => {
//     if (posts.length > 0) {
//       flatListRef.current?.scrollToEnd({ animated: false });
//     }
//   };

//   const handleDecrypt = async (post: any) => {
//     setIsDecrypting(true);
//     try {
//       const response = await fetch(`${BASE_URL}/posts/${post.id}/decrypt?userName=${userName}`);
//       const data = await response.json();

//       if (data.secret) {
//         Alert.alert(
//           "🔓 חילוץ מדעי מהפיקסלים הושלם",
//           `המסר: ${data.secret}\n\n` +
//           `🔬 אלגוריתם: ${post.chosenAlgorithm || 'Dynamic Stegano'}\n` +
//           `📊 איכות (PSNR): ${post.psnr?.toFixed(2)} dB\n` +
//           `🔗 דמיון (SSIM): ${post.ssim?.toFixed(4)}\n` +
//           `🌀 אנטרופיה: ${post.entropy?.toFixed(4)}\n` +
//           `📐 צפיפות קצוות: ${post.edgeDensity?.toFixed(2)}%\n` +
//           `📦 יעילות (BPP): ${post.bpp?.toFixed(4)}`,
//           [
//             { text: "סגור", style: "cancel" },
//             { 
//               text: "🔥 הצג מפת חום", 
//               onPress: () => {
//                 setCurrentHeatmapUrl(post.heatmapUrl);
//                 setHeatmapVisible(true);
//               } 
//             }
//           ]
//         );
//       }
//     } catch (e) {
//       Alert.alert("שגיאה", "נכשל החילוץ מהשרת");
//     } finally {
//       setIsDecrypting(false);
//     }
//   };

//   const renderPost = ({ item }: { item: any }) => {
//     const isMyPost = item.author === userName;
    
//     // לוגיקה חדשה: בדיקת מסר Case-Insensitive
//     const messageKeys = item.userMessages ? Object.keys(item.userMessages) : [];
//     const myNameKey = messageKeys.find(k => k.toLowerCase() === userName?.toLowerCase());
//     const hasSecret = !!myNameKey;

//     const dateObj = new Date(item.createdAt);
//     const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

//     return (
//       <TouchableOpacity 
//         activeOpacity={0.9}
//         onPress={() => navigation.navigate('PostDetails', { post: item, userName })}
//         style={styles.postWrapper}
//       >
//         <View style={[styles.modernCard, isMyPost ? styles.myCardBg : styles.theirCardBg]}>
          
//           {/* תמונה */}
//           {item.imageUrl && (
//             <View style={styles.imageSection}>
//               <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
//               {isMyPost && <View style={styles.myBadge}><Text style={styles.myBadgeText}>שלי</Text></View>}
//             </View>
//           )}

//           {/* תוכן הפוסט */}
//           <View style={styles.contentSection}>
//             <View style={styles.topRow}>
//               <Text style={[styles.authorName, { color: isMyPost ? '#075E54' : '#E91E63' }]}>
//                 {isMyPost ? "אני" : item.author}
//               </Text>
//               <View style={styles.dateTimeContainer}>
//                 <Text style={styles.dateTimeText}>{timeStr} | {dateStr}</Text>
//               </View>
//             </View>

//             <View style={styles.descriptionArea}>
//               <Text style={styles.descriptionText} numberOfLines={3}>
//                 {item.description}
//               </Text>
              
//               {hasSecret && (
//                 <TouchableOpacity 
//                   style={styles.starButton}
//                   onPress={() => handleDecrypt(item)}
//                   disabled={isDecrypting}
//                 >
//                   {isDecrypting ? (
//                     <ActivityIndicator size="small" color="#FFD700" />
//                   ) : (
//                     <Text style={{fontSize: 18}}>⭐</Text>
//                   )}
//                 </TouchableOpacity>
//               )}
//             </View>

//             <View style={styles.footerRow}>
//               <Text style={styles.actionText}>💬 תגובות ופירוט</Text>
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
      
//       {/* Header מעוצב */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={styles.backBtnText}>➜</Text>
//         </TouchableOpacity>
//         <View style={styles.headerInfo}>
//           <Text style={styles.headerTitle}>{groupName}</Text>
//           <Text style={styles.headerSubtitle}>{posts.length} פוסטים</Text>
//         </View>
//       </View>

//       <FlatList
//         ref={flatListRef}
//         data={posts}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderPost}
//         contentContainerStyle={styles.listPadding}
//         onContentSizeChange={handleContentSizeChange}
//         refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
//         ListEmptyComponent={!loading ? <Text style={styles.emptyText}>אין הודעות...</Text> : null}
//       />

//       {/* מודל Heatmap חדש */}
//       <Modal visible={heatmapVisible} transparent={true} animationType="fade" onRequestClose={() => setHeatmapVisible(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>🔥 מפת חשיפת פיקסלים</Text>
//             {currentHeatmapUrl && (
//               <Image source={{ uri: currentHeatmapUrl }} style={styles.heatmapImg} resizeMode="contain" />
//             )}
//             <TouchableOpacity style={styles.closeBtn} onPress={() => setHeatmapVisible(false)}>
//               <Text style={{color: '#fff', fontWeight: 'bold'}}>סגור</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Footer מעוצב */}
//       <View style={styles.footerContainer}>
//         <TouchableOpacity style={styles.micBtn}>
//           <Text style={{fontSize: 24}}>🎙️</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.inputBox}
//           onPress={() => navigation.navigate('CreatePost', { target: 'group', groupId, groupName, userName })}
//         >
//           <Text style={styles.inputText}>כתוב משהו לקבוצה...</Text>
//           <Text style={{fontSize: 20}}>📷</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#E5DDD5' },
//   header: { height: 70, backgroundColor: '#075E54', flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 20 },
//   headerInfo: { flex: 1, marginRight: 15 },
//   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'right' },
//   headerSubtitle: { color: '#A0D3C1', fontSize: 12, textAlign: 'right' },
//   backBtn: { padding: 5 },
//   backBtnText: { color: '#fff', fontSize: 24 },

//   listPadding: { padding: 12, paddingBottom: 20 },
//   postWrapper: { marginBottom: 12 },
//   modernCard: { flexDirection: 'row-reverse', borderRadius: 15, overflow: 'hidden', elevation: 3, backgroundColor: '#fff' },
//   myCardBg: { backgroundColor: '#E7FFDB' },
//   theirCardBg: { backgroundColor: '#FFFFFF' },

//   imageSection: { width: 100, height: 100 },
//   postImage: { width: '100%', height: '100%' },
//   myBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: '#075E54', paddingHorizontal: 6, borderRadius: 8 },
//   myBadgeText: { color: '#fff', fontSize: 9 },

//   contentSection: { flex: 1, padding: 10, justifyContent: 'space-between' },
//   topRow: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
//   authorName: { fontSize: 14, fontWeight: 'bold' },
//   dateTimeText: { fontSize: 10, color: '#888' },
//   dateTimeContainer: { flexDirection: 'row', alignItems: 'center' },

//   descriptionArea: { flexDirection: 'row-reverse', alignItems: 'center', marginVertical: 5 },
//   descriptionText: { flex: 1, fontSize: 14, color: '#444', textAlign: 'right' },
//   starButton: { backgroundColor: '#FFF', borderRadius: 20, padding: 3, marginLeft: 5, borderWidth: 1, borderColor: '#FFD700' },

//   footerRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: '#EEE', paddingTop: 5 },
//   actionText: { fontSize: 11, color: '#777', fontWeight: '600' },
//   blueTicks: { color: '#34B7F1', fontSize: 12 },

//   footerContainer: { flexDirection: 'row', padding: 10, alignItems: 'center', backgroundColor: 'transparent' },
//   inputBox: { flex: 1, height: 50, backgroundColor: '#FFF', borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, elevation: 3 },
//   inputText: { flex: 1, textAlign: 'right', color: '#999', marginRight: 10 },
//   micBtn: { width: 50, height: 50, backgroundColor: '#075E54', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
//   emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },

//   // סטייל למודל Heatmap
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
//   modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center' },
//   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
//   heatmapImg: { width: '100%', height: 350, borderRadius: 10 },
//   closeBtn: { marginTop: 20, backgroundColor: '#075E54', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10 }
// });

// export default GroupDetailsScreen;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, Text, FlatList, Image, StyleSheet, Modal,
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
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [heatmapVisible, setHeatmapVisible] = useState(false);
  const [currentHeatmapUrl, setCurrentHeatmapUrl] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts/feed/${groupId}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // מיון: ישן למעלה (ראשון), חדש למטה (אחרון)
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

  const handleContentSizeChange = () => {
    if (posts.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: false });
    }
  };

  const handleDecrypt = async (post: any) => {
    setIsDecrypting(true);
    try {
      const response = await fetch(`${BASE_URL}/posts/${post.id}/decrypt?userName=${userName}`);
      const data = await response.json();

      if (data.secret) {
        Alert.alert(
          "🔓 חילוץ מדעי מהפיקסלים הושלם",
          `המסר: ${data.secret}\n\n` +
          `🔬 אלגוריתם: ${post.chosenAlgorithm || 'Dynamic Stegano'}\n` +
          `📊 איכות (PSNR): ${post.psnr?.toFixed(2)} dB\n` +
          `🔗 דמיון (SSIM): ${post.ssim?.toFixed(4)}\n` +
          `🌀 אנטרופיה: ${post.entropy?.toFixed(4)}\n` +
          `📐 צפיפות קצוות: ${post.edgeDensity?.toFixed(4)}\n` +
          `📦 יעילות (BPP): ${post.bpp?.toFixed(4)}`,
          [
            { text: "סגור", style: "cancel" },
            { 
              text: "🔥 הצג מפת חום", 
              onPress: () => {
                setCurrentHeatmapUrl(post.heatmapUrl);
                setHeatmapVisible(true);
              } 
            }
          ]
        );
      }
    } catch (e) {
      Alert.alert("שגיאה", "נכשל החילוץ מהשרת");
    } finally {
      setIsDecrypting(false);
    }
  };

 const renderPost = ({ item }: { item: any }) => {
    const isMyPost = item.author === userName;
    
    // --- לוגיקת שליפה מעודכנת ומאובטחת ---
    // בודק האם השם שלי מופיע ברשימת המורשים שנשלחה מהשרת
    const hasSecret = item.authorizedUsers && 
                      item.authorizedUsers.some((u: string) => u.toLowerCase() === userName?.toLowerCase());

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
          
          {/* תמונה - מופיעה ראשונה בקוד כדי שתהיה בימין בגלל row-reverse */}
          {item.imageUrl && (
            <View style={styles.imageSection}>
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.postImage} 
                resizeMode="cover"
              />
              {isMyPost && <View style={styles.myBadge}><Text style={styles.myBadgeText}>שלי</Text></View>}
            </View>
          )}

          {/* תוכן הפוסט - יופיע משמאל לתמונה */}
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
              
              {/* הצגת כוכב הפענוח במידה ויש הודעה עבור המשתמש */}
              {hasSecret && (
                <TouchableOpacity 
                  style={styles.starButton}
                  onPress={() => handleDecrypt(item)}
                  disabled={isDecrypting}
                >
                  {isDecrypting ? (
                    <ActivityIndicator size="small" color="#FFD700" />
                  ) : (
                    <Text style={{fontSize: 18}}>⭐</Text>
                  )}
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
      
      {/* Header */}
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
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        renderItem={renderPost}
        contentContainerStyle={styles.listPadding}
        onContentSizeChange={handleContentSizeChange}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPosts} />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>אין הודעות בקבוצה עדיין...</Text> : null}
      />

      {/* מודל Heatmap */}
      <Modal visible={heatmapVisible} transparent={true} animationType="fade" onRequestClose={() => setHeatmapVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🔥 מפת חשיפת פיקסלים</Text>
            {currentHeatmapUrl && (
              <Image source={{ uri: currentHeatmapUrl }} style={styles.heatmapImg} resizeMode="contain" />
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setHeatmapVisible(false)}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Footer */}
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
  modernCard: { 
    flexDirection: 'row-reverse', 
    borderRadius: 15, 
    overflow: 'hidden', 
    elevation: 3, 
    backgroundColor: '#fff',
    minHeight: 100
  },
  myCardBg: { backgroundColor: '#E7FFDB' },
  theirCardBg: { backgroundColor: '#FFFFFF' },

  imageSection: { width: 100, height: 100, backgroundColor: '#f0f0f0' },
  postImage: { width: 100, height: 100 },
  myBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: '#075E54', paddingHorizontal: 6, borderRadius: 8 },
  myBadgeText: { color: '#fff', fontSize: 9 },

  contentSection: { flex: 1, padding: 10, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  authorName: { fontSize: 14, fontWeight: 'bold' },
  dateTimeText: { fontSize: 10, color: '#888' },
  dateTimeContainer: { flexDirection: 'row', alignItems: 'center' },

  descriptionArea: { flexDirection: 'row-reverse', alignItems: 'center', marginVertical: 5 },
  descriptionText: { flex: 1, fontSize: 14, color: '#444', textAlign: 'right' },
  starButton: { backgroundColor: '#FFF', borderRadius: 20, padding: 3, marginLeft: 5, borderWidth: 1, borderColor: '#FFD700' },

  footerRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: '#EEE', paddingTop: 5 },
  actionText: { fontSize: 11, color: '#777', fontWeight: '600' },
  blueTicks: { color: '#34B7F1', fontSize: 12 },

  footerContainer: { flexDirection: 'row', padding: 10, alignItems: 'center', backgroundColor: 'transparent' },
  inputBox: { flex: 1, height: 50, backgroundColor: '#FFF', borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, elevation: 3 },
  inputText: { flex: 1, textAlign: 'right', color: '#999', marginRight: 10 },
  micBtn: { width: 50, height: 50, backgroundColor: '#075E54', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  heatmapImg: { width: '100%', height: 350, borderRadius: 10 },
  closeBtn: { marginTop: 20, backgroundColor: '#075E54', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10 }
});

export default GroupDetailsScreen;