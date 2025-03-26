import { Header } from '@/Components/Layout/Header';
import { Sidebar } from '@/Components/Layout/Sidebar';
import { PropsWithChildren } from 'react';

export default function Authenticated({ children }: PropsWithChildren) {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
