import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { MockDataProvider } from "@/context/MockDataContext";
import { AuthProvider } from '@/context/AuthContext';
import { Web3Provider } from '@/context/Web3Context';
import { TalentProvider } from '@/context/TalentContext';
import { ContractProvider } from '@/context/ContractContext';
import { PaymentProvider } from '@/context/PaymentContext';
import { SupportProvider } from '@/context/SupportContext';
import { AIProvider } from '@/context/AIContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <AuthProvider>
            <Web3Provider>
              <TalentProvider>
                <ContractProvider>
                  <PaymentProvider>
                    <SupportProvider>
                      <AIProvider>
                        <SidebarProvider>
                          <MockDataProvider>{children}</MockDataProvider>
                        </SidebarProvider>
                      </AIProvider>
                    </SupportProvider>
                  </PaymentProvider>
                </ContractProvider>
              </TalentProvider>
            </Web3Provider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
