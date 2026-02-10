/**
 * Game Configuration
 * Centralized configuration file for all game constants and settings
 */

export const Config = {
  /**
   * Intro Screen Configuration
   */
  intro: {
    /** Path to the intro text file relative to dist/renderer/ */
    textFilePath: '../assets/txt/intro.txt',

    /** Duration of fade in effect in seconds */
    fadeInTime: 0.5,

    /** Duration text is fully visible in seconds */
    displayTime: 4.0,

    /** Duration of fade out effect in seconds */
    fadeOutTime: 0.5,

    /** Font size for intro text */
    fontSize: 24,

    /** Text color */
    textColor: '#ffffff',
  },

  /**
   * Title Screen Configuration
   */
  title: {
    /** Title text */
    titleText: 'Roundabouts Are Better',

    /** Title font size */
    titleFontSize: 48,

    /** Title text color */
    titleColor: '#ffffff',

    /** Title vertical offset from center */
    titleOffsetY: -100,

    /** Button configuration */
    button: {
      width: 200,
      height: 60,
      spacing: 20,
      fontSize: 24,
      textColor: '#ffffff',
      backgroundColor: '#222222',
      backgroundColorHover: '#444444',
      borderColor: '#666666',
      borderColorHover: '#ffffff',
      borderWidth: 2,
    },

    /** Vertical offset for buttons from center */
    buttonOffsetY: 50,
  },

  /**
   * Canvas Configuration
   */
  canvas: {
    /** Background color */
    backgroundColor: '#000000',
  },

  /**
   * General Text Configuration
   */
  text: {
    /** Default font family */
    fontFamily: 'Arial, sans-serif',
  },
} as const;
