import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../src/theme/colors';
import { useStore } from '../src/store/useStore';
import { ShieldCheck } from 'lucide-react-native';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { resetDemo } = useStore();

  useEffect(() => {
    // Initialization or analytics can go here
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Image 
              source={require('../assets/logo.png')} 
              style={{ width: 180, height: 180 }} 
              resizeMode="contain"
            />
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.buttonPrimary} 
            onPress={() => {
              router.push('/customer');
            }}
          >
            <Text style={styles.buttonTextPrimary}>Continue as Customer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.buttonPrimary} 
            onPress={() => {
              router.push('/owner-login');
            }}
          >
            <Text style={styles.buttonTextPrimary}>Continue as Owner</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.buttonPrimary} 
            onPress={() => {
              router.push('/delivery/login');
            }}
          >
            <Text style={styles.buttonTextPrimary}>Continue as Delivery Partner</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.legalButton} 
            onPress={() => {
              router.push('/legal');
            }}
          >
            <ShieldCheck size={16} color={colors.primary} />
            <Text style={styles.legalButtonText}>Privacy Policy, Terms & App Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 14,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonTextPrimary: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  legalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 6,
    borderRadius: 10,
    backgroundColor: '#FDF2F8',
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  legalButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
