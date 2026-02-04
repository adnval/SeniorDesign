import { hp, wp } from "helpers/common";
import { StyleSheet} from 'react-native'


export const theme = {
    colors: {
        primary: "#d141e3",
        onPrimary: "#fdfcff",
        secondary: "#1e103c",
        onSecondary: "#f5e4fe",
        accent: "#e8f0f7",
        onAccent: "#1f0acd",
        success: "#a6e075",
        error: "#d16a28",
        warning: "#e5d976",
        info: "#b0d9f3",
        neutral: "#434343",
        onNeutral: "#f7f7f7",
    },
};

export const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingHorizontal: wp(5),
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
    alignSelf: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: 8,
  },
  buttonText: {
    color: theme.colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shadowStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  footer: {
    width: '100%',
    gap: hp(2), 
 },
 primaryText: {
    color: theme.colors.primary,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',

    },
secondaryText: {
    color: theme.colors.secondary,
    fontSize: 14,
    textAlign: 'center',
    },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(2),
    },
    container: {
      flex: 1,
      paddingHorizontal: wp(5),
      backgroundColor: 'white',
    },
});