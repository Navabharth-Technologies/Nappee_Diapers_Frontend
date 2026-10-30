import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { colors } from '../../src/theme/colors';
import { useStore } from '../../src/store/useStore';
import { Order } from '../../src/store/types';
import { useRouter, useFocusEffect } from 'expo-router';
import { Search, RefreshCw } from 'lucide-react-native';

export default function OwnerOrdersScreen() {
  const { orders, customers, fetchOrders, fetchCustomers } = useStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');

  // Auto-fetch fresh orders from Azure whenever Owner views this screen
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
      fetchCustomers();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchOrders(), fetchCustomers()]);
    setRefreshing(false);
  };

  const validOrders = orders.filter(o => {
    if (activeTab === 'PAID') return o.paymentStatus === 'PAID';
    if (activeTab === 'PENDING') return o.paymentStatus === 'PENDING';
    return true;
  });
  
  const filteredOrders = validOrders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    customers.find(c => c.id === o.customerId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED': return colors.darkPurple;
      case 'CANCELLED': return 'red';
      case 'OUT_FOR_DELIVERY': return '#d97706'; // orange
      default: return colors.primary;
    }
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const customer = customers.find(c => c.id === item.customerId);
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity 
        style={styles.orderCard} 
        onPress={() => router.push(`/owner/order/${item.id.replace('#', '')}`)}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'DELIVERED' ? colors.background : `${statusColor}15` }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.replace(/_/g, ' ')}
            </Text>
          </View>
        </View>
        
        <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.statusBadge, { backgroundColor: item.paymentStatus === 'PAID' ? '#dcfce7' : '#fee2e2', paddingHorizontal: 8, paddingVertical: 4 }]}>
             <Text style={[styles.statusText, { color: item.paymentStatus === 'PAID' ? '#166534' : '#991b1b', fontSize: 11 }]}>
               {item.paymentStatus} {item.paymentMethod ? `(${item.paymentMethod})` : ''}
             </Text>
          </View>
        </View>
        
        <View style={styles.customerRow}>
          <Text style={styles.customerName}>{customer?.name || 'Customer'}</Text>
          <Text style={styles.customerPhone}>{customer?.phone}</Text>
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
          <Text style={styles.orderAmount}>₹{item.total}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.mutedText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Order ID or Customer Name"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={styles.syncButton} 
          onPress={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={18} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {(['ALL', 'PAID', 'PENDING'] as const).map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'ALL' ? `All (${orders.length})` : tab === 'PAID' ? `Paid (${orders.filter(o => o.paymentStatus === 'PAID').length})` : `Pending (${orders.filter(o => o.paymentStatus === 'PENDING').length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No orders found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  syncButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedText,
  },
  tabTextActive: {
    color: colors.primary,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 15,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.mutedText,
    marginTop: 40,
  },
  orderCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  customerPhone: {
    fontSize: 14,
    color: colors.mutedText,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  orderDate: {
    fontSize: 13,
    color: colors.mutedText,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkPurple,
  }
});
