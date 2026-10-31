import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { colors } from '../../src/theme/colors';
import { ShieldCheck } from 'lucide-react-native';

export default function CustomerLayout() {
  const router = useRouter();

  return (
    <Stack screenOptions={{ 
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: colors.white,
      headerTitleStyle: { fontWeight: 'bold' },
      contentStyle: { backgroundColor: colors.background } 
    }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Nappee Diapers (Online)',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/legal')} 
              style={{ marginRight: 8, padding: 4 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ShieldCheck size={22} color={colors.white} />
            </TouchableOpacity>
          )
        }} 
      />
    </Stack>
  );
}
