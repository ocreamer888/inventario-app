'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err) {
      setError('Error al iniciar sesión con Google.');
      console.error('Google login error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      {/* Header */}
      <div className="relative flex justify-center items-center">
        <div className="relative w-full bg-blue-900 flex justify-center items-center m-4 text-white rounded-full shadow-lg p-4 px-4 md:px-12">
          <div className="relative flex flex-col justify-center items-center">
            <Image 
              src="/RMT LOGO WHITE.svg" 
              alt="RMT Soluciones" 
              width={200} 
              height={200} 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-3xl shadow-md p-8 w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h1>
            <p className="text-gray-600">Inicia sesión en tu cuenta</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-800 rounded-3xl">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm text-blue-700 hover:text-blue-900 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link 
                href="/signup" 
                className="text-blue-700 hover:text-blue-900 font-medium transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <a 
          href="https://www.rmtsoluciones.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-900 hover:text-blue-700 transition-colors text-sm"
        >
          www.rmtsoluciones.com
        </a>
        <p className="text-gray-600 text-xs mt-2">
          © {new Date().getFullYear()} RMT Soluciones. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
