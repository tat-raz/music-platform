import jwt from 'jsonwebtoken';

type TokenPayload = {
    userId: string;
    email: string;
    role: string;
};

export const generateToken = ({ userId, email, role }: TokenPayload): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(
        { userId, email, role },
        secret,
        { expiresIn: '7d' }
    );
};