export type UserRole = 'Technician' | 'Ophthalmologist';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  // Technician-specific fields
  operatorId?: string;
  centerName?: string;
  district?: string;
  // Ophthalmologist-specific fields
  medicalCouncilRegNo?: string;
  hospitalAffiliation?: string;
  subSpecialty?: string;
  designation?: string;
  createdAt: string;
}

export interface StoredUser extends UserProfile {
  passwordHash: string;
}

// Default pre-seeded clinical and field accounts
const defaultUsers: StoredUser[] = [
  {
    id: 'usr-tech-01',
    name: 'Anjali Devi',
    email: 'anjali.devi@ruralhealth.gov.in',
    role: 'Technician',
    phone: '+91 94350 12844',
    operatorId: 'TECH-AS-401',
    centerName: 'Sonitpur Rural Vision Centre / PHC',
    district: 'Sonitpur, Assam',
    createdAt: '2026-08-01T09:00:00.000Z',
    passwordHash: 'password123',
  },
  {
    id: 'usr-ophth-01',
    name: 'Dr. Rajesh Sharma, MS',
    email: 'dr.sharma@ruralhealth.gov.in',
    role: 'Ophthalmologist',
    phone: '+91 98640 55910',
    medicalCouncilRegNo: 'NMC-OPH-88421',
    hospitalAffiliation: 'Regional Institute of Ophthalmology / GMCH',
    subSpecialty: 'Vitreo-Retina & Diabetic Eye Disease',
    designation: 'Senior Consultant Ophthalmologist',
    createdAt: '2026-07-15T11:00:00.000Z',
    passwordHash: 'password123',
  },
];

let globalUsers: StoredUser[] = [...defaultUsers];

export function getUsers(): UserProfile[] {
  return globalUsers.map(({ passwordHash: _, ...rest }) => rest);
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return globalUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function registerUser(userData: {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  operatorId?: string;
  centerName?: string;
  district?: string;
  medicalCouncilRegNo?: string;
  hospitalAffiliation?: string;
  subSpecialty?: string;
  designation?: string;
}): { success: boolean; user?: UserProfile; error?: string } {
  const existing = findUserByEmail(userData.email);
  if (existing) {
    return { success: false, error: 'An account with this email address already exists.' };
  }

  const id = `usr-${userData.role === 'Technician' ? 'tech' : 'ophth'}-${Date.now().toString(36)}`;
  const newUser: StoredUser = {
    id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    phone: userData.phone || '',
    operatorId: userData.operatorId || (userData.role === 'Technician' ? `TECH-${Math.floor(1000 + Math.random() * 9000)}` : undefined),
    centerName: userData.centerName || (userData.role === 'Technician' ? 'Primary Health Centre' : undefined),
    district: userData.district || '',
    medicalCouncilRegNo: userData.medicalCouncilRegNo || (userData.role === 'Ophthalmologist' ? `NMC-${Math.floor(10000 + Math.random() * 90000)}` : undefined),
    hospitalAffiliation: userData.hospitalAffiliation || (userData.role === 'Ophthalmologist' ? 'District Eye Hospital' : undefined),
    subSpecialty: userData.subSpecialty || (userData.role === 'Ophthalmologist' ? 'General Ophthalmology' : undefined),
    designation: userData.designation || (userData.role === 'Ophthalmologist' ? 'Consultant Ophthalmologist' : 'Vision Screener'),
    createdAt: new Date().toISOString(),
    passwordHash: userData.password || 'password123',
  };

  globalUsers.push(newUser);
  const { passwordHash: _, ...safeUser } = newUser;
  return { success: true, user: safeUser };
}

export function authenticateUser(
  email: string,
  password?: string,
  expectedRole?: UserRole
): { success: boolean; user?: UserProfile; error?: string } {
  const user = findUserByEmail(email);
  if (!user) {
    return { success: false, error: 'Account not found. Please register or check your email.' };
  }

  if (password && user.passwordHash && user.passwordHash !== password) {
    return { success: false, error: 'Incorrect password entered.' };
  }

  if (expectedRole && user.role !== expectedRole) {
    return {
      success: false,
      error: `This account is registered as a ${user.role}, not as ${expectedRole}.`,
    };
  }

  const { passwordHash: _, ...safeUser } = user;
  return { success: true, user: safeUser };
}
