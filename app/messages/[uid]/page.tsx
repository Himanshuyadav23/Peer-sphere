"use client";

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFirebaseAuth, getDb } from '@/lib/firebase';
import { listenToConversation, sendMessage } from '@/lib/messages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Send, Heart, Smile } from 'lucide-react';
import { toast } from 'sonner';

export default function ChatPage() {
	const params = useParams<{ uid: string }>();
	const router = useRouter();
	const otherId = params?.uid as string;
	const auth = getFirebaseAuth();
	const me = auth.currentUser?.uid || '';
	const [messages, setMessages] = useState<any[]>([]);
	const [text, setText] = useState('');
	const [otherUser, setOtherUser] = useState<any>(null);
	const [isTyping, setIsTyping] = useState(false);
	const bottomRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (!me || !otherId) return;
		const unsub = listenToConversation(me, otherId, setMessages);
		return () => unsub();
	}, [me, otherId]);

	useEffect(() => {
		if (!otherId) return;
		(async () => {
			const db = getDb();
			const snap = await getDoc(doc(db, 'users', otherId));
			if (snap.exists()) {
				setOtherUser(snap.data());
			}
		})();
	}, [otherId]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Auto-resize textarea
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
		}
	}, [text]);

	const formatTime = (timestamp: any) => {
		if (!timestamp) return '';
		const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const formatDate = (timestamp: any) => {
		if (!timestamp) return '';
		const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return 'Today';
		} else if (date.toDateString() === yesterday.toDateString()) {
			return 'Yesterday';
		} else {
			return date.toLocaleDateString();
		}
	};

	async function onSend(e: React.FormEvent) {
		e.preventDefault();
		if (!text.trim()) return;
		if (!me || !otherId) {
			console.error('Missing me or otherId');
			return;
		}
		setIsTyping(true);
		try {
			await sendMessage(me, otherId, text.trim());
			setText('');
		} catch (error: any) {
			console.error('Error sending message:', error);
			toast.error(error.message || 'Failed to send message');
		} finally {
			setIsTyping(false);
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onSend(e);
		}
	};

	if (!otherUser) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<Heart className="w-8 h-8 text-white animate-pulse" />
					</div>
					<p className="text-gray-600">Loading conversation...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex flex-col">
			{/* Chat Header */}
			<div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-4 shadow-lg">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => router.back()}
							className="w-8 h-8 p-0"
						>
							<ArrowLeft className="w-5 h-5" />
						</Button>
						<div className="flex items-center gap-3">
							<Avatar className="w-10 h-10 border-2 border-white shadow-lg">
								<AvatarImage src={otherUser.avatarUrl} />
								<AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold">
									{otherUser.name?.substring(0, 2).toUpperCase() || 'U'}
								</AvatarFallback>
							</Avatar>
							<div>
								<h2 className="font-semibold text-gray-800">{otherUser.name}</h2>
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-xs text-gray-500">Online</span>
									{otherUser.year && (
										<Badge variant="secondary" className="text-xs bg-pink-100 text-pink-700 border-pink-200">
											{otherUser.year} Year
										</Badge>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Messages Area */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.length === 0 ? (
					<div className="text-center py-16">
						<div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Heart className="w-8 h-8 text-pink-600" />
						</div>
						<h3 className="text-lg font-semibold text-gray-800 mb-2">Start the conversation!</h3>
						<p className="text-gray-600">Send your first message to {otherUser.name}</p>
					</div>
				) : (
					messages.map((message, index) => {
						const isMe = message.senderId === me;
						const showDate = index === 0 || formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
						
						return (
							<div key={message.id} className="space-y-2">
								{showDate && (
									<div className="text-center">
										<Badge variant="secondary" className="bg-white/80 text-gray-600 border-white/20">
											{formatDate(message.timestamp)}
										</Badge>
									</div>
								)}
								<div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
									<div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
										<div className={`rounded-2xl px-4 py-3 shadow-lg ${
											isMe 
												? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
												: 'bg-white/90 backdrop-blur-sm text-gray-800 border border-white/20'
										}`}>
											<p className="text-sm leading-relaxed">{message.text}</p>
										</div>
										<div className={`text-xs text-gray-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
											{formatTime(message.timestamp)}
										</div>
									</div>
									{!isMe && (
										<div className="order-2 ml-2">
											<Avatar className="w-6 h-6 border border-white shadow-sm">
												<AvatarImage src={otherUser.avatarUrl} />
												<AvatarFallback className="text-xs bg-gradient-to-br from-pink-500 to-purple-600 text-white">
													{otherUser.name?.substring(0, 1).toUpperCase() || 'U'}
												</AvatarFallback>
											</Avatar>
										</div>
									)}
								</div>
							</div>
						);
					})
				)}
				{isTyping && (
					<div className="flex justify-start">
						<div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/20">
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
								<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
								<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
							</div>
						</div>
					</div>
				)}
				<div ref={bottomRef} />
			</div>

			{/* Message Input */}
			<div className="bg-white/80 backdrop-blur-sm border-t border-white/20 p-4 shadow-lg">
				<form onSubmit={onSend} className="flex items-end gap-3">
					<div className="flex-1 relative">
						<textarea
							ref={textareaRef}
							value={text}
							onChange={(e) => setText(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Type a message..."
							className="w-full resize-none rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-sm px-4 py-3 pr-12 text-sm shadow-lg focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 max-h-32"
							rows={1}
						/>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0"
						>
							<Smile className="w-4 h-4 text-gray-400" />
						</Button>
					</div>
					<Button
						type="submit"
						disabled={!text.trim() || isTyping}
						className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<Send className="w-5 h-5" />
					</Button>
				</form>
			</div>
		</div>
	);
}
