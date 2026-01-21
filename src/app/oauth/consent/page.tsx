'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface AuthorizationDetails {
  client_name?: string
  client_website?: string
  scopes?: string[]
  [key: string]: any // Allow additional properties from Supabase
}

// Reusable Layout Components
function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <div className="relative flex justify-center items-center">
      <div className="relative w-full bg-blue-900 flex justify-center items-center m-4 text-white rounded-full shadow-lg p-4 px-4 md:px-12">
        <Image 
          src="/RMT LOGO WHITE.svg" 
          alt="RMT Soluciones" 
          width={200} 
          height={200} 
        />
      </div>
    </div>
  )
}

function Footer() {
  return (
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
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-800 rounded-3xl">
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}

// Scope descriptions
const SCOPE_DESCRIPTIONS: Record<string, string> = {
  'openid': 'Identidad (OpenID Connect)',
  'email': 'Dirección de correo electrónico',
  'profile': 'Información de perfil básica',
  'phone': 'Número de teléfono',
  'offline_access': 'Acceso sin conexión',
}

function ConsentContent() {
  const searchParams = useSearchParams()
  const authorizationId = searchParams.get('authorization_id')
  
  const [details, setDetails] = useState<AuthorizationDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authorizationId) {
      setError('Falta el parámetro authorization_id')
      setLoading(false)
      return
    }

    const supabase = createClient()
    
    supabase.auth.oauth.getAuthorizationDetails(authorizationId)
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError.message || 'Error al cargar los detalles de autorización')
        } else if (data) {
          setDetails(data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Authorization details error:', err)
        setError('Error al cargar los detalles de autorización')
        setLoading(false)
      })
  }, [authorizationId])

  const handleAuthorization = async (approve: boolean) => {
    if (!authorizationId || processing) return

    setProcessing(true)
    setError(null)

    try {
      const supabase = createClient()
      const action = approve 
        ? supabase.auth.oauth.approveAuthorization(authorizationId)
        : supabase.auth.oauth.denyAuthorization(authorizationId)

      const { data, error: actionError } = await action
      
      if (actionError) {
        setError(actionError.message || `Error al ${approve ? 'aprobar' : 'denegar'} la autorización`)
        setProcessing(false)
        return
      }

      if (data?.redirect_url) {
        window.location.href = data.redirect_url
      } else {
        setError('No se recibió una URL de redirección')
        setProcessing(false)
      }
    } catch (err) {
      console.error('Authorization error:', err)
      setError(`Error al ${approve ? 'aprobar' : 'denegar'} la autorización`)
      setProcessing(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <PageLayout>
        <div className="bg-white rounded-3xl shadow-md p-8 w-full max-w-md text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-6">Cargando detalles de autorización...</p>
        </div>
      </PageLayout>
    )
  }

  // Error state
  if (error && !details) {
    return (
      <PageLayout>
        <div className="bg-white rounded-3xl shadow-md p-8 w-full max-w-md">
          <ErrorMessage message={error} />
          <p className="text-sm text-gray-600 text-center">
            Por favor, verifica que la URL de autorización sea correcta.
          </p>
        </div>
      </PageLayout>
    )
  }

  // No details available
  if (!details) return null

  // Main consent screen
  return (
    <PageLayout>
      <div className="bg-white rounded-3xl shadow-md p-8 w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Autorizar Aplicación
          </h1>
          <p className="text-gray-600">
            {details.client_name || 'Una aplicación'} quiere acceder a tu cuenta
          </p>
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Client Info */}
        <div className="mb-6">
          <div className="p-4 bg-gray-50 rounded-3xl border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {details.client_name || 'Aplicación Desconocida'}
            </h2>
            {details.client_website && (
              <p className="text-sm text-gray-600">
                Sitio web:{' '}
                <a 
                  href={details.client_website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-900 transition-colors break-all"
                >
                  {details.client_website}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Permissions */}
        {details.scopes && details.scopes.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Esta aplicación solicita los siguientes permisos:
            </p>
            <ul className="space-y-2">
              {details.scopes.map((scope) => (
                <li 
                  key={scope}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <svg 
                    className="w-5 h-5 text-blue-900 mt-0.5 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  <span className="flex-1">
                    {SCOPE_DESCRIPTIONS[scope] || scope}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleAuthorization(false)}
            disabled={processing}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Denegar
          </button>
          <button
            onClick={() => handleAuthorization(true)}
            disabled={processing}
            className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Procesando...' : 'Autorizar'}
          </button>
        </div>

        {/* Security Note */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-3xl">
          <p className="text-xs text-blue-800">
            <strong>Nota de seguridad:</strong> Solo autoriza aplicaciones en las que confías. 
            Puedes revocar estos permisos en cualquier momento desde la configuración de tu cuenta.
          </p>
        </div>
      </div>
    </PageLayout>
  )
}

export default function ConsentPage() {
  return (
    <Suspense fallback={
      <PageLayout>
        <div className="bg-white rounded-3xl shadow-md p-8 w-full max-w-md text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-6">Cargando...</p>
        </div>
      </PageLayout>
    }>
      <ConsentContent />
    </Suspense>
  )
}
