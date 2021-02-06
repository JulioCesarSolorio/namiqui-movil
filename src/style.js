import { StyleSheet } from 'react-native';

export const colors = {
  COLOR_BACKGROUND_GRAY: '#302F2F',
  COLOR_BACKGROUND_GRAY_STRONG: '#1e1e1e',
  COLOR_SELECTED: '#E72945',
  COLOR_DANGER: '#E72945',
  COLOR_TEXT_BLACK_DEFAULT: '#3b3b3b',
  COLOR_BORDER: '#e7eaec',
};

export default StyleSheet.create({
  TextInput: {
    fontFamily: 'Kollektif',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 5,
    marginVertical: 2,
    paddingLeft: 15,
    flex: 1,
  },
  noBorder: {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  stepIndicatorContainer: {
    width: '90%',
    alignSelf: 'center',
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  stepIndicator: {
    backgroundColor: colors.COLOR_BACKGROUND_GRAY,
    padding: 5,
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  selected: {
    color: colors.COLOR_SELECTED,
  },
  backGroundSelected: {
    backgroundColor: colors.COLOR_SELECTED,
  },
  darkText: {
    color: 'gray',
  },
  planContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  smileyContainer: {
    height: 50,
    width: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smiley: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  //= ================================ TEXT  ================================
  textH3: {
    fontSize: 20,
  },
  textSmall: {
    fontSize: 12,
  },
  textSmallDanger: {
    fontSize: 12,
    color: colors.COLOR_SELECTED,
  },

});
