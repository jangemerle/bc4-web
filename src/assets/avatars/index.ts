/**
 * Demo avatar photos — 20 portraits from Figma (10 women, 10 men).
 * Each has a matching background color for the avatar circle.
 *
 * Usage:
 *   import { avatars } from '../assets/avatars';
 *   <UserAvatar src={avatars.woman1.src} style={{ backgroundColor: avatars.woman1.bg }} />
 */

import woman1 from './woman-1.png';
import woman2 from './woman-2.png';
import woman3 from './woman-3.png';
import woman4 from './woman-4.png';
import woman5 from './woman-5.png';
import woman6 from './woman-6.png';
import woman7 from './woman-7.png';
import woman8 from './woman-8.png';
import woman9 from './woman-9.png';
import woman10 from './woman-10.png';
import man1 from './man-1.png';
import man2 from './man-2.png';
import man3 from './man-3.png';
import man4 from './man-4.png';
import man5 from './man-5.png';
import man6 from './man-6.png';
import man7 from './man-7.png';
import man8 from './man-8.png';
import man9 from './man-9.png';
import man10 from './man-10.png';

export interface DemoAvatar {
  src: string;
  bg: string;
  label: string;
}

export const avatars: Record<string, DemoAvatar> = {
  woman1:  { src: woman1,  bg: '#788217', label: 'Woman 1' },
  woman2:  { src: woman2,  bg: '#edbaa4', label: 'Woman 2' },
  woman3:  { src: woman3,  bg: '#eda4b1', label: 'Woman 3' },
  woman4:  { src: woman4,  bg: '#d9c4e9', label: 'Woman 4' },
  woman5:  { src: woman5,  bg: '#cebab4', label: 'Woman 5' },
  woman6:  { src: woman6,  bg: '#e7aeae', label: 'Woman 6' },
  woman7:  { src: woman7,  bg: '#e7becf', label: 'Woman 7' },
  woman8:  { src: woman8,  bg: '#b9dfc8', label: 'Woman 8' },
  woman9:  { src: woman9,  bg: '#edd9a4', label: 'Woman 9' },
  woman10: { src: woman10, bg: '#d9e7bb', label: 'Woman 10' },
  man1:    { src: man1,    bg: '#b7ded7', label: 'Man 1' },
  man2:    { src: man2,    bg: '#aea4ed', label: 'Man 2' },
  man3:    { src: man3,    bg: '#edc3a4', label: 'Man 3' },
  man4:    { src: man4,    bg: '#c4d7c7', label: 'Man 4' },
  man5:    { src: man5,    bg: '#eda4a4', label: 'Man 5' },
  man6:    { src: man6,    bg: '#a4a1a6', label: 'Man 6' },
  man7:    { src: man7,    bg: '#c7e8c2', label: 'Man 7' },
  man8:    { src: man8,    bg: '#ccdade', label: 'Man 8' },
  man9:    { src: man9,    bg: '#a4dced', label: 'Man 9' },
  man10:   { src: man10,   bg: '#edcba4', label: 'Man 10' },
};

export const avatarList = Object.values(avatars);
