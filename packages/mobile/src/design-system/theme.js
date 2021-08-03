import React from 'react';
import {extendTheme, NativeBaseProvider} from 'native-base';
import {ThemeProvider as SCThemeProvider} from 'styled-components/native';

export const Theme = {
  fontFamily: {
    nunitoSans: 'Nunito Sans',
    montserrat: 'Montserrat',
  },
  colors: {
    backdrop: 'rgba(0, 0, 0, 0.6)',
    transparent: 'transparent',
    text: '#D4D4D8',
    textHighlighted: '#ffffff',
    modalBackground: '#18181B',
    description: '#A1A1AA',
    info2: '#1E75C5',
    info: '#0284C7',
    error: '#DC2626',
    errorText: '#F87171',
    dividerBackground: '#ccc',
    headerText: '#fff',
    primaryBackground: '#18181B',
    secondaryBackground: '#27272A',
    tertiaryBackground: '#3F3F46',
    circleChecked: '#34D399',
    circleUnckecked: '#71717A',
  },
  screen: {
    backgroundColor: '#18181B',
  },
  button: {
    backgroundColor: '#1E75C5',
    textColor: '#fff',
  },
};

export function useTheme() {
  return {
    theme: Theme,
  };
}

const nBaseTheme = extendTheme({
  colors: {
    primary: {
      // 50: '#E3F2F9',
      // 100: '#C5E4F3',
      // 200: '#A2D4EC',
      // 300: '#ccc',
      
      400: Theme.colors.info2,
      
      // 500: '#0088CC',
      // 600: '#007AB8',
      // 700: '#006BA1',
      // 800: '#005885',
      // 900: '#003F5E',
    },
  },
  components: {
    Input: {
      baseStyle: {
        background: 'black',
        borderColor: Theme.colors.secondaryBackground,
        backgroundColor: Theme.colors.secondaryBackground,
        fontSize: '19px',
        _hover: {
          borderColor: Theme.colors.secondaryBackground
        },
        _focus: {
          borderColor: Theme.colors.secondaryBackground
        },
        
      },
      defaultProps: {
        w:"100%",
        bg: 'red',
      },
      variants: {
        outline: () => ({
          borderWidth: 0,
          borderColor: '#ccc'
        })
      }
    },
    Text: {
      baseStyle: (props) => ({
        fontFamily: !props.montserrat ? 'Nunito Sans' : 'Montserrat'
      }),
    },
    Button: {
      baseStyle: (props) => ({
        _stack: {
          my: 1
        },
        _text: {
          color: Theme.colors.textHighlighted,
        },
        borderRadius: 6,
      }),
      defaultProps: {
        // _stack: {
        //   my: 1
        // },
        // _text: {
        //   color: '#fff'
        // },
      }
    }
  },
  config: {
    initialColorMode: 'dark',
  },
})

export function ThemeProvider({children}) {
  return (
    <SCThemeProvider theme={Theme}>
      <NativeBaseProvider theme={nBaseTheme}>{children}</NativeBaseProvider>
    </SCThemeProvider>
  );
}
