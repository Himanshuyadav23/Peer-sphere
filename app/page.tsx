import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Users, MessageCircle, Calendar, Sparkles, ArrowRight } from 'lucide-react';

export default function LandingPage() {
	return (
		<div className="min-h-dvh relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-rose-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500" />
			</div>

			<header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
						<Sparkles className="w-5 h-5 text-white" />
					</div>
					<span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Peer Sphere</span>
				</div>
				<nav className="flex items-center gap-6">
					<Link href="/login" className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">Sign in</Link>
					<Link href="/signup">
						<Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
							Get Started
						</Button>
					</Link>
				</nav>
			</header>

			<section className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2">
				<div className="space-y-8">
					<div className="space-y-4">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
							<span className="text-sm font-medium text-gray-700">Live for SCSIT Students</span>
						</div>
						<h1 className="text-5xl font-black tracking-tight md:text-7xl">
							<span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
								Connect
							</span>
							<br />
							<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
								Collaborate
							</span>
							<br />
							<span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
								Grow
							</span>
						</h1>
					</div>
					<p className="text-xl text-gray-600 leading-relaxed max-w-lg">
						Join the most vibrant community for SCSIT (DAVV) students. Discover communities, attend events, 
						make connections, and build your network.
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<Link href="/signup">
							<Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group">
								Start Your Journey
								<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Button>
						</Link>
						<Link href="/login">
							<Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-pink-500 hover:text-pink-600 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
								I already have an account
							</Button>
						</Link>
					</div>

					{/* Feature highlights */}
					<div className="grid grid-cols-2 gap-6 pt-8">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center">
								<Users className="w-5 h-5 text-pink-600" />
							</div>
							<div>
								<div className="font-semibold text-gray-800">Communities</div>
								<div className="text-sm text-gray-600">Join & Create</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
								<Calendar className="w-5 h-5 text-blue-600" />
							</div>
							<div>
								<div className="font-semibold text-gray-800">Events</div>
								<div className="text-sm text-gray-600">Attend & Host</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
								<MessageCircle className="w-5 h-5 text-green-600" />
							</div>
							<div>
								<div className="font-semibold text-gray-800">Chat</div>
								<div className="text-sm text-gray-600">Real-time</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
								<Heart className="w-5 h-5 text-orange-600" />
							</div>
							<div>
								<div className="font-semibold text-gray-800">Matches</div>
								<div className="text-sm text-gray-600">Smart Connect</div>
							</div>
						</div>
					</div>
				</div>

				{/* Instagram-style mockup */}
				<div className="relative">
					<div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
						{/* Mock phone header */}
						<div className="flex items-center justify-between mb-6">
							<div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
								<Sparkles className="w-5 h-5 text-white" />
							</div>
							<div className="text-sm font-semibold text-gray-700">Peer Sphere</div>
							<div className="w-8 h-8 bg-gray-100 rounded-lg" />
						</div>

						{/* Mock feed items */}
						<div className="space-y-6">
							{/* Community card */}
							<div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
								<div className="p-4">
									<div className="flex items-center gap-3 mb-3">
										<div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
											<span className="text-white font-bold text-sm">WD</span>
										</div>
										<div>
											<div className="font-semibold text-sm">Web Dev Club</div>
											<div className="text-xs text-gray-500">Technology • 45 members</div>
										</div>
									</div>
									<div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 mb-3">
										<div className="text-sm font-medium text-gray-800">Next Workshop: React Hooks</div>
										<div className="text-xs text-gray-600 mt-1">Tomorrow at 3:00 PM</div>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex gap-4">
											<Heart className="w-5 h-5 text-gray-400" />
											<MessageCircle className="w-5 h-5 text-gray-400" />
										</div>
										<Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
											Join
										</Button>
									</div>
								</div>
							</div>

							{/* Event card */}
							<div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
								<div className="p-4">
									<div className="flex items-center gap-3 mb-3">
										<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
											<span className="text-white font-bold text-sm">CS</span>
										</div>
										<div>
											<div className="font-semibold text-sm">Computer Society</div>
											<div className="text-xs text-gray-500">Academic • 120 members</div>
										</div>
									</div>
									<div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-4 mb-3">
										<div className="text-sm font-medium text-gray-800">Hackathon 2024</div>
										<div className="text-xs text-gray-600 mt-1">This weekend • 24 hours</div>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex gap-4">
											<Heart className="w-5 h-5 text-red-500 fill-current" />
											<MessageCircle className="w-5 h-5 text-gray-400" />
										</div>
										<Button size="sm" variant="outline">
											RSVP
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Floating elements */}
					<div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-60 animate-bounce" />
					<div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-60 animate-bounce delay-500" />
				</div>
			</section>
		</div>
	);
}
