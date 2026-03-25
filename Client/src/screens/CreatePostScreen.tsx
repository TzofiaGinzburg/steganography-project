import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from '@react-native-documents/picker';
import { BASE_URL } from '../api/Constants';

const CreatePostScreen = ({ route, navigation }: any) => {
  const { target, groupId, userName } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<any>(null);

  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [sendMode, setSendMode] = useState<'individual' | 'group' | null>(null);
  const [activeRecipient, setActiveRecipient] = useState<any>(null); 
  const [currentSecretMessage, setCurrentSecretMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (target === 'group' && groupId) {
      fetch(`${BASE_URL}/groups/${groupId}/members`)
        .then(res => res.json())
        .then(data => {
          setGroupMembers(data);
          setFilteredMembers(data);
        })
        .catch(err => console.error(err));
    }
  }, [groupId]);

  const updateFilteredList = (text: string, currentSelected: any) => {
    const remaining = groupMembers.filter(m => !currentSelected[m.username]);
    const filtered = remaining.filter(m => 
      m.username?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

  const handleUserSearch = (text: string) => {
    setSearchQuery(text);
    updateFilteredList(text, selectedRecipients);
  };

  const saveMessageToRecipient = () => {
    if (!currentSecretMessage.trim()) return Alert.alert("חסר מסר", "כתוב משהו סודי...");
    
    const newSelected = { ...selectedRecipients };
    
    if (sendMode === 'group') {
      groupMembers.forEach(m => {
        newSelected[m.username] = currentSecretMessage;
      });
      setSendMode(null);
    } else {
      newSelected[activeRecipient.username] = currentSecretMessage;
      setActiveRecipient(null);
      setSearchQuery('');
    }

    setSelectedRecipients(newSelected);
    setCurrentSecretMessage('');
    updateFilteredList('', newSelected);
  };

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], 
      });
      setFile({ uri: res[0].uri, name: res[0].name, type: res[0].type });
    } catch (e) {
      console.log("User cancelled picker");
    }
  };

  const handlePublish = async () => {
  if (!file) return Alert.alert("עצור!", "חובה לבחור קובץ לפני הפרסום");
  setLoading(true);

  const formData = new FormData();
  
  // 1. הוספת הקובץ
  formData.append('file', { 
    uri: file.uri, 
    type: file.type || 'image/png', 
    name: file.name || 'photo.png' 
  } as any);

  // 2. נתונים רגילים
  formData.append('description', description);
  formData.append('senderUsername', userName);
  formData.append('target', target === 'group' ? groupId : 'world');

  // 3. שליחת כל מפת המסרים כ-JSON String
  // השרת שלך מצפה לפרמטר בשם "userMessagesJson"
  if (Object.keys(selectedRecipients).length > 0) {
    formData.append('userMessagesJson', JSON.stringify(selectedRecipients));
  }

  try {
    const res = await fetch(`${BASE_URL}/posts/create`, { 
      method: 'POST', 
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.ok) {
      Alert.alert("הצלחה", "הפוסט הוצפן ופורסם! 🤫");
      navigation.goBack();
    } else {
      Alert.alert("שגיאה בפרסום");
    }
  } catch (e) { 
    Alert.alert("שגיאת חיבור"); 
  } finally { 
    setLoading(false); 
  }
};
  const isImage = file?.type?.startsWith('image/');

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- HEADER FIX: כפתור חזור קבוע למעלה --- */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{flex: 1}}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.headerTitle}>יצירת פוסט חכם ✨</Text>

          <TouchableOpacity style={[styles.mediaCard, file && styles.mediaCardActive]} onPress={pickFile}>
            {file ? (
              isImage ? (
                <Image source={{ uri: file.uri }} style={styles.fullImage} />
              ) : (
                <View style={styles.fileInfo}>
                  <Text style={styles.fileEmoji}>📄</Text>
                  <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                </View>
              )
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.plusCircle}><Text style={styles.plusText}>+</Text></View>
                <Text style={styles.uploadText}>לחץ לבחירת כל סוג קובץ</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>מה בראש שלך? ✍️</Text>
            <TextInput 
              style={styles.captionInput} 
              placeholder="כתוב תיאור גלוי לכולם..." 
              multiline 
              onChangeText={setDescription} 
              placeholderTextColor="#A0AEC0"
            />
          </View>

          {target === 'group' && (
            <View style={styles.cryptoBox}>
              <View style={styles.cryptoHeader}>
                <Text style={styles.cryptoEmoji}>🔐</Text>
                <Text style={styles.cryptoTitle}>הצפנה לפי נמענים</Text>
              </View>
              
              {!sendMode && (
                <View style={styles.modeGrid}>
                  <TouchableOpacity style={[styles.modeCard, styles.groupCard]} onPress={() => setSendMode('group')}>
                    <Text style={styles.cardEmoji}>📣</Text>
                    <Text style={styles.cardText}>כל הקבוצה</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modeCard, styles.individualCard]} onPress={() => {
                    setSendMode('individual');
                    updateFilteredList('', selectedRecipients);
                  }}>
                    <Text style={styles.cardEmoji}>🎯</Text>
                    <Text style={styles.cardText}>בחירת חברים</Text>
                  </TouchableOpacity>
                </View>
              )}

              {sendMode === 'individual' && !activeRecipient && (
                <View style={styles.selectionArea}>
                  <View style={styles.selectionHeader}>
                    <TouchableOpacity onPress={() => setSendMode(null)} style={styles.backBtn}>
                      <Text style={styles.backBtnText}>✕ סגור</Text>
                    </TouchableOpacity>
                    <Text style={styles.searchTitle}>מי יראה את המסר?</Text>
                  </View>
                  <TextInput style={styles.searchBar} placeholder="חפש חבר ברשימה..." onChangeText={handleUserSearch} value={searchQuery} />
                  <ScrollView style={styles.memberList} nestedScrollEnabled>
                    {filteredMembers.map(m => (
                      <TouchableOpacity key={m.username} style={styles.userRow} onPress={() => setActiveRecipient(m)}>
                        <Text style={styles.userRowText}>👤 {m.username}</Text>
                        <View style={styles.addCircle}><Text style={styles.addPlus}>+</Text></View>
                      </TouchableOpacity>
                    ))}
                    {filteredMembers.length === 0 && groupMembers.length > 0 && (
                      <View style={styles.allSelectedBox}>
                        <Text style={styles.allSelectedText}>כל חברי הקבוצה נבחרו! ✅</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}

              {(activeRecipient || sendMode === 'group') && (
                <View style={styles.editorContainer}>
                  <Text style={styles.editorLabel}>
                    {sendMode === 'group' ? "📝 מסר סודי עבור כל הקבוצה:" : `🔐 מסר סודי עבור: ${activeRecipient?.username}`}
                  </Text>
                  <TextInput 
                    style={styles.secretInput} 
                    placeholder="הקלד כאן את המסר שיוצפן..." 
                    multiline 
                    value={currentSecretMessage} 
                    onChangeText={setCurrentSecretMessage} 
                    autoFocus 
                  />
                  <View style={styles.editorActions}>
                    <TouchableOpacity style={styles.saveBtn} onPress={saveMessageToRecipient}>
                      <Text style={styles.saveBtnText}>{sendMode === 'group' ? "הצפן לכולם 🔐" : "שמור ✅"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtnRed} onPress={() => { setActiveRecipient(null); if(sendMode === 'group') setSendMode(null); }}>
                      <Text style={styles.cancelBtnTextRed}>ביטול ✖</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {Object.keys(selectedRecipients).length > 0 && (
                <View style={styles.finalListContainer}>
                  <Text style={styles.finalListHeading}>נמענים ומסרים שהוצפנו:</Text>
                  {Object.entries(selectedRecipients).map(([name, msg]) => (
                    <View key={name} style={styles.finalUserRow}>
                      <TouchableOpacity 
                        onPress={() => {
                          const n = {...selectedRecipients}; delete n[name];
                          setSelectedRecipients(n);
                          updateFilteredList(searchQuery, n);
                        }} 
                        style={styles.removeUserBtn}
                      >
                        <Text style={styles.removeUserIcon}>🗑️</Text>
                      </TouchableOpacity>
                      
                      <View style={styles.finalUserInfo}>
                        <Text style={styles.finalUserName}>@{name}</Text>
                        <Text style={styles.finalUserMsg} numberOfLines={1}>{msg}</Text>
                      </View>
                      
                      <View style={styles.statusIndicator} />
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          <TouchableOpacity style={[styles.mainButton, loading && styles.btnDisabled]} onPress={handlePublish} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text style={styles.mainButtonText}>שלח פוסט לעולם 🚀</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#EDF2F7',
    borderRadius: 12,
  },
  backButtonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: { padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: '900', textAlign: 'center', color: '#1A202C', marginBottom: 20 },
  mediaCard: { height: 160, backgroundColor: '#EDF2F7', borderRadius: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#CBD5E0', borderStyle: 'dashed', marginBottom: 20 },
  mediaCardActive: { borderStyle: 'solid', borderColor: '#667EEA', backgroundColor: '#fff' },
  fullImage: { width: '100%', height: '100%', borderRadius: 22 },
  uploadPlaceholder: { alignItems: 'center' },
  plusCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#667EEA', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  plusText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  uploadText: { color: '#4A5568', fontWeight: '600', fontSize: 14 },
  fileInfo: { alignItems: 'center', padding: 10 },
  fileEmoji: { fontSize: 40, marginBottom: 5 },
  fileName: { fontSize: 14, color: '#2D3748', fontWeight: 'bold' },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 15, fontWeight: 'bold', color: '#4A5568', marginBottom: 8, textAlign: 'right' },
  captionInput: { backgroundColor: '#fff', padding: 15, borderRadius: 16, fontSize: 16, textAlign: 'right', borderWidth: 1, borderColor: '#E2E8F0', color: '#2D3748' },
  cryptoBox: { backgroundColor: '#fff', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, marginBottom: 20 },
  cryptoHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 15 },
  cryptoEmoji: { fontSize: 22, marginLeft: 8 },
  cryptoTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3748' },
  modeGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  modeCard: { flex: 0.48, padding: 15, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  groupCard: { backgroundColor: '#EBF8FF' },
  individualCard: { backgroundColor: '#F0FFF4' },
  cardEmoji: { fontSize: 28, marginBottom: 5 },
  cardText: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
  selectionArea: { marginTop: 10 },
  selectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  backBtnText: { color: '#E53E3E', fontWeight: 'bold' },
  backBtn: { backgroundColor: '#FFF5F5', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FEB2B2' },
  searchTitle: { fontSize: 14, fontWeight: 'bold', color: '#4A5568' },
  searchBar: { backgroundColor: '#F7FAFC', padding: 12, borderRadius: 12, textAlign: 'right', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 10 },
  memberList: { maxHeight: 150 },
  userRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, marginBottom: 6, alignItems: 'center' },
  userRowText: { fontSize: 15, fontWeight: '500' },
  addCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#667EEA', justifyContent: 'center', alignItems: 'center' },
  addPlus: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  allSelectedBox: { padding: 20, alignItems: 'center' },
  allSelectedText: { color: '#38A169', fontWeight: 'bold', fontSize: 15 },
  editorContainer: { backgroundColor: '#F7FAFC', padding: 15, borderRadius: 18, borderWidth: 1, borderColor: '#667EEA' },
  editorLabel: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 10, color: '#2D3748' },
  secretInput: { backgroundColor: '#fff', padding: 12, borderRadius: 12, textAlign: 'right', minHeight: 80, fontSize: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  editorActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  saveBtn: { backgroundColor: '#667EEA', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  cancelBtnRed: { padding: 10, backgroundColor: '#FFF5F5', borderRadius: 10, borderWidth: 1, borderColor: '#FEB2B2' },
  cancelBtnTextRed: { color: '#C53030', fontWeight: 'bold' },
  finalListContainer: { marginTop: 25, borderTopWidth: 1, borderTopColor: '#EDF2F7', paddingTop: 15 },
  finalListHeading: { fontSize: 14, fontWeight: 'bold', color: '#4A5568', marginBottom: 12, textAlign: 'right' },
  finalUserRow: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 16, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  removeUserBtn: { padding: 8, backgroundColor: '#FFF5F5', borderRadius: 10, marginLeft: 12 },
  removeUserIcon: { fontSize: 14 },
  finalUserInfo: { flex: 1, alignItems: 'flex-end' },
  finalUserName: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
  finalUserMsg: { fontSize: 12, color: '#718096', marginTop: 2 },
  statusIndicator: { width: 4, height: 25, backgroundColor: '#667EEA', borderRadius: 2, marginRight: 10 },
  mainButton: { backgroundColor: '#667EEA', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 10, marginBottom: 30, elevation: 5 },
  mainButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  btnDisabled: { backgroundColor: '#A0AEC0' }
});

export default CreatePostScreen;