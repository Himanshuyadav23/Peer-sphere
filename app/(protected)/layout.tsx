import Link from 'next/link';
import { ReactNode } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Menu, Plus, Home, Users, Calendar, MessageCircle, Heart, Sparkles, Shield, TrendingUp, Settings } from 'lucide-react';
import AuthGate from '@/components/auth-gate';
import NotificationsBell from '@/components/notifications-bell';
import PageTransition from '@/components/page-transition';
import UserMenu from '@/components/user-menu';
import HeaderSearch from '@/components/header-search';
import CreatorWatermark from '@/components/creator-watermark';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthGate>
			<div className="min-h-dvh grid grid-cols-1 lg:grid-cols-[280px_1fr] bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
				<aside className="hidden lg:block border-r border-white/20 bg-white/60 backdrop-blur-sm relative pb-20">
					<div className="p-6">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
								<Sparkles className="w-6 h-6 text-white" />
							</div>
							<span className="text-xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
								Peer Sphere
							</span>
						</div>
					</div>
					<nav className="space-y-2 p-4">
						<NavLink href="/dashboard" icon={<Home className="w-5 h-5" />}>Dashboard</NavLink>
						<div className="space-y-2">
							<NavLink href="/communities" icon={<Users className="w-5 h-5" />}>Communities</NavLink>
							<div className="ml-8 space-y-2">
								<NavLink href="/communities/my" icon={<Users className="w-4 h-4" />}>My Communities</NavLink>
								<Link href="/communities/create">
									<Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-9 bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 text-pink-700 border border-pink-200/50">
										<Plus className="h-4 w-4" />
										Create
									</Button>
								</Link>
							</div>
						</div>
						<NavLink href="/events" icon={<Calendar className="w-5 h-5" />}>Events</NavLink>
						<NavLink href="/messages" icon={<MessageCircle className="w-5 h-5" />}>Messages</NavLink>
						<NavLink href="/matches" icon={<Heart className="w-5 h-5" />}>Matches</NavLink>
					<div className="pt-4 mt-4 border-t border-white/20">
						<NavLink href="/admin" icon={<Shield className="w-5 h-5" />}>Admin Panel</NavLink>
					</div>
					</nav>
					<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-white/40 backdrop-blur-sm">
						<CreatorWatermark variant="compact" />
					</div>
				</aside>
				<div className="flex min-h-dvh flex-col bg-white/40 backdrop-blur-sm">
					<header className="flex items-center gap-4 border-b border-white/20 px-6 py-4 bg-white/60 backdrop-blur-sm">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="lg:hidden bg-white/80 hover:bg-white/90 shadow-lg">
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-72 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
								<div className="p-6">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
											<Sparkles className="w-6 h-6 text-white" />
										</div>
										<span className="text-xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
											Peer Sphere
										</span>
									</div>
								</div>
								<nav className="space-y-2 p-4">
									<NavLink href="/dashboard" icon={<Home className="w-5 h-5" />}>Dashboard</NavLink>
									<NavLink href="/home" icon={<TrendingUp className="w-5 h-5" />}>Activity Feed</NavLink>
									<div className="space-y-2">
										<NavLink href="/communities" icon={<Users className="w-5 h-5" />}>Communities</NavLink>
										<div className="ml-8 space-y-2">
											<NavLink href="/communities/my" icon={<Users className="w-4 h-4" />}>My Communities</NavLink>
											<Link href="/communities/create">
												<Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-9 bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 text-pink-700 border border-pink-200/50">
													<Plus className="h-4 w-4" />
													Create
												</Button>
											</Link>
										</div>
									</div>
									<NavLink href="/events" icon={<Calendar className="w-5 h-5" />}>Events</NavLink>
									<NavLink href="/messages" icon={<MessageCircle className="w-5 h-5" />}>Messages</NavLink>
									<NavLink href="/matches" icon={<Heart className="w-5 h-5" />}>Matches</NavLink>
									<div className="pt-4 mt-4 border-t border-white/20">
										<NavLink href="/settings" icon={<Settings className="w-5 h-5" />}>Settings</NavLink>
										<NavLink href="/admin" icon={<Shield className="w-5 h-5" />}>Admin Panel</NavLink>
									</div>
								</nav>
							</SheetContent>
						</Sheet>
						<HeaderSearch />
						<div className="flex-1" />
						<div className="flex items-center gap-3">
							<NotificationsBell />
							<Separator orientation="vertical" className="h-8" />
							<UserMenu />
						</div>
					</header>
					<main className="flex-1 overflow-auto">
						<PageTransition>{children}</PageTransition>
					</main>
				</div>
			</div>
		</AuthGate>
	);
}

function NavLink({ href, children, icon }: { href: string; children: ReactNode; icon?: ReactNode }) {
	return (
		<Link href={href} className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/60 hover:shadow-lg transition-all duration-300 group">
			{icon && (
				<div className="flex-shrink-0 text-gray-600 group-hover:text-pink-600 transition-colors">
					{icon}
				</div>
			)}
			<span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
				{children}
			</span>
		</Link>
	);
}
