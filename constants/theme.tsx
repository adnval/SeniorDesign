import { hp, wp } from "helpers/common";
import { StyleSheet} from 'react-native'


export const theme = {
    colors: {
        primary: "#8331d1",
        onPrimary: "#fdfcff",
        secondary: "#dbc3eb",
        onSecondary: "#43286d",
        accent: "#57e1d7",
        onAccent: "#0000fb",
        tertiary: "#fad008",
        onTertiary: "#ba2d7b",
        surface: "#f5effd",
        warning: "#ff0000",
    },
    radius: {
        sm: 4,
        md: 8,
        lg: 12,
    },
    fonts: {
        bold: "700",
        semibold: "600",
        medium: "500",
        regular: "400",
    }
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
    color: theme.colors.onSecondary,
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
      paddingHorizontal: wp(10),
      backgroundColor: 'white',
    },
    subtitle:{
      textAlign: 'center',
      paddingHorizontal: wp(10),
      fontSize: hp(2),
      color: theme.colors.onSecondary,
    },
    middleContent: {
      flex: 1,
      marginTop: hp(10),
      marginBottom: hp(20),
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
    },
});