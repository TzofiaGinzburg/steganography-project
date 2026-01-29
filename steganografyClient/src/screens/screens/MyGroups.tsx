import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyGroups = ({ navigation }: any) => {
  // נתונים זמניים - בהמשך נמשוך אותם מה-Backend (10.0.2.2:8080)
  const [groups, setGroups] = useState([
    { id: '1', name: 'המשפחה שלי', members: 5 },
    { id: '2', name: 'חברי לימודים', members: 12 },
    { id: '3', name: 'צוות פיתוח', members: 3 },
  ]);

  const handleAddGroup = () => {
    Alert.alert("הוספת קבוצה", "כאן נפתח בהמשך דיאלוג ליצירת קבוצה חדשה");
  };

  const handleRemoveGroup = (id: string) => {
    Alert.alert("הסרת קבוצה", "האם אתה בטוח שברצונך לעזוב את הקבוצה?", [
      { text: "ביטול", style: "cancel" },
      { text: "כן, הסר", onPress: () => setGroups(groups.filter(g => g.id !== id)) }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>הקבוצות שלי</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddGroup}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <TouchableOpacity 
              style={styles.groupInfo}
              onPress={() => navigation.navigate('GroupDetail', { groupName: item.name })}
            >
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.groupMembers}>{item.members} חברים</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleRemoveGroup(item.id)}>
              <Text style={styles.removeIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#6200EE' },
  addButton: { backgroundColor: '#6200EE', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: 'white', fontSize: 30, marginBottom: 4 },
  groupItem: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    flexDirection: 'row-reverse', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    elevation: 3 
  },
  groupInfo: { flex: 1, alignItems: 'flex-end' },
  groupName: { fontSize: 18, fontWeight: 'bold' },
  groupMembers: { color: '#666' },
  removeIcon: { fontSize: 20 }
});

export default MyGroups;