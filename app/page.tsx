import { prisma } from '@/lib/prisma'

async function getNotes() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return notes
  } catch (error) {
    console.error('Error fetching notes:', error)
    // Логируем более детальную информацию об ошибке
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    // Если соединение закрыто, пробуем переподключиться один раз
    if (error && typeof error === 'object' && 'kind' in error && error.kind === 'Closed') {
      console.log('Connection closed, attempting to reconnect...')
      try {
        await prisma.$connect()
        const notes = await prisma.note.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        })
        return notes
      } catch (retryError) {
        console.error('Retry failed:', retryError)
      }
    }
    
    return []
  }
}

export default async function Home() {
  const notes = await getNotes()

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>
        Next.js + Prisma + NeonDB
      </h1>
      
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
