import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, 
  StyleSheet, Switch, Alert, ActivityIndicator 
} from 'react-native';

const CreateGroupScreen = ({ navigation, route }: any) => {
  // 1. חילוץ השם האמיתי וה-Username מה-params שנשלחו מה-Login/Main
  const { userName, realName } = route.params || { userName: 'user_unknown', realName: 'משתמש כללי' };

  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 2. עדכון הרשימה ההתחלתית - את נכנסת עם ה-fullName שלך
  const [selectedMembers, setSelectedMembers] = useState<any[]>([
    { 
      username: userName, 
      fullName: realName, // השם האמיתי נשמר כאן בזיכרון
      isAdmin: true, 
      isCreator: true, 
      status: 'חבר' 
    }
  ]);

  // ה-IP שציינת בקוד שלך
  const MY_IP = "192.168.1.112"; 

  // חיפוש חברים בזמן אמת
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        try {
          const response = await fetch(`http://${MY_IP}:8080/api/users/search?name=${searchQuery}`);
          const data = await response.json();
          // סינון: אל תראה מי שכבר הוספת לרשימה למטה
          const filtered = data.filter((u: any) => 
            !selectedMembers.find(m => m.username === u.username)
          );
          setSuggestions(filtered);
        } catch (error) { 
          console.log("Search error", error); 
        }
      } else { 
        setSuggestions([]); 
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedMembers]);

  // פונקציית הקסם: מוסיפה חבר וקופצת הודעה
  const addMember = (user: any) => {
    // 1. עדכון הרשימה למטה מיד
    const newMember = { 
      ...user, 
      isAdmin: false, 
      isCreator: false, 
      status: 'ממתין' // זה הסטטוס שיופיע מיד
    };
    setSelectedMembers([...selectedMembers, newMember]);

    // 2. ניקוי שדה החיפוש
    setSearchQuery('');
    setSuggestions([]);

    // 3. הודעה קופצת לאישור (סימולציה של שליחת בקשה)
    Alert.alert(
      "הזמנה נשלחה", 
      `שלחת בקשת הצטרפות ל${user.username}. הוא יראה זאת מיד במסך שלו.`
    );
  };

  const toggleAdmin = (username: string) => {
    setSelectedMembers(selectedMembers.map(m => 
      m.username === username ? { ...m, isAdmin: !m.isAdmin } : m
    ));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("שגיאה", "נא להזין שם לקבוצה");
      return;
    }
    if (selectedMembers.length < 2) {
        Alert.alert("רגע...", "נא להוסיף לפחות חבר אחד לקבוצה");
        return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://${MY_IP}:8080/api/groups/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName: groupName,
          creator: realName,
          invitedMembers: selectedMembers.filter(m => !m.isCreator) 
        }),
      });

      if (response.ok) {
        Alert.alert("הצלחה!", `הקבוצה "${groupName}" נוצרה והנתונים נשמרו ב-DB.`);
        navigation.goBack(); 
      } else {
          throw new Error("Server error");
      }
    } catch (error) {
      Alert.alert("שגיאה", "השרת לא הגיב. וודא ש-IntelliJ רץ, ה-IP נכון וה-Database מחובר.");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>יצירת קבוצה חדשה</Text>
      
      <Text style={styles.label}>שם הקבוצה:</Text>
      <TextInput 
        style={styles.input} 
        value={groupName} 
        onChangeText={setGroupName} 
        placeholder="למשל: הטיול השנתי..." 
      />

      <Text style={styles.label}>הוסף חברים (חפש שם):</Text>
      <TextInput 
        style={styles.input} 
        value={searchQuery} 
        onChangeText={setSearchQuery} 
        placeholder="הקלד שם משתמש..." 
      />

      {/* הצעות חיפוש - מופיעות מעל הרשימה */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item: any) => (
            <TouchableOpacity 
              key={item.id || item._id} 
              style={styles.suggestionItem} 
              onPress={() => addMember(item)}
            >
              <Text style={styles.addPlus}>➕</Text>
              <Text style={styles.suggestionText}>{item.username}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.divider} />

      <Text style={styles.subtitle}>רשימת חברים שיוזמנו ({selectedMembers.length}):</Text>
      
      <FlatList
        data={selectedMembers}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={[styles.memberRow, item.isCreator && styles.creatorRow]}>
            <View style={styles.adminControl}>
              <Text style={styles.smallText}>{item.isAdmin ? "מנהל" : "חבר"}</Text>
              <Switch 
                value={item.isAdmin} 
                disabled={item.isCreator} 
                onValueChange={() => toggleAdmin(item.username)} 
              />
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.memberName}>{item.username} {item.isCreator ? "(אני)" : ""}</Text>
              <Text style={[styles.statusText, {color: item.status === 'ממתין' ? '#f39c12' : '#27ae60'}]}>
                {item.status}
              </Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity 
        style={[styles.createButton, {opacity: loading ? 0.7 : 1}]} 
        onPress={handleCreateGroup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>אישור סופי ויצירת קבוצה</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: '#333' },
  label: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginBottom: 5, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, textAlign: 'right', marginBottom: 15, backgroundColor: '#fdfdfd' },
  suggestionsContainer: { backgroundColor: '#fff', borderRadius: 10, elevation: 8, shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity: 0.2, zIndex: 999, marginBottom: 15, borderWidth: 1, borderColor: '#6200EE' },
  suggestionItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  suggestionText: { fontSize: 17, fontWeight: '500' },
  addPlus: { color: '#6200EE', fontSize: 18 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginVertical: 10, color: '#6200EE' },
  memberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderRadius: 15, marginBottom: 10, elevation: 2, borderWidth: 1, borderColor: '#f0f0f0' },
  creatorRow: { backgroundColor: '#f3ebff', borderColor: '#6200EE' },
  memberName: { fontSize: 16, fontWeight: 'bold' },
  statusText: { fontSize: 13, marginTop: 3, fontWeight: '600' },
  adminControl: { flexDirection: 'row', alignItems: 'center' },
  smallText: { fontSize: 13, marginRight: 8, color: '#777' },
  createButton: { backgroundColor: '#6200EE', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, shadowColor: '#6200EE', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default CreateGroupScreen;