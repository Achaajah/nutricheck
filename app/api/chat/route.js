import { PrismaClient } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { OpenAI } from "openai";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const ai = new OpenAI({ baseURL: "https://openrouter.ai/api/v1/", apiKey: process.env.OPENROUTER_API_KEY });

const SYSTEM_PROMPT = `
Kamu adalah AI Assistant yang hanya boleh membahas:
- Nutrisi
- Olahraga
- Kesehatan

Untuk semua topik lain, termasuk:
- Pemrograman
- Komputer
- Jaringan
- Politik
- Hiburan
- Sejarah
- Matematika

Jawab PERSIS dengan kalimat berikut tanpa tambahan apa pun:

"MAAF SAYA HANYA BISA MENJAWAB PERTANYAAN YANG BERHUBUNGAN DENGAN NUTRISI, OLAHRAGA, DAN KESEHATAN"

Jangan pernah memberikan:
- Kode program
- JSON
- XML
- YAML
- Formula data terstruktur

Kamu membantu pengguna dengan:
- Perencanaan makan dan saran pola makan sehat
- Informasi gizi tentang makanan
- Rekomendasi diet berdasarkan tujuan kesehatan
- Saran resep dan substitusi bahan makanan
- Panduan kalori dan makronutrien

Selalu jawab dengan hangat, suportif, dan informatif dalam Bahasa Indonesia.
Jaga respons tetap ringkas tapi bermanfaat (maksimal 3-4 kalimat).
Jika ditanya tentang kondisi medis, selalu rekomendasikan untuk berkonsultasi dengan tenaga kesehatan.


- JANGAN PERNAH memberikan formula / format JSON 
- JANGAN PERNAH memberikan format JSON
- JANGAN PERNAH MEMBERIKAN JAWABAN BERUPA KODE
- JAWAB PERTANYAAN YANG TIDAK BERHUBUNGAN DENGAN NUTRISI, OLAHRAGA, DAN, KESEHATAN, DENGAN 'MAAF SAYA HANYA BISA MENJAWAB PERTANYAAN YANG BERHUBUNGAN DENGAN NUTRISI, OLAHRAGA, DAN KESEHATAN' 
`

// POST /api/chat 
export async function POST(request) {
  try {
    const body = await request.json()
    const { messages, message, sessionId, mode } = body

    let userContent = ""
    let chatHistory = []

    if (messages && Array.isArray(messages) && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      userContent = lastMessage?.content || ""
      chatHistory = messages.slice(0, -1).map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }))
    } else if (typeof message === 'string') {
      userContent = message
    }

    if (!userContent || userContent.trim() === '') {
      return NextResponse.json({ error: 'Message tidak boleh kosong' }, { status: 400 })
    }

    // Mode kalkulator: skip session/DB, kirim prompt langsung tanpa SYSTEM_PROMPT chat
    if (mode === 'kalkulator') {
      const aiResponse = await ai.chat.completions.create({
        model: "google/gemma-4-31b-it:free",
        messages: [
          {
            role: "user",
            content: userContent.trim()
          }
        ]
      })

      const assistantText = aiResponse.choices[0]?.message?.content || ""

      return NextResponse.json({
        choices: [
          {
            message: {
              role: 'assistant',
              content: assistantText,
            },
          },
        ],
      })
    }

    // === Mode chat biasa ===
    // Ambil atau buat session baru
    let session = null
    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      })
    }

    if (!session) {
      session = await prisma.chatSession.create({
        data: {},
        include: { messages: true },
      })
    }

    // Simpan pesan user ke database
    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: userContent.trim(),
      },
    })

    // Jika chatHistory kosong (tidak dikirim dari frontend), gunakan history dari database
    if (chatHistory.length === 0 && session.messages) {
      chatHistory = session.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))
    }

    // Panggil AI API
    const aiResponse = await ai.chat.completions.create({
      model: "google/gemma-4-31b-it:free",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        ...chatHistory,
        {
          role: "user",
          content: userContent.trim()
        }
      ]
    })

    const assistantText = aiResponse.choices[0]?.message?.content || ""

    // Simpan pesan assistant ke database
    const savedAiMessage = await prisma.message.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: assistantText,
      },
    })

    // Update timestamp session
    await prisma.chatSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    })

    // Kembalikan response dalam OpenAI format
    return NextResponse.json({
      choices: [
        {
          message: {
            role: 'assistant',
            content: assistantText,
          },
        },
      ],
      sessionId: session.id,
      messageId: savedAiMessage.id,
    })
  } catch (error) {
    console.error('[POST /api/chat] Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

// ambil riwayat chat
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId diperlukan' }, { status: 400 })
    }

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ messages: session.messages, sessionId: session.id })
  } catch (error) {
    console.error('[GET /api/chat] Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

// DELETE /api/chat?sessionId=xxx — hapus session
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId diperlukan' }, { status: 400 })
    }

    await prisma.chatSession.delete({ where: { id: sessionId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/chat] Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}