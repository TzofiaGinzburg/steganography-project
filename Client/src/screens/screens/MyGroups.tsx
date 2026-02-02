import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyGroups = ({ navigation, route }: any) => {
  // קבלת שם המשתמש מה-Params (אם אין, נשתמש בערך ברירת מחדל לבדיקה)
  const { userName } = route.params || { userName: "אורח" };
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const MY_IP = "192.168.1.112";

  // שליפת הקבוצות מהשרת
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://${MY_IP}:8080/api/groups/my-groups/${userName}`);
      const data = await res.json();
      setGroups(data);
    } catch (e) {
      console.log("Error fetching groups:", e);
      // במקרה של שגיאה, אפשר להציג נתונים זמניים כדי שהאפליקציה לא תראה ריקה
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [userName]);

  const handleAddGroup = () => {
    Alert.alert("יצירת קבוצה", "כאן יפתח מסך ליצירת קבוצה חדשה בעתיד.");
  };

  const handleRemoveGroup = (id: string) => {
    Alert.alert("עזיבת קבוצה", "האם אתה בטוח שברצונך לעזוב את הקבוצה?", [
      { text: "ביטול", style: "cancel" },
      { 
        text: "כן, עזוב", 
        style: "destructive",
        onPress: () => {
            // כאן תוסיף fetch עם DELETE לשרת
            setGroups(groups.filter(g => g.id !== id));
        } 
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* כותרת וכפתור הוספה */}
      <View style={styles.header}>
        <Text style={styles.title}>הקבוצות שלי</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddGroup}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>עדיין לא הצטרפת לאף קבוצה</Text>}
          renderItem={({ item }) => (
            <View style={styles.groupItem}>
              {/* לחיצה מעבירה לפיד הקבוצתי */}
              <TouchableOpacity 
                style={styles.groupInfo}
                onPress={() => navigation.navigate('GlobalFeed', { 
                  target: item.id, 
                  groupName: item.name 
                })}
              >
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.groupMembers}>
                    {item.membersCount || 0} חברים • נוצר ע"י {item.creator || 'מערכת'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => handleRemoveGroup(item.id)}>
                <Text style={styles.removeIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingHorizontal: 20 },
  header: { 
    flexDirection: 'row-reverse', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 20, 
    marginBottom: 30 
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#6200EE' },
  addButton: { 
    backgroundColor: '#6200EE', 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 4
  },
  addButtonText: { color: 'white', fontSize: 30, fontWeight: '300' },
  groupItem: { 
    backgroundColor: 'white', 
    padding: 18, 
    borderRadius: 15, 
    marginBottom: 12, 
    flexDirection: 'row-reverse', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  groupInfo: { flex: 1, alignItems: 'flex-end' },
  groupName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  groupMembers: { color: '#777', marginTop: 4, fontSize: 14 },
  removeIcon: { fontSize: 22, padding: 5 },
  emptyText: { textAlign: 'center', marginTop: 100, fontSize: 16, color: '#999' }
});

export default MyGroups;