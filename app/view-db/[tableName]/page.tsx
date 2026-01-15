'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Column {
  name: string
  type: string
  nullable: boolean
}

interface TableData {
  data: any[]
  columns: Column[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

function TableViewPageContent({ params }: { params: { tableName: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dbType = searchParams.get('db') || 'local'
  const tableName = params.tableName

  const [tableData, setTableData] = useState<TableData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  const pageSize = 10

  const fetchTableData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/view-db/table/${tableName}?db=${dbType}&page=${page}&pageSize=${pageSize}`
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch data')
      }
      const data = await response.json()
      setTableData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTableData()
  }, [page, tableName, dbType])

  const handleCreate = async () => {
    try {
      const response = await fetch(
        `/api/view-db/table/${tableName}/create?db=${dbType}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create record')
      }
      setShowCreateModal(false)
      setFormData({})
      fetchTableData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create record')
    }
  }

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `/api/view-db/table/${tableName}/update?db=${dbType}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: editingRecord.id }),
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update record')
      }
      setShowEditModal(false)
      setEditingRecord(null)
      setFormData({})
      fetchTableData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update record')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) return

    try {
      const response = await fetch(
        `/api/view-db/table/${tableName}/delete?db=${dbType}&id=${id}`,
        { method: 'DELETE' }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete record')
      }
      fetchTableData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete record')
    }
  }

  const openEditModal = (record: any) => {
    setEditingRecord(record)
    setFormData(record)
    setShowEditModal(true)
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'NULL'
    if (typeof value === 'object') return JSON.stringify(value)
    if (value instanceof Date) return value.toLocaleString('ru-RU')
    return String(value)
  }

  const getInputType = (col: Column): string => {
    if (col.type.includes('int') || col.type.includes('numeric')) return 'number'
    if (col.type.includes('timestamp') || col.type.includes('date')) return 'datetime-local'
    if (col.type.includes('boolean') || col.type.includes('bool')) return 'checkbox'
    return 'text'
  }

  const getInputValue = (col: Column, value: any): string | number | boolean => {
    if (col.type.includes('timestamp') || col.type.includes('date')) {
      if (!value) return ''
      const date = new Date(value)
      return date.toISOString().slice(0, 16)
    }
    if (col.type.includes('boolean') || col.type.includes('bool')) {
      return Boolean(value)
    }
    return value || ''
  }

  const handleInputChange = (col: Column, value: any) => {
    let processedValue: any = value

    if (col.type.includes('int') || col.type.includes('numeric')) {
      processedValue = value === '' ? null : (parseFloat(value) || 0)
    } else if (col.type.includes('timestamp') || col.type.includes('date')) {
      processedValue = value ? new Date(value).toISOString() : null
    } else if (col.type.includes('boolean') || col.type.includes('bool')) {
      processedValue = Boolean(value)
    }

    setFormData({ ...formData, [col.name]: processedValue })
  }

  const getDisplayName = (tableName: string): string => {
    const names: Record<string, string> = {
      users: 'Пользователи',
      notes: 'Заметки',
      categories: 'Категории',
      recips: 'Промты',
      tags: 'Теги',
      tag_on_recip: 'Теги на промтах',
      votes: 'Голоса',
      collections: 'Коллекции',
      recip_in_collection: 'Промты в коллекциях',
      recip_versions: 'Версии промтов',
    }
    return names[tableName] || tableName
  }

  if (loading && !tableData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Загрузка...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ padding: '1rem', background: '#fee', color: '#c00', borderRadius: '4px' }}>
          <p style={{ margin: 0 }}>Ошибка: {error}</p>
        </div>
        <button
          onClick={() => router.back()}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Назад
        </button>
      </div>
    )
  }

  if (!tableData) return null

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button
            onClick={() => router.back()}
            style={{
              marginBottom: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ← Назад
          </button>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>
            {getDisplayName(tableName)} ({tableName})
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
            БД: {dbType === 'local' ? 'Локальная' : 'Рабочая'}
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({})
            setShowCreateModal(true)
          }}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '1rem',
          }}
        >
          + Создать запись
        </button>
      </div>

      {/* Пагинация сверху */}
      <div style={{
        marginBottom: '1rem',
        padding: '1rem',
        background: 'white',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          Показано {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, tableData.pagination.total)} из {tableData.pagination.total}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.5 : 1,
            }}
          >
            ← Предыдущая
          </button>
          <span style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }}>
            Страница {page} из {tableData.pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(tableData.pagination.totalPages, p + 1))}
            disabled={page >= tableData.pagination.totalPages}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: page >= tableData.pagination.totalPages ? 'not-allowed' : 'pointer',
              opacity: page >= tableData.pagination.totalPages ? 0.5 : 1,
            }}
          >
            Следующая →
          </button>
        </div>
      </div>

      {/* Таблица */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        overflow: 'auto',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              {tableData.columns.map((col) => (
                <th
                  key={col.name}
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    borderRight: '1px solid #ddd',
                  }}
                >
                  {col.name}
                  <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'normal' }}>
                    {col.type} {col.nullable ? '(nullable)' : '(required)'}
                  </div>
                </th>
              ))}
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.data.length === 0 ? (
              <tr>
                <td
                  colSpan={tableData.columns.length + 1}
                  style={{ padding: '2rem', textAlign: 'center', color: '#666' }}
                >
                  Нет данных
                </td>
              </tr>
            ) : (
              tableData.data.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  style={{
                    borderBottom: '1px solid #eee',
                    background: idx % 2 === 0 ? 'white' : '#fafafa',
                  }}
                >
                  {tableData.columns.map((col) => (
                    <td
                      key={col.name}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRight: '1px solid #eee',
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={formatValue(row[col.name])}
                    >
                      {formatValue(row[col.name])}
                    </td>
                  ))}
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => openEditModal(row)}
                        style={{
                          padding: '0.25rem 0.75rem',
                          background: '#0070f3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        style={{
                          padding: '0.25rem 0.75rem',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Модальное окно создания */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>Создать запись</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tableData.columns
                .filter(col => col.name !== 'id')
                .map((col) => (
                  <div key={col.name}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                      {col.name} {col.nullable ? '(опционально)' : '*'}
                    </label>
                    {getInputType(col) === 'checkbox' ? (
                      <input
                        type="checkbox"
                        checked={Boolean(formData[col.name])}
                        onChange={(e) => handleInputChange(col, e.target.checked)}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                        }}
                      />
                    ) : (
                      <input
                        type={getInputType(col)}
                        value={getInputValue(col, formData[col.name]) as string | number}
                        onChange={(e) => handleInputChange(col, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                        }}
                      />
                    )}
                  </div>
                ))}
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleCreate}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования */}
      {showEditModal && editingRecord && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>Изменить запись</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tableData.columns
                .filter(col => col.name !== 'id')
                .map((col) => (
                  <div key={col.name}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                      {col.name} {col.nullable ? '(опционально)' : '*'}
                    </label>
                    {getInputType(col) === 'checkbox' ? (
                      <input
                        type="checkbox"
                        checked={Boolean(formData[col.name])}
                        onChange={(e) => handleInputChange(col, e.target.checked)}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                        }}
                      />
                    ) : (
                      <input
                        type={getInputType(col)}
                        value={getInputValue(col, formData[col.name]) as string | number}
                        onChange={(e) => handleInputChange(col, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                        }}
                      />
                    )}
                  </div>
                ))}
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingRecord(null)
                  setFormData({})
                }}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleUpdate}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TableViewPage({ params }: { params: { tableName: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Загрузка...</div>}>
      <TableViewPageContent params={params} />
    </Suspense>
  )
}
