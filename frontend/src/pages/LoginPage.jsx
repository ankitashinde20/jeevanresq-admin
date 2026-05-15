import { useState } from 'react';
import {
  Activity,
  Lock,
  RadioTower,
  User,
  ShieldCheck,
} from 'lucide-react';

import { useAuth } from '../state/AuthContext.jsx';
import { api } from '../api/client.js';

// LOCAL BACKGROUND IMAGE
// Put your image inside:
// src/assets/disaster-bg.jpg

import bgImage from '../assets/JEEVANResQ.png';

export function LoginPage() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: 'superadmin',
    password: 'Jeevan@123',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      await login(form.username, form.password);
    } catch (error) {
      setMessage(
        error?.response?.data?.message || 'Login failed',
      );
    } finally {
      setLoading(false);
    }
  }

  async function forgotPassword() {
    try {
      await api.post('/auth/forgot-password', {
        username: form.username,
      });

      setMessage(
        'Password reset workflow triggered for verified admins.',
      );
    } catch (error) {
      setMessage(
        'Unable to process forgot password request.',
      );
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#050816] px-4 py-10 text-white">
      <section className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-[#0b1220]/90 shadow-2xl backdrop-blur lg:grid-cols-[1.15fr_0.85fr]">

        {/* LEFT SIDE */}
        <div
          className="relative min-h-[620px] bg-cover bg-center p-8 sm:p-10"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(7,12,22,0.45),
                rgba(7,12,22,0.92)
              ),
              url(${bgImage})
            `,
          }}
        >
          {/* TOP LOGO */}
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-600 shadow-lg shadow-red-500/30">
              <RadioTower className="h-7 w-7 text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-wide">
                JeevanResQ
              </h1>

              <p className="text-sm text-slate-300">
                Disaster Emergency Operations Platform
              </p>
            </div>
          </div>

          {/* CENTER CONTENT */}
          <div className="mt-20">
            <div className="mb-6 inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-2 text-sm text-red-100 backdrop-blur">
              <Activity size={16} />
              Real-time SOS, camps, rescue teams and emergency tracking
            </div>

            <h2 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
              Emergency command center built for rapid disaster response.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
              Centralized monitoring for SOS alerts, hazard mapping,
              communication systems, rescue coordination and live field reports.
            </p>
          </div>

          {/* BOTTOM STATUS */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:grid-cols-3">
              <div>
                <p className="text-3xl font-black text-red-400">24/7</p>
                <p className="text-sm text-slate-300">
                  Monitoring
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-cyan-400">
                  LIVE
                </p>
                <p className="text-sm text-slate-300">
                  SOS Network
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-emerald-400">
                  SECURE
                </p>
                <p className="text-sm text-slate-300">
                  Admin Access
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <form
          onSubmit={submit}
          className="flex flex-col justify-center bg-[#0f172a] p-8 sm:p-10"
        >
          <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            <ShieldCheck size={14} />
            Secure Admin Login
          </div>

          <h2 className="mt-4 text-4xl font-black text-white">
            Command Access
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Role-based authentication with protected emergency
            management controls and system monitoring.
          </p>

          {/* USERNAME */}
          <label className="mt-10 mb-2 text-sm font-medium text-slate-300">
            Username
          </label>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 transition focus-within:border-cyan-500">
            <User size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Enter username"
              className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
              value={form.username}
              onChange={(event) =>
                setForm({
                  ...form,
                  username: event.target.value,
                })
              }
            />
          </div>

          {/* PASSWORD */}
          <label className="mt-6 mb-2 text-sm font-medium text-slate-300">
            Password
          </label>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 transition focus-within:border-cyan-500">
            <Lock size={18} className="text-slate-400" />

            <input
              type="password"
              placeholder="Enter password"
              className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
              value={form.password}
              onChange={(event) =>
                setForm({
                  ...form,
                  password: event.target.value,
                })
              }
            />
          </div>

          {/* MESSAGE */}
          {message && (
            <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
              {message}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 rounded-2xl bg-red-600 px-5 py-4 text-base font-bold text-white shadow-lg shadow-red-500/30 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Authenticating...'
              : 'Enter Dashboard'}
          </button>

          {/* FORGOT PASSWORD */}
          <button
            type="button"
            onClick={forgotPassword}
            className="mt-4 rounded-2xl border border-slate-700 bg-slate-900/40 px-5 py-4 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            Forgot Password
          </button>

          {/* FOOTER */}
          <p className="mt-8 text-center text-xs leading-6 text-slate-500">
            JeevanResQ Emergency Operations System © 2026
          </p>
        </form>
      </section>
    </main>
  );
}