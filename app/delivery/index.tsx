import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { useStore } from '../../src/store/useStore';
import { Package, User, LogOut, CheckCircle, Navigation, MapPin, Truck, ChevronRight } from 'lucide-react-native';

export default function DeliveryDashboard() {
  const router = useRouter();
  const { currentDeliveryPartner, logoutDeliveryPartner, orders, customers, fetchOrders, fetchCustomers } = useStore();
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!currentDeliveryPartner) {
      router.replace('/delivery/login');
    }
  }, [currentDeliveryPartner]);

  // Auto-fetch latest assigned orders whenever screen is focused
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

  if (!currentDeliveryPartner) return null;

  // Active deliveries sorted chronologically (in order owner assigned)
  const activeOrders = orders
    .filter(
      o => o.deliveryPartnerId === currentDeliveryPartner.id && 
           (o.status === 'ASSIGNED' || o.status === 'OUT_FOR_DELIVERY')
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Completed deliveries
  const completedOrders = orders
    .filter(
      o => o.deliveryPartnerId === currentDeliveryPartner.id && 
           o.status === 'DELIVERED'
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleLogout = () => {
    logoutDeliveryPartner();
    router.replace('/delivery/login');
  };

  const renderOrderItem = ({ item, index }: { item: any; index: number }) => {
    const isCurrent = activeTab === 'ACTIVE' && index === 0;
    const customer = customers.find(c => c.id === item.customerId);
    const address = customer?.addresses?.find((a: any) => a.id === item.addressId) || item.deliveryAddress;

    return (
      <TouchableOpacity 
        style={[
          styles.orderCard,
          isCurrent && styles.currentOrderCard
        ]}
        onPress={() => router.push(`/delivery/order/${item.id.replace('#', '')}`)}
      >
        {isCurrent && (
          <View style={styles.currentDeliveryBanner}>
            <Truck size={14} color={colors.white} />
            <Text style={styles.currentDeliveryText}>CURRENT DELIVERY • DELIVER FIRST</Text>
          </View>
        )}

        <View style={styles.orderHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {activeTab === 'ACTIVE' && !isCurrent && (
              <View style={styles.queueBadge}>
                <Text style={styles.queueBadgeText}>#{index + 1} in Queue</Text>
              </View>
            )}
            <Text style={[styles.orderId, isCurrent && { color: colors.primary }]}>{item.id}</Text>
          </View>
          
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.status === 'DELIVERED' ? '#dcfce7' : item.status === 'OUT_FOR_DELIVERY' ? '#F59E0B' : colors.softPurple }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.status === 'DELIVERED' ? '#166534' : item.status === 'OUT_FOR_DELIVERY' ? colors.white : colors.primary }
            ]}>
              {item.status.replace(/_/g, ' ')}
            </Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <User size={16} color={colors.mutedText} />
            <Text style={styles.detailText}>{customer?.name || 'Customer'}</Text>
            {customer?.phone && <Text style={styles.detailSubtext}>({customer.phone})</Text>}
          </View>
          
          <View style={styles.detailRow}>
            <MapPin size={16} color={isCurrent ? colors.primary : colors.mutedText} />
            <Text style={[styles.detailText, isCurrent && { fontWeight: '600' }]} numberOfLines={2}>
              {address ? `${address.street ? address.street + ', ' : ''}${address.area ? address.area + ', ' : ''}${address.city || ''} ${address.pincode ? '- ' + address.pincode : ''}` : 'Customer delivery address'}
            </Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.itemCount}>{item.items?.reduce((acc: number, i: any) => acc + i.quantity, 0) || 1} Items • ₹{item.total}</Text>
          <View style={[styles.actionButton, isCurrent && styles.actionButtonHighlight]}>
            <Text style={[styles.actionButtonText, isCurrent && styles.actionButtonHighlightText]}>
              {isCurrent ? 'Deliver Now →' : 'View Details'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{currentDeliveryPartner.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.welcomeText}>Hello, {currentDeliveryPartner.name}</Text>
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeBadgeText}>Ready & Active • {currentDeliveryPartner.phone}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.kpiContainer}>
        <View style={styles.kpiCard}>
          <Package size={24} color={colors.primary} />
          <Text style={styles.kpiValue}>{activeOrders.length}</Text>
          <Text style={styles.kpiLabel}>Active Queue</Text>
        </View>
        <View style={styles.kpiCard}>
          <CheckCircle size={24} color="#166534" />
          <Text style={[styles.kpiValue, { color: '#166534' }]}>{completedOrders.length}</Text>
          <Text style={styles.kpiLabel}>Delivered</Text>
        </View>
        <View style={styles.kpiCard}>
          <Truck size={24} color={colors.primary} />
          <Text style={styles.kpiValue}>{activeOrders.length + completedOrders.length}</Text>
          <Text style={styles.kpiLabel}>Total Orders</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'ACTIVE' && styles.activeTabBtn]}
            onPress={() => setActiveTab('ACTIVE')}
          >
            <Text style={[styles.tabText, activeTab === 'ACTIVE' && styles.activeTabText]}>
              Active Queue ({activeOrders.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'COMPLETED' && styles.activeTabBtn]}
            onPress={() => setActiveTab('COMPLETED')}
          >
            <Text style={[styles.tabText, activeTab === 'COMPLETED' && styles.activeTabText]}>
              Delivered ({completedOrders.length})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'ACTIVE' ? (
          activeOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <CheckCircle size={48} color="#166534" />
              <Text style={styles.emptyStateTitle}>All Deliveries Completed! 🎉</Text>
              <Text style={styles.emptyStateText}>You have completed all assigned orders.</Text>
              <Text style={styles.emptyStateSubtext}>New orders assigned by the owner will appear here automatically.</Text>
            </View>
          ) : (
            <FlatList
              data={activeOrders}
              renderItem={renderOrderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
            />
          )
        ) : (
          completedOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Package size={48} color={colors.border} />
              <Text style={styles.emptyStateText}>No delivered orders yet.</Text>
              <Text style={styles.emptyStateSubtext}>Completed orders will be listed here.</Text>
            </View>
          ) : (
            <FlatList
              data={completedOrders}
              renderItem={renderOrderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
            />
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.softPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    alignSelf: 'flex-start',
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16a34a',
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
  logoutButton: {
    padding: 8,
  },
  kpiContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 4,
  },
  kpiLabel: {
    fontSize: 12,
    color: colors.mutedText,
    fontWeight: '500',
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabBtn: {
    backgroundColor: colors.softPurple,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.mutedText,
  },
  activeTabText: {
    color: colors.primary,
  },
  listContainer: {
    paddingBottom: 24,
    gap: 12,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  currentOrderCard: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: '#FAF5FF',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  currentDeliveryBanner: {
    backgroundColor: colors.primary,
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currentDeliveryText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  queueBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  queueBadgeText: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: '700',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  orderDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  detailSubtext: {
    fontSize: 12,
    color: colors.mutedText,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  itemCount: {
    fontSize: 13,
    color: colors.mutedText,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: colors.softPurple,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtonHighlight: {
    backgroundColor: colors.primary,
  },
  actionButtonHighlightText: {
    color: colors.white,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#166534',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: colors.mutedText,
    textAlign: 'center',
  },
});
