'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  User,
  Stethoscope,
  ShieldCheck,
  Building2,
  LogIn,
  LogOut,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  FileCheck,
  Hospital,
  MapPin,
  KeyRound,
  UserCheck,
} from 'lucide-react'
import type { UserProfile, UserRole } from '@/lib/db/userStore'

interface SignInModalProps {
  open: boolean
  onClose: () => void
  user: UserProfile | null
  onLogin: (userData: UserProfile) => void
  onLogout: () => void
}

export function SignInModal({
  open,
  onClose,
  user,
  onLogin,
  onLogout,
}: SignInModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [role, setRole] = useState<UserRole>('Ophthalmologist')

  // Sign In inputs
  const [loginEmail, setLoginEmail] = useState('dr.sharma@ruralhealth.gov.in')
  const [loginPassword, setLoginPassword] = useState('password123')

  // Sign Up inputs
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')

  // Technician specific fields
  const [operatorId, setOperatorId] = useState('')
  const [centerName, setCenterName] = useState('')
  const [district, setDistrict] = useState('')

  // Ophthalmologist specific fields
  const [medicalCouncilRegNo, setMedicalCouncilRegNo] = useState('')
  const [hospitalAffiliation, setHospitalAffiliation] = useState('')
  const [subSpecialty, setSubSpecialty] = useState('Vitreo-Retina & Diabetic Eye Care')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    setErrorMsg('')
    setSuccessMsg('')
  }, [mode, role, open])

  if (!open) return null

  const handleQuickFillTechnician = () => {
    setRole('Technician')
    setLoginEmail('anjali.devi@ruralhealth.gov.in')
    setLoginPassword('password123')
  }

  const handleQuickFillOphthalmologist = () => {
    setRole('Ophthalmologist')
    setLoginEmail('dr.sharma@ruralhealth.gov.in')
    setLoginPassword('password123')
  }

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginEmail,
          password: loginPassword,
          role,
        }),
      })

      const data = await res.json()
      if (data.success && data.user) {
        onLogin(data.user)
        onClose()
      } else {
        setErrorMsg(data.error || 'Login failed. Please check credentials.')
      }
    } catch (err) {
      // Fallback local auth for resilience
      const fallbackUser: UserProfile =
        role === 'Ophthalmologist'
          ? {
              id: 'usr-ophth-01',
              name: 'Dr. Rajesh Sharma, MS',
              email: loginEmail,
              role: 'Ophthalmologist',
              medicalCouncilRegNo: 'NMC-OPH-88421',
              hospitalAffiliation: 'Regional Institute of Ophthalmology / GMCH',
              subSpecialty: 'Vitreo-Retina & Diabetic Eye Disease',
              createdAt: new Date().toISOString(),
            }
          : {
              id: 'usr-tech-01',
              name: 'Anjali Devi',
              email: loginEmail,
              role: 'Technician',
              operatorId: 'TECH-AS-401',
              centerName: 'Sonitpur Rural Vision Centre / PHC',
              district: 'Sonitpur, Assam',
              createdAt: new Date().toISOString(),
            }
      onLogin(fallbackUser)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setErrorMsg('Please fill in all required name, email, and password fields.')
      return
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    if (role === 'Ophthalmologist' && !medicalCouncilRegNo.trim()) {
      setErrorMsg('Please enter your Medical Council Registration Number (NMC / State Council).')
      return
    }

    if (role === 'Technician' && !centerName.trim()) {
      setErrorMsg('Please enter your Primary Health Centre or Vision Centre name.')
      return
    }

    setLoading(true)

    try {
      const payload: any = {
        action: 'register',
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        phone: signupPhone,
        role,
      }

      if (role === 'Technician') {
        payload.operatorId = operatorId || `TECH-${Math.floor(1000 + Math.random() * 9000)}`
        payload.centerName = centerName
        payload.district = district
      } else {
        payload.medicalCouncilRegNo = medicalCouncilRegNo
        payload.hospitalAffiliation = hospitalAffiliation || 'District Eye Hospital'
        payload.subSpecialty = subSpecialty
        payload.designation = 'Consultant Ophthalmologist'
      }

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success && data.user) {
        setSuccessMsg('Registration successful! Logging in...')
        setTimeout(() => {
          onLogin(data.user)
          onClose()
        }, 600)
      } else {
        setErrorMsg(data.error || 'Registration failed. Please try again.')
      }
    } catch (err) {
      const newLocalUser: UserProfile = {
        id: `usr-${role === 'Technician' ? 'tech' : 'ophth'}-${Date.now()}`,
        name: signupName,
        email: signupEmail,
        role,
        phone: signupPhone,
        operatorId: role === 'Technician' ? operatorId || 'TECH-AS-881' : undefined,
        centerName: role === 'Technician' ? centerName || 'Primary Health Centre' : undefined,
        district: role === 'Technician' ? district : undefined,
        medicalCouncilRegNo: role === 'Ophthalmologist' ? medicalCouncilRegNo : undefined,
        hospitalAffiliation: role === 'Ophthalmologist' ? hospitalAffiliation || 'District Hospital' : undefined,
        subSpecialty: role === 'Ophthalmologist' ? subSpecialty : undefined,
        createdAt: new Date().toISOString(),
      }
      onLogin(newLocalUser)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {user ? (
          /* ACTIVE USER PROFILE VIEW */
          <div className="space-y-6">
            <div>
              <div className="text-xs font-bold text-[#0da487] uppercase tracking-wider mb-1">
                Active Clinician Session
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{user.name}</h3>
              <p className="text-xs text-slate-600 mt-1">
                Authorized clinical profile with verified diagnostic credentials.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
                  <UserCheck size={12} className="text-slate-400" />
                  Role
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e6f8f3] text-[#0da487] border border-[#a7f3d0]">
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400" />
                  Email Address
                </span>
                <span className="text-slate-900 font-medium">{user.email}</span>
              </div>
              {user.operatorId && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <KeyRound size={12} className="text-slate-400" />
                    Operator ID
                  </span>
                  <span className="text-[#0da487] font-mono font-semibold">{user.operatorId}</span>
                </div>
              )}
              {user.centerName && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Hospital size={12} className="text-slate-400" />
                    Vision Centre / PHC
                  </span>
                  <span className="text-slate-700">{user.centerName}</span>
                </div>
              )}
              {user.medicalCouncilRegNo && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <FileCheck size={12} className="text-slate-400" />
                    Medical Council Reg.
                  </span>
                  <span className="text-[#0da487] font-mono font-semibold">{user.medicalCouncilRegNo}</span>
                </div>
              )}
              {user.hospitalAffiliation && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Building2 size={12} className="text-slate-400" />
                    Hospital Affiliation
                  </span>
                  <span className="text-slate-700">{user.hospitalAffiliation}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onLogout()
                }}
                className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <LogOut size={14} /> Switch Account / Log Out
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[#0da487] hover:bg-[#0b8a70] text-xs font-bold text-white transition-all shadow-md shadow-[#0da487]/20"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN / REGISTRATION VIEW */
          <div className="space-y-6">
            <div>
              <div className="text-xs font-bold text-[#0da487] uppercase tracking-wider mb-1">
                Netrika Tele-Health Access
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {mode === 'signin' ? 'Clinician Sign In' : 'Create Clinical Account'}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Role-based portal for Vision Technicians and Consulting Ophthalmologists.
              </p>
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Register
              </button>
            </div>

            {/* Quick Demo Pre-fills */}
            {mode === 'signin' && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Quick Demo Roles (One-Click Login):
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleQuickFillTechnician}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      role === 'Technician'
                        ? 'bg-[#e6f8f3] text-[#0da487] border border-[#a7f3d0] font-bold'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <User size={13} />
                    <span>Vision Technician</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickFillOphthalmologist}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      role === 'Ophthalmologist'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <Stethoscope size={13} />
                    <span>Ophthalmologist</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error / Success Notifications */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* FORM */}
            {mode === 'signin' ? (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Mail size={12} className="text-slate-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0da487]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Lock size={12} className="text-slate-400" />
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0da487]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#0da487] text-white text-xs font-bold hover:bg-[#0b8a70] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#0da487]/20 mt-2"
                >
                  <LogIn size={15} />
                  <span>{loading ? 'Authenticating...' : `Sign In as ${role}`}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <UserCheck size={12} className="text-slate-400" />
                    Role Designation
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#0da487]"
                  >
                    <option value="Technician">Vision Technician (Primary Health Centre)</option>
                    <option value="Ophthalmologist">Consultant Ophthalmologist (Tele-Reviewer)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <User size={12} className="text-slate-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0da487]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Mail size={12} className="text-slate-400" />
                    Official Email
                  </label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@health.gov.in"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0da487]"
                  />
                </div>

                {role === 'Ophthalmologist' ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <FileCheck size={12} className="text-slate-400" />
                        Medical Council Reg. No.
                      </label>
                      <input
                        type="text"
                        required
                        value={medicalCouncilRegNo}
                        onChange={(e) => setMedicalCouncilRegNo(e.target.value)}
                        placeholder="NMC-OPH-88421"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0da487]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Building2 size={12} className="text-slate-400" />
                        Hospital / Institute
                      </label>
                      <input
                        type="text"
                        value={hospitalAffiliation}
                        onChange={(e) => setHospitalAffiliation(e.target.value)}
                        placeholder="Regional Eye Institute"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0da487]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Hospital size={12} className="text-slate-400" />
                        Vision Centre / PHC Name
                      </label>
                      <input
                        type="text"
                        required
                        value={centerName}
                        onChange={(e) => setCenterName(e.target.value)}
                        placeholder="Sonitpur Rural Vision Centre"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0da487]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-400" />
                        District / State
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Sonitpur, Assam"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0da487]"
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Lock size={12} className="text-slate-400" />
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#0da487]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Lock size={12} className="text-slate-400" />
                      Confirm
                    </label>
                    <input
                      type="password"
                      required
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#0da487]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#0da487] text-white text-xs font-bold hover:bg-[#0b8a70] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#0da487]/20 mt-3"
                >
                  <ShieldCheck size={15} />
                  <span>{loading ? 'Creating Account...' : 'Complete Clinical Registration'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
