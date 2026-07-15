import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await this.prisma.user.create({
      data: { email, password: hashed, name },
    });

    return this.generateToken(user.id, user.email);
  }

  async login(email: string, password: string) {
    // Use select to avoid fetching password unnecessarily
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    // Always perform bcrypt compare to prevent timing attack
    // Use a dummy hash if user doesn't exist to ensure consistent timing
    const hashToCompare = user?.password ?? '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYH8sMw4Y4W6';
    const isValid = await bcrypt.compare(password, hashToCompare);

    if (!user || !user.password || !isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user.id, user.email);
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  private generateToken(userId: string, email: string) {
    return {
      accessToken: this.jwtService.sign({ sub: userId, email }),
    };
  }
}
