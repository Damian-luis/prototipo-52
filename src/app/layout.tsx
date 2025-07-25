import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Web3Provider } from '@/context/Web3Context';
import { ProjectProvider } from '@/context/ProjectContext';
import { ContractProvider } from '@/context/ContractContext';
import { PaymentProvider } from '@/context/PaymentContext';
import { SupportProvider } from '@/context/SupportContext';
import { AIProvider } from '@/context/AIContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { TalentProvider } from '@/context/TalentContext';
import { ChatProvider } from '@/context/ChatContext';
import Toaster from '@/components/ui/Toaster';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <AuthProvider>
            <Web3Provider>
              <ProjectProvider>
                <ContractProvider>
                  <PaymentProvider>
                    <TalentProvider>
                      <SupportProvider>
                        <AIProvider>
                          <NotificationProvider>
                            <SidebarProvider>
                              <ChatProvider>
                                {children}
                                <Toaster />
                              </ChatProvider>
                            </SidebarProvider>
                          </NotificationProvider>
                        </AIProvider>
                      </SupportProvider>
                    </TalentProvider>
                  </PaymentProvider>
                </ContractProvider>
              </ProjectProvider>
            </Web3Provider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
