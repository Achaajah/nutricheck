import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(request) {
  try {
    // Ambil query parameter untuk search (optional)
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    // const category = searchParams.get('category') || ''

    let foods

    // Jika ada query search, filter di database
    if (query) {
      foods = await prisma.food.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive' // case insensitive
              }
            },
            {
              gizi: {
                some: {
                  label: {
                    contains: query,
                    mode: 'insensitive'
                  }
                }
              }
            }
          ]
        },
        include: {
          gizi: {
            orderBy: {
              id: 'asc'
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
    } else {
      // Ambil semua data jika tidak ada query
      foods = await prisma.food.findMany({
        include: {
          gizi: {
            orderBy: {
              id: 'asc'
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
    }

    return new Response(JSON.stringify(foods), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=30' // caching
      }
    })

  } catch (error) {
    console.error('Error fetching foods:', error)
    return new Response(JSON.stringify({ 
      error: 'Gagal mengambil data makanan',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } finally {
    await prisma.$disconnect()
  }
}

// Optional: POST method untuk menambah data
// export async function POST(request) {
//   try {
//     const body = await request.json()
//     const { name, img, gizi } = body

//     const food = await prisma.food.create({
//       data: {
//         name,
//         img,
//         gizi: {
//           create: gizi
//         }
//       },
//       include: {
//         gizi: true
//       }
//     })

//     return new Response(JSON.stringify(food), {
//       status: 201,
//       headers: { 'Content-Type': 'application/json' }
//     })
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     })
//   } finally {
//     await prisma.$disconnect()
//   }
// }