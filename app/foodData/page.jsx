import FoodClient from './page'

// Server Component - Fetch data di server
async function getFoods() {
  try {
    // Fetch dari API internal
    const res = await fetch('/api/data', {
       next: { revalidate: 600 } // ISR: revalidate setiap 60 detik
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch foods')
    }

    const foods = await res.json()
    return foods
  } catch (error) {
    console.error('Error fetching foods:', error)
    return []
  }
}

export default async function FoodsPage() {
  const initialFoods = await getFoods()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          🍽️ Database Makanan & Nutrisi
        </h1>
        <FoodClient initialFoods={initialFoods} />
      </div>
    </div>
  )
}