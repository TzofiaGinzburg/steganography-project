import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, FlatList, 
  ActivityIndicator, Alert, RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyGroupsScreen = ({ navigation, route }: any) => {
  // קבלת שם המשתמש מה-Params
  const { userName } = route.params || { userName: 'אורח' };
  const MY_IP = '192.168.1.112'; // <--- וודא שזה ה-IP של המחשב שלך

  const [activeTab, setActiveTab] = useState<'mine' | 'invites'>('mine');
  const [groups, setGroups] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // פונקציה לשליפת כל הנתונים
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. שליפת קבוצות שאתה חבר בהן
      const resGroups = await fetch(`http://${MY_IP}:8080/api/users/${userName}/groups`);
      const groupsData = await resGroups.json();
      setGroups(Array.isArray(groupsData) ? groupsData : []);

      // 2. שליפת הזמנות שמחכות לך
      const resInvites = await fetch(`http://${MY_IP}:8080/api/invitations/${userName}`);
      const invitesData = await resInvites.json();
      setInvites(Array.isArray(invitesData) ? invitesData : []);

    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("שגיאה", "לא ניתן להתחבר לשרת. בדוק שה-IP נכון ושהשרת רץ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userName]);

  // פונקציית אישור הצטרפות
  const handleAccept = async (inviteId: string) => {
    try {
      const response = await fetch(`http://${MY_IP}:8080/api/invitations/accept/${inviteId}`, {
        method: 'POST'
      });
      if (response.ok) {
        Alert.alert("הצלחה", "הצטרפת לקבוצה!");
        fetchData(); // רענון הנתונים
      }
    } catch (e) {
      Alert.alert("שגיאה", "פעולת האישור נכשלה.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* כותרת */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>הקבוצות שלי</Text>
      </View>

      {/* תפריט טאבים (Tabs) */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'invites' && styles.activeTab]} 
          onPress={() => setActiveTab('invites')}
        >
          <Text style={[styles.tabText, activeTab === 'invites' && styles.activeTabText]}>
            הזמנות ({invites.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'mine' && styles.activeTab]} 
          onPress={() => setActiveTab('mine')}
        >
          <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>
            הקבוצות שלי ({groups.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={activeTab === 'mine' ? groups : invites}
          keyExtractor={(item) => item.id || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.name || item.groupName}</Text>
                <Text style={styles.cardSubtitle}>
                  {activeTab === 'mine' ? `נוצר על ידי: ${item.creator}` : `הוזמנת על ידי: ${item.inviterUsername}`}
                </Text>
              </View>

              {activeTab === 'invites' && (
                <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
                  <Text style={styles.acceptBtnText}>אישור הצטרפות</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {activeTab === 'mine' ? "עדיין אין לך קבוצות" : "אין הזמנות חדשות"}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#6200EE' },
  tabBar: { flexDirection: 'row', backgroundColor: '#FFF', elevation: 2 },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#6200EE' },
  tabText: { fontSize: 16, color: '#666', fontWeight: '600' },
  activeTabText: { color: '#6200EE' },
  listContent: { padding: 15 },
  card: { 
    backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 
  },
  cardInfo: { alignItems: 'flex-end' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 14, color: '#777', marginTop: 4 },
  acceptBtn: { 
    backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, 
    marginTop: 15, alignItems: 'center' 
  },
  acceptBtnText: { color: '#FFF', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
});

export default MyGroupsScreen;