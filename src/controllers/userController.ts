import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'

export const loginUser = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { email, password } = req.body

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = generateToken(user)
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } })
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }
}

export const registerUser = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const user = await authenticateUser(req, res, 'SUPER_ADMIN')
    if (!user) return

    try {
        const { email, password } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)
        const newAdmin = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'ADMIN'
            }
        })

        res.json({ id: newAdmin.id, email: newAdmin.email, role: newAdmin.role })
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
    }
}