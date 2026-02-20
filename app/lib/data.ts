import { Key, ReactNode } from "react";

export interface Course {
    age: ReactNode;
    id: Key | null | undefined;
    _id: string; // Updated from id to _id for MongoDB compatibility if needed, but frontend uses id
    tag: string;
    image: string;
    duration: string;
    ageGroup: string; // Updated to match schema
    title: string;
    description: string;
    price: string;
}

export async function getCourses(query?: string, category?: string): Promise<Course[]> {
    try {
        const res = await fetch('http://localhost:8000/api/courses', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch courses');
        let data: Course[] = await res.json();

        // Client-side filtering for now, or implement in backend
        if (category && category !== 'All') {
            data = data.filter((course) => course.tag.toLowerCase() === category.toLowerCase());
        }

        if (query) {
            const lowerQuery = query.toLowerCase();
            data = data.filter(
                (course) =>
                    course.title.toLowerCase().includes(lowerQuery) ||
                    course.description.toLowerCase().includes(lowerQuery)
            );
        }
        return data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
}

export interface Discussion {
    _id: string;
    user: {
        name: string;
        avatar: string;
    };
    title: string;
    excerpt: string;
    category: string;
    likes: number;
    comments: number; // Changed from any[] to number since API returns count
    createdAt: string;
    time?: string; // Formatted time string from API
}

export interface CommunityStat {
    label: string;
    value: string;
    icon: string;
}

export interface FAQ {
    _id: string;
    question: string;
    answer: string;
}

export async function getDiscussions(): Promise<Discussion[]> {
    try {
        const res = await fetch('http://localhost:8000/api/discussions', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch discussions');
        return res.json();
    } catch (error) {
        console.error('Error fetching discussions:', error);
        return [];
    }
}

export const communityStats: CommunityStat[] = [
    { label: 'Active Members', value: '15,000+', icon: 'fas fa-users' },
    { label: 'Courses Completed', value: '45k+', icon: 'fas fa-graduation-cap' },
    { label: 'Discussions Started', value: '12k+', icon: 'fas fa-comments' },
    { label: 'Questions Answered', value: '98%', icon: 'fas fa-check-circle' },
];

export async function getCommunityStats(): Promise<CommunityStat[]> {
    // Keep mock for now
    await new Promise((resolve) => setTimeout(resolve, 100));
    return communityStats;
}

export async function getFAQs(): Promise<FAQ[]> {
    try {
        const res = await fetch('http://localhost:8000/api/faqs', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch FAQs');
        return res.json();
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        return [];
    }
}
