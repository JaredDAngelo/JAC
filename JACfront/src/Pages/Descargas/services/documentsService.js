export async function getPublicDocuments() {
  // In a real app this would come from an API. We return static list pointing to public/ documents.
  return Promise.resolve([
    { id: 'acta-2024-01', title: 'Acta JAC Centro - 2024-01', url: '/documents/acta-2024-01.txt', type: 'text/plain', size: '3 KB' },
    { id: 'acta-2024-02', title: 'Acta JAC Norte - 2024-02', url: '/documents/acta-2024-02.txt', type: 'text/plain', size: '2 KB' },
  ])
}
