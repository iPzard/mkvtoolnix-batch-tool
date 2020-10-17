import { IconButton } from '@fluentui/react/lib/Button';
import React from 'react';
import styles from 'components/titlebar/scss/TitlebarButtons.module.scss';

/**
 * @description Titlebar minimize button.
 * @property {*} props - Optional props drilled down from parent component (e.g., className).
 *
 * @memberof Titlebar
 */

export const MinimizeButton = props => (
  <IconButton
    ariaLabel="Minimize"
    className={ styles.button }
    iconProps={{ iconName: 'ChromeMinimize' }}
    title="Minimize"
    { ...props }
  />
);

/**
 * @description Titlebar close button.
 * @property {*} props - Optional props drilled down from parent component (e.g., className).
 *
 * @memberof Titlebar
 */
export const CloseButton = props => (
  <IconButton
    ariaLabel="Close"
    className={ styles.button }
    iconProps={{ iconName: 'ChromeClose' }}
    title="Close"
    { ...props }
  />
);