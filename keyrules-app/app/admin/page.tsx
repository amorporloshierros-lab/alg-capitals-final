import { redirect } from 'next/navigation'

// Redirigir directo al bias por ser la sección más usada
export default function AdminPage() {
  redirect('/admin/bias')
}
