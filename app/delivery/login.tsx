import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { useStore } from '../../src/store/useStore';
import { ArrowLeft, Truck } from 'lucide-react-native';

export default function DeliveryLoginScreen() {
  const router = useRouter();
  const { deliveryPartners } = useStore();
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    if (!phone || phone.trim().length === 0) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    const cleanInputPhone = phone.replace(/[^0-9]/g, '');

    // Debug print
    console.log('Attempting login with cleaned phone:', cleanInputPhone);
    console.log('Available delivery partners in store:', deliveryPartners.map(p => ({ id: p.id, name: p.name, phone: p.phone })));

    // Match delivery partner by exact phone or substring (last 10 digits)
    const partner = deliveryPartners.find(p => {
      const cleanPartnerPhone = p.phone ? p.phone.replace(/[^0-9]/g, '') : '';
      return cleanPartnerPhone === cleanInputPhone || 
             (cleanInputPhone.length >= 10 && cleanPartnerPhone.endsWith(cleanInputPhone.slice(-10))) ||
             (cleanPartnerPhone.length >= 10 && cleanInputPhone.endsWith(cleanPartnerPhone.slice(-10)));
    });

    if (partner) {
      useStore.setState({ currentDeliveryPartner: partner });
      router.replace('/delivery');
    } else {
      Alert.alert(
        'Partner Not Found', 
        `No delivery partner registered with phone number ${phone}. Available numbers: ` + 
        deliveryPartners.map(p => p.phone).filter(Boolean).join(', ')
      );
    }
  };

  const handlePhoneChange = (text: string) => {
    // Only allow numbers
    const cleanNumber = text.replace(/[^0-9]/g, '');
    setPhone(cleanNumber);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
          <ArrowLeft color={colors.text} size={24} />
          <Text style={styles.backText}>Back to Home</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Truck size={48} color={colors.primary} />
          </View>
          
          <Text style={styles.title}>Delivery Partner Login</Text>
          <Text style={styles.subtitle}>Sign in to manage your deliveries</Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              autoCapitalize="none"
              placeholderTextColor={colors.mutedText}
              maxLength={10}
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.legalLink} 
              onPress={() => router.push('/legal')}
            >
              <Text style={styles.legalText}>Privacy Policy & Terms</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  backText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.softPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.darkPurple,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedText,
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: colors.white,
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  legalLink: {
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 6,
  },
  legalText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});
