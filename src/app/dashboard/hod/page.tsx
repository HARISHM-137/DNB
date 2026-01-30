"use client";

import { useState, useEffect } from "react";
import DashboardClient from "../../../components/DashboardClient";
import { Users, ShieldCheck, ShieldAlert } from "lucide-react";

export default function HODDashboard() {
    interface User {
        _id: string;
        username: string;
        role: string;
        permissionStatus: string;
    }

    const [activeTab, setActiveTab] = useState<'notices' | 'users'>('notices');
    const [users, setUsers] = useState<User[]>([]);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    useEffect(() => {
        if (activeTab === 'users') {
            const fetchUsers = async () => {
                const res = await fetch("/api/users");
                if (res.ok) {
                    setUsers(await res.json());
                }
            };
            fetchUsers();
        }
    }, [activeTab, reloadTrigger]);

    const updateRole = async (userId: string, newRole: string) => {
        const res = await fetch("/api/users", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, role: newRole, permissionStatus: newRole === 'admin' || newRole === 'hod' ? 'approved' : 'none' }),
        });
        if (res.ok) {
            setReloadTrigger(prev => prev + 1);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50">
            {/* Header / Tabs */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
                    <button
                        onClick={() => setActiveTab('notices')}
                        className={`flex items-center gap-2 h-full border-b-2 px-2 font-medium transition-colors ${activeTab === 'notices' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Notice Management
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 h-full border-b-2 px-2 font-medium transition-colors ${activeTab === 'users' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <Users size={18} /> User Permissions
                    </button>
                </div>
            </div>

            {activeTab === 'notices' ? (
                <DashboardClient pageTitle="HOD Dashboard" />
            ) : (
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">User Permissions</h2>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-gray-500">Username</th>
                                    <th className="px-6 py-4 font-medium text-gray-500">Role</th>
                                    <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                                    <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${user.role === 'admin' ? 'bg-green-100 text-green-700' : user.role === 'hod' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{user.permissionStatus}</td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role !== 'hod' && user.role !== 'principal' && (
                                                <div className="flex justify-end gap-2">
                                                    {(user.role === 'student' || user.permissionStatus !== 'approved') ? (
                                                        <button
                                                            onClick={() => updateRole(user._id, 'admin')}
                                                            className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                                                        >
                                                            <ShieldCheck size={14} /> {user.role === 'admin' ? 'Approve Access' : 'Grant Admin'}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => updateRole(user._id, 'student')}
                                                            className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
                                                        >
                                                            <ShieldAlert size={14} /> Revoke Admin
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {users.map((user) => (
                            <div key={user._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">{user.username}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">Role: <span className="uppercase font-semibold">{user.role}</span></p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.permissionStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {user.permissionStatus}
                                    </span>
                                </div>

                                {user.role !== 'hod' && user.role !== 'principal' && (
                                    <div className="pt-3 border-t border-gray-50 flex gap-2">
                                        {(user.role === 'student' || user.permissionStatus !== 'approved') ? (
                                            <button
                                                onClick={() => updateRole(user._id, 'admin')}
                                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-medium"
                                            >
                                                <ShieldCheck size={18} /> Approve/Grant
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => updateRole(user._id, 'student')}
                                                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-100 transition border border-red-100 font-medium"
                                            >
                                                <ShieldAlert size={18} /> Revoke Admin
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
