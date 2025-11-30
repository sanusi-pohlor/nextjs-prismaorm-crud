'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { createSession, deleteSession } from '@/lib/session'

const registerSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
})

export async function register(prevState: any, formData: FormData) {
    const result = registerSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        }
    }

    const { name, email, password } = result.data

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return {
            errors: {
                email: ['Email already exists.'],
            },
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    })

    await createSession(user.id.toString())
    redirect('/')
}

const loginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(1, { message: 'Password field must not be empty.' }),
})

export async function login(prevState: any, formData: FormData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        }
    }

    const { email, password } = result.data

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return {
            errors: {
                email: ['Invalid email or password.'],
            },
        }
    }

    await createSession(user.id.toString())
    redirect('/')
}

export async function logout() {
    await deleteSession()
    redirect('/login')
}
