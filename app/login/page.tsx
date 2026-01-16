import { signIn } from '@/lib/auth-config'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <main style={{ 
      padding: '2rem', 
      maxWidth: '400px', 
      margin: '50px auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '100%'
      }}>
        <h1 style={{ 
          marginBottom: '2rem', 
          fontSize: '1.5rem',
          textAlign: 'center'
        }}>
          Вход в систему
        </h1>
        
        <form action={async () => {
          'use server'
          await signIn('google', { redirectTo: '/' })
        }}>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              color: 'white',
              background: '#4285f4',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s'
            }}
            className="google-signin-button"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '0.5rem' }}>
              <path
                fill="#fff"
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.467-.806 5.96-2.184l-2.908-2.258c-.806.54-1.837.86-3.052.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.951H.957C.348 6.174 0 7.55 0 9s.348 2.826.957 4.049l3.007-2.342z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.951L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
              />
            </svg>
            Войти через Google
          </button>
        </form>
      </div>
    </main>
  )
}
