/**
 * BC4Cloud — Kontakt (CS)
 *
 * Alternativa k poptávkovému formuláři pro lidi, kteří chtějí mluvit přímo.
 * Kontaktní údaje MUSÍ být ověřeny s BusinessComem před publikací.
 */

import type { ContactContent } from '../types';

export const contact: ContactContent = {
  seo: {
    title: 'Kontakt | BC4Cloud',
    description: 'Kontakt na obchod, podporu a vedení BC4Cloud. Česká podpora, ústředí v Praze.',
    ogImage: '/og/contact.png', // TODO
  },

  hero: {
    eyebrow: 'KONTAKT',
    headline: 'Ozvěte se jakýmkoli způsobem, co vám vyhovuje.',
    subheadline: 'Preferujete formulář, email nebo telefon — všechny jdou přímo na konkrétního člověka, ne do fronty ticketů.',
  },

  channels: [
    {
      name: 'Poptávka nového řešení',
      description: 'Zajímá vás ukázka nebo cenová nabídka. Vyplňte formulář, ozveme se obvykle do několika minut.',
      contact: '/poptavka',
      contactType: 'form',
      icon: 'Rocket',
    },
    {
      name: 'Obchodní dotazy',
      description: 'Konkrétní otázky na ceník, custom řešení, enterprise plán, hybridní nasazení.',
      contact: 'obchod@bc4cloud.cz', // TODO: ověřit email
      contactType: 'email',
      icon: 'Mail',
    },
    {
      name: 'Technická podpora',
      description: 'Jste náš zákazník a potřebujete pomoc s aktivním nasazením.',
      contact: '+420 261 303 303', // TODO: ověřit — z projektové dokumentace
      contactType: 'phone',
      icon: 'Headphones',
    },
    {
      name: 'Tiskové dotazy',
      description: 'Média, analytici, partnerství.',
      contact: 'pr@businesscom.cz', // TODO: ověřit
      contactType: 'email',
      icon: 'Newspaper',
    },
  ],

  company: {
    headline: 'BusinessCom a.s.',
    name: 'BusinessCom a.s.',
    address: [
      'Dobrušská 1797/1',
      '147 00 Praha 4',
      'Česká republika',
    ],
    ico: '27426653',
    dic: 'CZ27426653', // TODO: ověřit
    email: 'info@bc4.cz', // TODO: případně změnit na info@bc4cloud.cz
    phone: '+420 261 303 303',
  },

  // Mapa — volitelné, zvážit v druhé iteraci
  mapEmbed: {
    lat: 50.0400,
    lng: 14.4500, // TODO: ověřit přesné souřadnice Dobrušské 1797/1
    zoom: 15,
  },
};
