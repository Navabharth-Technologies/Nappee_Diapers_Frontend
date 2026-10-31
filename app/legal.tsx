import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  Info,
  ExternalLink,
  Lock,
  MapPin,
  CreditCard,
  Mail,
  Phone,
  CheckCircle,
  HelpCircle,
  Trash2,
} from 'lucide-react-native';
import { colors } from '../src/theme/colors';

type TabType = 'privacy' | 'terms' | 'about';

export default function LegalAndPoliciesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('privacy');

  const openUrl = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={22} color={colors.darkPurple} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Legal & Policies</Text>
          <Text style={styles.headerSubtitle}>Nappee Diapers • Releaf Pads</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Segmented Control Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'privacy' && styles.tabItemActive]}
          onPress={() => setActiveTab('privacy')}
        >
          <ShieldCheck
            size={18}
            color={activeTab === 'privacy' ? colors.primary : colors.mutedText}
          />
          <Text
            style={[styles.tabText, activeTab === 'privacy' && styles.tabTextActive]}
          >
            Privacy Policy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'terms' && styles.tabItemActive]}
          onPress={() => setActiveTab('terms')}
        >
          <FileText
            size={18}
            color={activeTab === 'terms' ? colors.primary : colors.mutedText}
          />
          <Text
            style={[styles.tabText, activeTab === 'terms' && styles.tabTextActive]}
          >
            Terms of Use
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'about' && styles.tabItemActive]}
          onPress={() => setActiveTab('about')}
        >
          <Info
            size={18}
            color={activeTab === 'about' ? colors.primary : colors.mutedText}
          />
          <Text
            style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}
          >
            About & Contact
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================== */}
        {/* TAB 1: PRIVACY POLICY                                          */}
        {/* ============================================================== */}
        {activeTab === 'privacy' && (
          <View>
            {/* Quick Highlights Card */}
            <View style={styles.highlightCard}>
              <View style={styles.highlightHeader}>
                <Lock size={20} color={colors.primary} />
                <Text style={styles.highlightTitle}>Our Privacy Commitment</Text>
              </View>
              <Text style={styles.highlightBody}>
                We respect your personal data. We only collect the minimal information
                required to process your orders and deliver diapers to your address.
              </Text>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <CheckCircle size={12} color="#059669" />
                  <Text style={styles.badgeText}>256-bit Encryption</Text>
                </View>
                <View style={styles.badge}>
                  <CheckCircle size={12} color="#059669" />
                  <Text style={styles.badgeText}>No Third-Party Ads</Text>
                </View>
                <View style={styles.badge}>
                  <CheckCircle size={12} color="#059669" />
                  <Text style={styles.badgeText}>Zero Data Selling</Text>
                </View>
              </View>
            </View>

            {/* Policy Sections */}
            <View style={styles.policySection}>
              <Text style={styles.sectionHeading}>1. Scope & Application</Text>
              <Text style={styles.paragraph}>
                This Privacy Policy applies to the Nappee Diapers mobile application,
                WhatsApp ordering service, and local doorstep delivery operations managed
                by Parisara Samrakshana / Releaf Pads.
              </Text>
            </View>

            <View style={styles.policySection}>
              <View style={styles.headingWithIcon}>
                <MapPin size={18} color={colors.primary} />
                <Text style={styles.sectionHeading}>2. Information We Collect</Text>
              </View>
              <Text style={styles.paragraph}>
                • <Text style={styles.bold}>Contact Information:</Text> Your name, phone
                number, and delivery address provided during cart checkout or WhatsApp
                interactions.
              </Text>
              <Text style={styles.paragraph}>
                • <Text style={styles.bold}>Location Information:</Text> Approximate and
                precise GPS coordinates shared by you to facilitate accurate address
                verification and quick order delivery by our local delivery partners.
              </Text>
              <Text style={styles.paragraph}>
                • <Text style={styles.bold}>Order & Transaction History:</Text> Items
                purchased, total bill amounts, delivery status, and order identifiers.
              </Text>
              <Text style={styles.paragraph}>
                • <Text style={styles.bold}>Payment Information:</Text> Payments are
                processed securely via Razorpay (UPI, Credit/Debit cards, Net Banking).
                We do <Text style={styles.bold}>not</Text> store card numbers, CVVs, or
                UPI PINs on our servers.
              </Text>
            </View>

            <View style={styles.policySection}>
              <Text style={styles.sectionHeading}>3. How We Use Your Data</Text>
              <Text style={styles.paragraph}>
                • Fulfilling, confirming, and dispatching your orders.
              </Text>
              <Text style={styles.paragraph}>
                • Enabling assigned delivery partners to locate and deliver packages to
                your destination.
              </Text>
              <Text style={styles.paragraph}>
                • Sending real-time order updates, digital invoices, and delivery notices
                via WhatsApp and SMS.
              </Text>
              <Text style={styles.paragraph}>
                • Providing customer support and resolving delivery inquiries.
              </Text>
            </View>

            <View style={styles.policySection}>
              <View style={styles.headingWithIcon}>
                <CreditCard size={18} color={colors.primary} />
                <Text style={styles.sectionHeading}>4. Third-Party Sharing</Text>
              </View>
              <Text style={styles.paragraph}>
                We never sell or rent your information to data brokers or advertising
                networks. We share information only with:
              </Text>
              <Text style={styles.paragraph}>
                • <Text style={styles.bold}>Assigned Delivery Partners:</Text> Only the
                necessary delivery address, customer name, and contact number required to
                complete your delivery.
              </Text>
              <Text style={styles.paragraph}>
                • <Text style={styles.bold}>Razorpay:</Text> For secure, PCI-DSS compliant
                payment processing.
              </Text>
              <Text style={styles.paragraph}>
                • <Text style={styles.bold}>Microsoft Azure:</Text> For enterprise-grade
                encrypted cloud database hosting.
              </Text>
            </View>

            <View style={styles.policySection}>
              <View style={styles.headingWithIcon}>
                <Trash2 size={18} color={colors.primary} />
                <Text style={styles.sectionHeading}>5. Data Retention & Deletion Rights</Text>
              </View>
              <Text style={styles.paragraph}>
                You have the full right to request the deletion of your account, contact
                records, and past order history. To request data deletion, contact our
                support team at <Text style={styles.bold}>support@nappeediapers.com</Text>{' '}
                or message our WhatsApp care desk. Requests are processed within 15
                business days.
              </Text>
            </View>

            <View style={styles.policySection}>
              <Text style={styles.sectionHeading}>6. Children's Privacy</Text>
              <Text style={styles.paragraph}>
                Although our products are designed for infants and baby care, our ordering
                service is intended exclusively for purchase by parents and adults aged
                18 years or older.
              </Text>
            </View>

            {/* External Browser Link Button */}
            <TouchableOpacity
              style={styles.webLinkButton}
              onPress={() =>
                openUrl(
                  'https://nappee-cmfab8eyb3d9f0cf.centralindia-01.azurewebsites.net/privacy-policy'
                )
              }
            >
              <Text style={styles.webLinkText}>View Official Web Policy (Live URL)</Text>
              <ExternalLink size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================== */}
        {/* TAB 2: TERMS OF SERVICE                                        */}
        {/* ============================================================== */}
        {activeTab === 'terms' && (
          <View>
            <View style={styles.highlightCard}>
              <View style={styles.highlightHeader}>
                <FileText size={20} color={colors.primary} />
                <Text style={styles.highlightTitle}>Terms of Service</Text>
              </View>
              <Text style={styles.highlightBody}>
                Please review these Terms and Conditions before placing orders or using
                our hygiene delivery platform.
              </Text>
            </View>

            <View style={styles.policySection}>
              <Text style={styles.sectionHeading}>1. Acceptance of Terms</Text>
              <Text style={styles.paragraph}>
                By accessing this mobile application, interacting with our WhatsApp
                ordering assistant, or confirming an order, you agree to be bound by
                these Terms and Conditions and all applicable laws of India.
              </Text>
            </View>

            <View style={styles.policySection}>
              <Text style={styles.sectionHeading}>2. Products & Availability</Text>
              <Text style={styles.paragraph}>
                • We offer baby diapers (pant style, velcro), sanitary pads, and hygiene
                essentials.
              </Text>
              <Text style={styles.paragraph}>
                • All products are subject to stock availability at the local warehouse.
              </Text>
              <Text style={styles.paragraph}>
                • We endeavor to provide accurate descriptions, sizing charts, and images;
                however, packaging may vary slightly between manufacturing batches.
              </Text>
            </View>

            <View style={styles.policySection}>
              <Text style={styles.sectionHeading}>3. Pricing & Payments</Text>
              <Text style={styles.paragraph}>
                • Prices listed are in Indian Rupees (₹ INR) and include all applicable
                goods and services taxes (GST).
              </Text>
              <Text style={styles.paragraph}>
                • Payments can be completed online via Razorpay (UPI, cards, net banking)
                or Cash on Delivery where approved.
              </Text>
              <Text style={styles.paragraph}>
                • Orders are processed immediately upon payment confirmation.
              </Text>
            </View>

            <View style={styles.policySection}>
              <Text style={styles.sectionHeading}>4. Doorstep Delivery Policy</Text>
              <Text style={styles.paragraph}>
                • We aim for rapid delivery to your pin code through our fleet of assigned
                delivery partners.
              </Text>
              <Text style={styles.paragraph}>
                • You are responsible for ensuring that an authorized individual is
                available at the designated GPS location or address to receive the
                consignment.
              </Text>
            </View>

            <View style={styles.policySection}>
              <Text style={styles.sectionHeading}>5. Hygiene, Returns & Refunds</Text>
              <Text style={styles.paragraph}>
                • For hygiene and sanitary safety reasons, opened or tampered packages of
                diapers and sanitary pads cannot be returned.
              </Text>
              <Text style={styles.paragraph}>
                • In case of damaged outer packaging, manufacturing defects, or wrong item
                delivered, please report with photos within 24 hours of delivery for a
                prompt replacement or refund.
              </Text>
            </View>

            <View style={styles.policySection}>
              <Text style={styles.sectionHeading}>6. Governing Law & Jurisdiction</Text>
              <Text style={styles.paragraph}>
                These Terms and any disputes arising out of your purchases shall be
                governed by and construed in accordance with the laws of India, under the
                jurisdiction of courts in Karnataka, India.
              </Text>
            </View>

            {/* External Browser Link Button */}
            <TouchableOpacity
              style={styles.webLinkButton}
              onPress={() =>
                openUrl(
                  'https://nappee-cmfab8eyb3d9f0cf.centralindia-01.azurewebsites.net/terms'
                )
              }
            >
              <Text style={styles.webLinkText}>View Official Terms Web Page</Text>
              <ExternalLink size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ABOUT & CONTACT                                         */}
        {/* ============================================================== */}
        {activeTab === 'about' && (
          <View>
            {/* App Card */}
            <View style={styles.appInfoCard}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.appLogo}
                resizeMode="contain"
              />
              <Text style={styles.appName}>Nappee Diapers</Text>
              <Text style={styles.appTagline}>
                Premium Baby Diapers & Sanitary Hygiene Products
              </Text>
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>Version 1.0.0 (Release Build)</Text>
              </View>
            </View>

            {/* Company Details */}
            <View style={styles.policySection}>
              <Text style={styles.sectionHeading}>Company & Brand Information</Text>
              <Text style={styles.paragraph}>
                <Text style={styles.bold}>Operating Entity:</Text> Parisara Samrakshana /
                Releaf Pads
              </Text>
              <Text style={styles.paragraph}>
                <Text style={styles.bold}>Headquarters:</Text> Karnataka, India
              </Text>
            </View>

            {/* Powered By Navabharath Technologies */}
            <View style={styles.poweredByCard}>
              <Text style={styles.poweredByTitle}>Powered By Navabharath Technologies</Text>
              <Image
                source={require('../assets/navabharath_logo.png')}
                style={styles.navabharathLogo}
                resizeMode="contain"
              />
              <Text style={styles.poweredByCompanyName}>Navabharath Technologies</Text>
            </View>

            {/* Contact & Support */}
            <View style={styles.policySection}>
              <Text style={styles.sectionHeading}>Customer Support & Grievances</Text>
              <Text style={styles.paragraph}>
                Have a question about an order, delivery status, or data privacy? Our
                support team is here to assist you:
              </Text>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => openUrl('mailto:support@nappeediapers.com')}
              >
                <View style={styles.contactIconContainer}>
                  <Mail size={18} color={colors.primary} />
                </View>
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>Email Support</Text>
                  <Text style={styles.contactValue}>support@nappeediapers.com</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => openUrl('tel:+91919663759957')}
              >
                <View style={styles.contactIconContainer}>
                  <Phone size={18} color={colors.primary} />
                </View>
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>Phone / WhatsApp Support</Text>
                  <Text style={styles.contactValue}>+91 919663759957</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Google Play Compliance Note */}
            <View style={styles.complianceCard}>
              <HelpCircle size={18} color="#0284c7" />
              <Text style={styles.complianceText}>
                This application complies with Google Play Developer Program Policies,
                Data Safety standards, and the Information Technology Rules of India.
              </Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 Nappee Diapers • All rights reserved
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkPurple,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.mutedText,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    gap: 6,
  },
  tabItemActive: {
    backgroundColor: '#FDF2F8',
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedText,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  highlightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.darkPurple,
  },
  highlightBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
  },
  policySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  headingWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.darkPurple,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 21,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '700',
    color: colors.darkPurple,
  },
  webLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FDF2F8',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F472B6',
    marginTop: 8,
    marginBottom: 16,
  },
  webLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  appInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  appLogo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.darkPurple,
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 13,
    color: colors.mutedText,
    textAlign: 'center',
    marginBottom: 12,
  },
  versionBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  poweredByCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  poweredByTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.darkPurple,
    letterSpacing: 0.4,
    marginBottom: 12,
    textAlign: 'center',
  },
  navabharathLogo: {
    width: 180,
    height: 120,
    marginBottom: 8,
  },
  poweredByCompanyName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  contactIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    color: colors.mutedText,
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 14,
    color: colors.darkPurple,
    fontWeight: '600',
    marginTop: 2,
  },
  complianceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginTop: 4,
    marginBottom: 12,
  },
  complianceText: {
    flex: 1,
    fontSize: 12,
    color: '#0369A1',
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    marginTop: 12,
  },
  footerText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
