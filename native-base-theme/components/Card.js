// @flow

import variable from './../variables/platform';

export default (variables /* : * */ = variable) => {
  const cardTheme = {
    '.transparent': {
      shadowColor: null,
      shadowOffset: null,
      shadowOpacity: null,
      shadowRadius: null,
      elevation: null,
      backgroundColor: 'transparent',
      borderWidth: 0
    },
    '.noShadow': {
      shadowColor: null,
      shadowOffset: null,
      shadowOpacity: null,
      elevation: null
    },
    marginTop: 5,
    // marginHorizontal: 2,
    paddingHorizontal: 0,
    borderWidth: 0,
    borderRadius: variables.cardBorderRadius,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: variables.cardBorderColor,
    flexWrap: 'nowrap',
    backgroundColor: variables.cardDefaultBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
    flex: 1,
  };

  return cardTheme;
};
