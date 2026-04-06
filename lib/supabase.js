import { AppState, Platform } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js' // ✅ removed processLock import
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/constants'

const supabaseUrl = SUPABASE_URL
const supabaseAnonKey = SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,        // ✅ always use AsyncStorage, not platform-conditional
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
                                  // ✅ removed processLock entirely
  },
})

if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
}