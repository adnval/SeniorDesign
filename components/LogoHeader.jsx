import { StyleSheet, Text, View, Image } from 'react-native'
import { hp, wp } from "helpers/common";
import { theme } from 'constants/theme';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';


import React from 'react'
import BackButton from './BackButton';

const LogoHeader = ({
  title,
  showBackButton = false,
  mb = 10,
}) => {
  const router = useRouter();

  return (
    <View style={[styles.headerContainer, { marginBottom: mb }]}>
      {showBackButton && (
        <View style={styles.backButton}>
          <BackButton router={router} />
        </View>
      )}

      <Text style={styles.title}>{title || "Locale"}</Text>
    </View>
  );
};

export default LogoHeader;

const styles = StyleSheet.create({
  headerContainer: {
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: wp(4),
    justifyContent: 'center',
  },
  title: {
    fontSize: hp(3),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.onSecondary,
  },
});
