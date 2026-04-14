/**
 * Kvalt Design System — Demo Data
 *
 * All demo/seed data for the design system's component examples and Screen Vault.
 * Built around a single fictional company: The Quill & Ledger
 *
 * The Quill & Ledger — Contract & Document Platform
 * A SaaS tool for legal and ops teams to draft, sign, track, and manage
 * business contracts and legal documents across their organisation.
 *
 * Domain:   quillledger.com
 * Industry: Legal-tech / SaaS
 * Stage:    Series A, ~40 employees
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type DemoUser = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Suspended';
  joined: string;
  avatarIndex?: number; // 0–19 maps to avatarList
};

export type DemoContract = {
  id: string;
  title: string;
  counterparty: string;
  type: string;
  status: 'Draft' | 'In Review' | 'Pending Signature' | 'Signed' | 'Expired' | 'Terminated';
  owner: string;
  created: string;
  expires: string;
  value: string;
};

export type DemoActivity = {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
};

// ─── Team ─────────────────────────────────────────────────────────────────────

export const demoTeam: DemoUser[] = [
  {
    id: 'u1',
    name: 'Mara Okafor',
    initials: 'MO',
    email: 'mara.okafor@quillledger.com',
    role: 'General Counsel',
    department: 'Legal',
    status: 'Active',
    joined: '2022-03-14',
    avatarIndex: 0,
  },
  {
    id: 'u2',
    name: 'James Whitfield',
    initials: 'JW',
    email: 'james.whitfield@quillledger.com',
    role: 'Account Manager',
    department: 'Sales',
    status: 'Active',
    joined: '2022-07-01',
    avatarIndex: 11,
  },
  {
    id: 'u3',
    name: 'Priya Nair',
    initials: 'PN',
    email: 'priya.nair@quillledger.com',
    role: 'Operations Lead',
    department: 'Operations',
    status: 'Active',
    joined: '2022-11-20',
    avatarIndex: 2,
  },
  {
    id: 'u4',
    name: 'Lucas Ferreira',
    initials: 'LF',
    email: 'lucas.ferreira@quillledger.com',
    role: 'Contract Specialist',
    department: 'Legal',
    status: 'Active',
    joined: '2023-01-09',
    avatarIndex: 13,
  },
  {
    id: 'u5',
    name: 'Sophie Hartmann',
    initials: 'SH',
    email: 'sophie.hartmann@quillledger.com',
    role: 'Finance Analyst',
    department: 'Finance',
    status: 'Active',
    joined: '2023-04-17',
    avatarIndex: 4,
  },
  {
    id: 'u6',
    name: 'David Osei',
    initials: 'DO',
    email: 'david.osei@quillledger.com',
    role: 'Account Manager',
    department: 'Sales',
    status: 'Pending',
    joined: '2024-01-03',
    avatarIndex: 15,
  },
  {
    id: 'u7',
    name: 'Camille Rousseau',
    initials: 'CR',
    email: 'camille.rousseau@quillledger.com',
    role: 'Legal Reviewer',
    department: 'Legal',
    status: 'Active',
    joined: '2023-08-28',
    avatarIndex: 6,
  },
  {
    id: 'u8',
    name: 'Ben Nakamura',
    initials: 'BN',
    email: 'ben.nakamura@quillledger.com',
    role: 'Contract Specialist',
    department: 'Legal',
    status: 'Inactive',
    joined: '2023-06-12',
    avatarIndex: 17,
  },
  {
    id: 'u9',
    name: 'Aaliya Shah',
    initials: 'AS',
    email: 'aaliya.shah@quillledger.com',
    role: 'Operations Manager',
    department: 'Operations',
    status: 'Active',
    joined: '2023-10-05',
    avatarIndex: 8,
  },
  {
    id: 'u10',
    name: 'Tom Eriksson',
    initials: 'TE',
    email: 'tom.eriksson@quillledger.com',
    role: 'Administrator',
    department: 'IT',
    status: 'Active',
    joined: '2022-05-30',
    avatarIndex: 19,
  },
];

// ─── Contracts ────────────────────────────────────────────────────────────────

export const demoContracts: DemoContract[] = [
  {
    id: 'c1',
    title: 'Enterprise SaaS Agreement',
    counterparty: 'Meridian Capital Group',
    type: 'Subscription',
    status: 'Signed',
    owner: 'Mara Okafor',
    created: '2024-01-10',
    expires: '2025-01-10',
    value: '$84,000/yr',
  },
  {
    id: 'c2',
    title: 'Data Processing Addendum',
    counterparty: 'Meridian Capital Group',
    type: 'Addendum',
    status: 'Signed',
    owner: 'Lucas Ferreira',
    created: '2024-01-15',
    expires: '2025-01-10',
    value: '—',
  },
  {
    id: 'c3',
    title: 'MSA — Professional Services',
    counterparty: 'Ironclad Ventures LLC',
    type: 'Services',
    status: 'In Review',
    owner: 'Camille Rousseau',
    created: '2024-03-02',
    expires: '2025-03-02',
    value: '$36,000',
  },
  {
    id: 'c4',
    title: 'Non-Disclosure Agreement',
    counterparty: 'Beacon Analytics',
    type: 'NDA',
    status: 'Pending Signature',
    owner: 'James Whitfield',
    created: '2024-04-18',
    expires: '2027-04-18',
    value: '—',
  },
  {
    id: 'c5',
    title: 'Reseller Partner Agreement',
    counterparty: 'Atlas Distribution Co.',
    type: 'Partnership',
    status: 'Draft',
    owner: 'Priya Nair',
    created: '2024-05-07',
    expires: '2025-05-07',
    value: 'Commission-based',
  },
  {
    id: 'c6',
    title: 'Cloud Infrastructure Agreement',
    counterparty: 'Stratos Cloud Inc.',
    type: 'Vendor',
    status: 'Signed',
    owner: 'Tom Eriksson',
    created: '2023-09-01',
    expires: '2024-09-01',
    value: '$120,000/yr',
  },
  {
    id: 'c7',
    title: 'Employment Contract — Aaliya Shah',
    counterparty: 'Internal',
    type: 'Employment',
    status: 'Signed',
    owner: 'Mara Okafor',
    created: '2023-10-04',
    expires: 'N/A',
    value: 'Confidential',
  },
  {
    id: 'c8',
    title: 'Security Audit SoW',
    counterparty: 'Fortress Compliance Ltd.',
    type: 'Services',
    status: 'Expired',
    owner: 'Aaliya Shah',
    created: '2023-02-20',
    expires: '2024-02-20',
    value: '$18,500',
  },
];

// ─── Recent Activity ──────────────────────────────────────────────────────────

export const demoActivity: DemoActivity[] = [
  { id: 'a1', user: 'Mara Okafor',    action: 'Signed',          target: 'Enterprise SaaS Agreement',       timestamp: '2024-05-12T14:32:00Z' },
  { id: 'a2', user: 'James Whitfield', action: 'Sent for review', target: 'NDA — Beacon Analytics',           timestamp: '2024-05-12T11:07:00Z' },
  { id: 'a3', user: 'Camille Rousseau', action: 'Left a comment', target: 'MSA — Professional Services',      timestamp: '2024-05-11T16:45:00Z' },
  { id: 'a4', user: 'Lucas Ferreira',  action: 'Uploaded',        target: 'Data Processing Addendum v3.pdf', timestamp: '2024-05-11T09:21:00Z' },
  { id: 'a5', user: 'Priya Nair',      action: 'Created draft',   target: 'Reseller Partner Agreement',      timestamp: '2024-05-10T13:55:00Z' },
  { id: 'a6', user: 'Tom Eriksson',    action: 'Archived',        target: 'Security Audit SoW',              timestamp: '2024-05-09T10:00:00Z' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Flat table-friendly shape for DataTable demos */
export type DemoTeamRow = {
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  joined: string;
};

export const demoTeamRows: DemoTeamRow[] = demoTeam.map(({ name, email, role, department, status, joined }) => ({
  name,
  email,
  role,
  department,
  status,
  joined,
}));
