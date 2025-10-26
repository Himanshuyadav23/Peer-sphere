export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-dvh flex items-center justify-center bg-gradient-to-b from-background to-muted">
			{children}
		</div>
	);
}

