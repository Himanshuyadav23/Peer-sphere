import CreatorWatermark from '@/components/creator-watermark';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted relative">
			<div className="flex-1 flex items-center justify-center w-full">
				{children}
			</div>
			<footer className="w-full py-4 border-t border-gray-200">
				<CreatorWatermark variant="minimal" />
			</footer>
		</div>
	);
}

