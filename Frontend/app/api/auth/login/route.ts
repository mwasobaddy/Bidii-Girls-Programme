import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user from database
    const [rows] = await pool.execute(
      'SELECT id, email, password_hash, role FROM users WHERE email = ?',
      [email]
    );

    const users = rows as Array<{
      id: number;
      email: string;
      password_hash: string;
      role: string;
    }>;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0];

    // For demo purposes, also allow the plain text password 'admin123'
    let isValidPassword = false;
    
    if (password === 'admin123' && email === 'admin@bidiigirls.org') {
      // Demo credentials - allow login
      isValidPassword = true;
    } else {
      // Check hashed password
      isValidPassword = await bcrypt.compare(password, user.password_hash);
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Create response with token
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
