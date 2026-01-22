import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function getNotes() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return notes
  } catch (error) {
    console.error('Ошибка при получении заметок:', error)
    // Логируем более детальную информацию об ошибке
    if (error instanceof Error) {
      console.error('Сообщение об ошибке:', error.message)
      console.error('Стек ошибки:', error.stack)
    }
    
    // Если соединение закрыто, пробуем переподключиться один раз
    if (error && typeof error === 'object' && 'kind' in error && error.kind === 'Closed') {
      console.log('Соединение закрыто, попытка переподключения...')
      try {
        await prisma.$connect()
        const notes = await prisma.note.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        })
        return notes
      } catch (retryError) {
        console.error('Повторная попытка не удалась:', retryError)
      }
    }
    
    return []
  }
}

export default async function Home() {
  const user = await getCurrentUser()
  
  // Если пользователь авторизован, перенаправляем на дашборд
  if (user) {
    redirect('/dashboard')
  }
  
  const notes = await getNotes()

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>
          Next.js + Prisma + NeonDB
        </h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link 
            href="/login"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              background: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Войти
          </Link>
        </div>
      </div>
      
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
          Заметки из базы данных:
        </h2>
        
        {notes.length === 0 ? (
          <p style={{ color: '#666' }}>
            Заметок пока нет. Запустите seed: <code>pnpm run db:seed</code>
          </p>
        ) : (
          <ul style={{ listStyle: 'none' }}>
            {notes.map((note) => (
              <li
                key={note.id}
                style={{
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  background: '#f9f9f9',
                  borderRadius: '4px',
                  borderLeft: '3px solid #0070f3',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  {note.title}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  ID: {note.id}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  Создано: {new Date(note.createdAt).toLocaleString('ru-RU')}
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f0f0', borderRadius: '4px' }}>
          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
            <strong>Всего заметок:</strong> {notes.length}
          </p>
        </div>
      </div>
    </main>
  )
}
