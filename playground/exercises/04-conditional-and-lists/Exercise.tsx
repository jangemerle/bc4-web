import { useState } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

// TODO: Define a Contact interface with: id (string), name, email, role, active (boolean)

// ─── Data ───────────────────────────────────────────────────────────────────

// TODO: Create a CONTACTS array with 6-8 contacts.
// Give them different roles ("Designer", "Engineer", "PM") and mix active/inactive.
// Example:
// { id: '1', name: 'Marta Novak', email: 'marta@example.com', role: 'Designer', active: true },

const CONTACTS: never[] = []; // Replace `never[]` with your Contact[]

// ─── ContactItem ────────────────────────────────────────────────────────────

// TODO: Build a component that renders a single contact row.
// Props: contact (Contact), selected (boolean), onClick
// Show: name, role, and an active/inactive indicator (a colored dot, text, whatever you like)
// Highlight the row visually when `selected` is true

function ContactItem({ contact, selected, onClick }: {
  contact: any; // TODO: type this properly
  selected: boolean;
  onClick: () => void;
}) {
  // TODO: implement the contact row
  return (
    <div onClick={onClick}>
      {/* Your contact row here */}
    </div>
  );
}

// ─── ContactDetail ──────────────────────────────────────────────────────────

// TODO: Build a component that shows the full details of a selected contact.
// Props: contact (Contact)
// Show: name, email, role, active status
// Style it like a card or panel

function ContactDetail({ contact }: { contact: any }) {
  // TODO: implement the detail view
  return (
    <div>
      {/* Your detail panel here */}
    </div>
  );
}

// ─── Main Exercise ──────────────────────────────────────────────────────────

export default function Exercise() {
  // TODO: Set up state for:
  // - search text (string)
  // - selected contact id (string | null)
  // - show-active-only filter (boolean)

  // TODO: Derive the filtered list from CONTACTS.
  // Chain .filter() calls for each active filter (search text, active-only).
  // Remember: case-insensitive search means comparing .toLowerCase() values.

  // TODO: Find the selected contact from the filtered list (or full list — your call).
  // Think about: what should happen if the selected contact gets filtered out?

  // TODO: Use an early return somewhere meaningful.
  // For example: if CONTACTS is empty, return a "No data" message.

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
        Contact List
      </h2>

      {/* TODO: Search input */}
      {/* <input type="text" placeholder="Search contacts..." ... /> */}

      {/* TODO: "Show active only" checkbox */}
      {/* <label><input type="checkbox" ... /> Show active only</label> */}

      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
        {/* TODO: Contact list */}
        {/* Use .map() with a proper key to render ContactItem for each filtered contact */}
        {/* If filtered list is empty, show "No contacts found" with && pattern */}
        <div style={{ flex: 1 }}>
          {/* Your list here */}
        </div>

        {/* TODO: Detail panel */}
        {/* Use a ternary: selected contact ? <ContactDetail /> : <EmptyState /> */}
        <div style={{ flex: 1 }}>
          {/* Your detail panel or empty state here */}
        </div>
      </div>
    </div>
  );
}
