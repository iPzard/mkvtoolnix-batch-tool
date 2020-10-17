/**
 * @namespace Themes
 * @description - Themes for Microsoft Fluent UI, which is built into the project.
 *
 * @tutorial - https://www.aka.ms/themedesigner
*/

export const darkTheme = {
  themePrimary: '#bf7e45',
  themeLighterAlt: '#080503',
  themeLighter: '#1f140b',
  themeLight: '#392615',
  themeTertiary: '#734c29',
  themeSecondary: '#a86f3d',
  themeDarkAlt: '#c68954',
  themeDark: '#cf996a',
  themeDarker: '#dbb18d',
  neutralLighterAlt: '#303030',
  neutralLighter: '#383838',
  neutralLight: '#464646',
  neutralQuaternaryAlt: '#4e4e4e',
  neutralQuaternary: '#555555',
  neutralTertiaryAlt: '#727272',
  neutralTertiary: '#f8f8f8',
  neutralSecondary: '#f9f9f9',
  neutralPrimaryAlt: '#fafafa',
  neutralPrimary: '#f5f5f5',
  neutralDark: '#fdfdfd',
  black: '#fefefe',
  white: '#252525',
};

export const lightTheme = {
  themePrimary: '#0078d4',
  themeLighterAlt: '#eff6fc',
  themeLighter: '#deecf9',
  themeLight: '#c7e0f4',
  themeTertiary: '#71afe5',
  themeSecondary: '#2b88d8',
  themeDarkAlt: '#106ebe',
  themeDark: '#005a9e',
  themeDarker: '#004578',
  neutralLighterAlt: '#faf9f8',
  neutralLighter: '#f3f2f1',
  neutralLight: '#edebe9',
  neutralQuaternaryAlt: '#e1dfdd',
  neutralQuaternary: '#d0d0d0',
  neutralTertiaryAlt: '#c8c6c4',
  neutralTertiary: '#a19f9d',
  neutralSecondary: '#605e5c',
  neutralPrimaryAlt: '#3b3a39',
  neutralPrimary: '#323130',
  neutralDark: '#201f1e',
  black: '#252525',
  white: '#fefefe',
};

/**
 * @description - Function to toggle theme pallet
 */
export const togglePalette = (theme) => {
  const setProperty = (item, value) => {
    const root = window.document.documentElement;
    root.style.setProperty(item, value);
  };

  const setDark = () => {
    setProperty('--active-state', 'rgba(254, 254, 254, .2)');
    setProperty('--background-color', 'rgba(254, 254, 254, .5)');
    setProperty('--black', '#252525');
    setProperty('--border', 'solid 1px rgba(254, 254, 254, .1)');
    setProperty('--hover-state', 'rgba(254, 254, 254, .1)');
    setProperty('--loading-background-color', 'rgba(0, 0, 0, .6)');
    setProperty('--primary', '#bf7e45');
    setProperty('--white', '#fefefe');
  };

  const setLight = () => {
    setProperty('--active-state', 'rgba(37, 37, 37, .2)');
    setProperty('--background-color', 'rgba(37, 37, 37, .5)');
    setProperty('--black', '#fefefe');
    setProperty('--border', 'solid 1px rgba(37, 37, 37, .25)');
    setProperty('--hover-state', 'rgba(37, 37, 37, .1)');
    setProperty('--loading-background-color', 'rgba(0, 0, 0, .75)');
    setProperty('--primary', '#0078d4');
    setProperty('--white', '#252525');
  };

  if(theme === 'light') setLight();
  else setDark();
};