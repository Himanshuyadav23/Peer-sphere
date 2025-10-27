export type UserDoc = {
	uid: string;
	name: string;
	email: string | null;
	year: '1st' | '2nd' | '3rd' | 'MCA' | '';
	batch: string;
	interests: string[];
	avatarUrl: string;
	isAdmin?: boolean;
	createdAt?: any;
	updatedAt?: any;
};

export type Community = {
	id: string;
	name: string;
	description: string;
	category: string;
	createdBy: string;
	members: string[];
	createdAt?: any;
	updatedAt?: any;
	deleted?: boolean;
	deletedAt?: any;
};

export type EventDoc = {
	id: string;
	title: string;
	description: string;
	date: string; // ISO date
	time: string; // HH:mm
	venue: string;
	createdBy: string;
	communityId: string;
	attendees: string[];
	createdAt?: any;
};

export type MessageDoc = {
	id: string;
	conversationId: string;
	senderId: string;
	receiverId: string;
	text: string;
	timestamp: any;
};

export type NotificationDoc = {
	id: string;
	userId: string;
	type: 'dm' | 'rsvp';
	message: string;
	link: string;
	timestamp: any;
};

