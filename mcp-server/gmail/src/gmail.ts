import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import express from 'express';
import { AddressInfo } from 'net';
import fs from 'fs';
import path from 'path';

export class GmailService {
    private static instance: GmailService;
    private oauth2Client: OAuth2Client;
    private userEmail: string | null = null;
    private server: any;
    private tokenPath: string = 'token.json';

    private constructor() {
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            throw new Error('Missing Google OAuth credentials in environment variables');
        }

        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'http://localhost:8001/oauth2callback'
        );

        if (this.loadToken()) {
            console.error('已加载认证信息');
        }
    }

    static getInstance(): GmailService {
        if (!GmailService.instance) {
            GmailService.instance = new GmailService();
        }
        return GmailService.instance;
    }

    private loadToken(): boolean {
        try {
            if (fs.existsSync(this.tokenPath)) {
                const token = JSON.parse(fs.readFileSync(this.tokenPath, 'utf8'));
                this.oauth2Client.setCredentials(token);
                return true;
            }
        } catch (error) {
            console.error('加载认证信息失败:', error);
        }
        return false;
    }

    private saveToken(token: any) {
        try {
            fs.writeFileSync(this.tokenPath, JSON.stringify(token));
            console.error('认证信息已保存');
        } catch (error) {
            console.error('保存认证信息失败:', error);
        }
    }

    async startAuthServer(): Promise<string> {
        if (this.oauth2Client.credentials && Object.keys(this.oauth2Client.credentials).length > 0) {
            try {
                await this.updateUserEmail();
                return '';
            } catch (error) {
                console.error('更新用户邮箱失败:', error);
                // 如果更新失败，清除认证信息重新认证
                this.oauth2Client.credentials = {};
            }
        }

        return new Promise((resolve) => {
            const app = express();

            app.get('/oauth2callback', async (req, res) => {
                const { code } = req.query;
                if (code) {
                    try {
                        const { tokens } = await this.oauth2Client.getToken(code as string);
                        this.oauth2Client.setCredentials(tokens);
                        this.saveToken(tokens);

                        await this.updateUserEmail();

                        res.send('认证成功！你可以关闭此窗口了。');
                        if (this.server) {
                            this.server.close();
                        }
                        resolve('');
                    } catch (error) {
                        console.error('获取 token 失败:', error);
                        res.send('认证失败：' + error);
                        resolve(this.getAuthUrl());
                    }
                } else {
                    res.send('未收到授权码');
                    resolve(this.getAuthUrl());
                }
            });

            this.server = app.listen(8001, () => {
                console.error('认证服务器已启动在端口 8001');
                resolve(this.getAuthUrl());
            });
        });
    }

    private getAuthUrl(): string {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/gmail.send',
                'https://www.googleapis.com/auth/gmail.readonly',
                'https://www.googleapis.com/auth/gmail.modify',
                'https://www.googleapis.com/auth/gmail.compose',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        });
    }

    private async updateUserEmail() {
        try {
            const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
            const profile = await gmail.users.getProfile({ userId: 'me' });
            this.userEmail = profile.data.emailAddress || null;
            console.error('已获取用户邮箱:', this.userEmail);
        } catch (error) {
            console.error('获取用户邮箱失败:', error);
            throw error;
        }
    }

    async sendEmail(to: string, content: string): Promise<void> {
        if (!this.oauth2Client.credentials || Object.keys(this.oauth2Client.credentials).length === 0) {
            throw new Error('未完成认证，请先完成 Google 账号认证');
        }

        if (!this.userEmail) {
            await this.updateUserEmail();
        }

        const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

        const email = [
            'Content-Type: text/plain; charset="UTF-8"',
            'MIME-Version: 1.0',
            `To: ${to}`,
            `From: ${this.userEmail}`,
            'Subject: MCP Email Service',
            '',
            content
        ].join('\n');

        const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        try {
            await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedEmail
                }
            });
            console.error('邮件发送成功');
        } catch (error) {
            console.error('发送邮件失败:', error);
            throw error;
        }
    }

    getUserEmail(): string | null {
        return this.userEmail;
    }
}
