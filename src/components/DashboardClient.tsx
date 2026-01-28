"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import NoticeCard from "@/components/NoticeCard";

interface Notice {
    _id: string;
    title: string;
    content: string;
    media: { fileId: string; type: string; filename: string; contentType: string }[];
    updatedAt: string;
    createdBy: { username: string; role: string };
}

type NoticeType = Notice;

interface DashboardClientProps {
    pageTitle?: string;
}

export default function DashboardClient({ pageTitle = "Dashboard" }: DashboardClientProps) {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Edit State
    const [editingNotice, setEditingNotice] = useState<NoticeType | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<FileList | null>(null);

    const fetchNotices = async () => {
        try {
            const res = await fetch("/api/notices");
            if (res.ok) {
                const data = await res.json();
                setNotices(data);
            }
        } catch (error) {
            console.error("Failed to fetch notices", error);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const [uploadProgress, setUploadProgress] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (files) {
            Array.from(files).forEach((file) => {
                formData.append("files", file);
            });
        }

        const url = editingNotice ? `/api/notices?id=${editingNotice._id}` : "/api/notices";
        const method = editingNotice ? "PUT" : "POST";

        try {
            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open(method, url);

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(percentComplete);
                    }
                };

                xhr.onload = async () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error("Failed to upload"));
                    }
                };

                xhr.onerror = () => reject(new Error("Network error"));

                xhr.send(formData);
            });

            setIsModalOpen(false);
            setTitle("");
            setContent("");
            setFiles(null);
            setUploadProgress(0);
            fetchNotices();
        } catch (error) {
            console.error(error);
            alert("Error creating notice");
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this notice?")) return;

        try {
            const res = await fetch(`/api/notices?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setNotices(notices.filter(n => n._id !== id));
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete notice");
            }
        } catch (error) {
            console.error("Error deleting notice:", error);
            alert("Error deleting notice");
        }
    };

    const handleEdit = (notice: NoticeType) => {
        setEditingNotice(notice);
        setTitle(notice.title);
        setContent(notice.content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingNotice(null);
        setTitle("");
        setContent("");
        setFiles(null);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
                        <p className="text-gray-500 mt-1">Manage academic notices and announcements</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingNotice(null);
                            setTitle("");
                            setContent("");
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-medium"
                    >
                        <Plus size={20} /> New Notice
                    </button>
                </div>

                <div className="grid gap-6">
                    {notices.map((notice) => (
                        <NoticeCard key={notice._id} notice={notice} isAdmin onDelete={handleDelete} onEdit={handleEdit} />
                    ))}
                    {notices.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-gray-500 text-lg">No notices published yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">{editingNotice ? "Edit Notice" : "Create New Notice"}</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (Images, Video, Audio)</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => setFiles(e.target.files)}
                                    // Removed accept restriction to allow all document types
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Supported formats: Images, Videos, Audio, PDFs, Docs, etc.</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium shadow-md"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            {uploadProgress > 0 && uploadProgress < 100 ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Uploading {uploadProgress}%</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Processing...</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (editingNotice ? "Update Notice" : "Publish Notice")}
                                </button>
                            </div>
                        </form>
                        {loading && uploadProgress > 0 && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
