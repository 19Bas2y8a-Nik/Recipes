'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type DbType = 'local' | 'production'

interface TableInfo {
  name: string
  displayName: string
}

export default function ViewDbPage() {
  const [dbType, setDbType] = useState<DbType>('local')
  const [tables, setTables] = useState<TableInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const getDisplayName = (tableName: string): string => {
    const names: Record<string, string> = {
      users: 'Пользователи (Users)',
      notes: 'Заметки (Notes)',
      categories: 'Категории (Categories)',
      recips: 'Промты (Recips)',
      tags: 'Теги (Tags)',
      tag_on_recip: 'Теги на промтах (TagOnRecip)',
      votes: 'Голоса (Votes)',
      collections: 'Коллекции (Collections)',
      recip_in_collection: 'Промты в коллекциях (RecipInCollection)',
      recip_versions: 'Версии промтов (RecipVersions)',
    }
    return names[tableName] || tableName
  }

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/view-db/tables?db=${dbType}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch tables')
        }
        const data = await response.json()
        const tablesInfo: TableInfo[] = data.tables.map((name: string) => ({
          name,
          displayName: getDisplayName(name),
        }))
        setTables(tablesInfo)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setTables([])
      } finally {
        setLoading(false)
      }
    }

    fetchTables()
  }, [dbType])

  const handleOpenTable = (tableName: string) => {
    router.push(`/view-db/${tableName}?db=${dbType}`)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>
        Просмотр базы данных
      </h1>

      {/* Выбор БД */}
      <div style={{ 
        marginBottom: '2rem', 
        padding: '1.5rem', 
        background: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Выберите базу данных:</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="dbType"
              value="local"
              checked={dbType === 'local'}
              onChange={(e) => setDbType(e.target.value as DbType)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>Локальная БД</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="dbType"
              value="production"
              checked={dbType === 'production'}
              onChange={(e) => setDbType(e.target.value as DbType)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>Рабочая БД</span>
          </label>
        </div>
      </div>

      {/* Список таблиц */}
      <div style={{ 
        background: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e5e5' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Таблицы базы данных</h2>
        </div>
        
        {error && (
          <div style={{ padding: '1rem', background: '#fee', color: '#c00', margin: '1rem' }}>
            {error}
          </div>
        )}

        <div style={{ padding: '1rem' }}>
          {tables.length === 0 ? (
            <p style={{ color: '#666', padding: '2rem', textAlign: 'center' }}>
              {loading ? 'Загрузка...' : 'Таблицы не найдены'}
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {tables.map((table) => (
                <div
                  key={table.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: '#f9f9f9',
                    borderRadius: '4px',
                    border: '1px solid #e5e5e5',
                  }}
                >
                  <span style={{ fontWeight: '500' }}>{table.displayName}</span>
                  <button
                    onClick={() => handleOpenTable(table.name)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#0070f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#0051cc'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#0070f3'}
                  >
                    Открыть
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
