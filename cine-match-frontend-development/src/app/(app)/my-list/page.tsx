import type { Metadata } from 'next'
import { MyListView } from '@/components/movie/MyListView'

export const metadata: Metadata = { title: 'My List' }

export default function MyListPage() {
  return <MyListView />
}
