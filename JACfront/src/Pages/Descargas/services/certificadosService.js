import API from '@/api/api'

export async function createCertificado(payload) {
  const res = await API.post('/certificados', payload)
  return res.data
}

export async function downloadCertificado(id, filename) {
  const res = await API.get(`/certificados/${id}/pdf`, { responseType: 'blob' })
  const blob = res.data
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `certificado_${id}.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => window.URL.revokeObjectURL(url), 1000)
}

export async function fetchCertificadoBlob(id) {
  const res = await API.get(`/certificados/${id}/pdf`, { responseType: 'blob' })
  return res.data
}
