
export interface Course {
    id: string;
    tag: string;
    image: string;
    duration: string;
    age: string;
    title: string;
    description: string;
    price: string;
}

export const courses: Course[] = [
    {
        id: '1',
        tag: 'Beginner',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        duration: '8 Weeks',
        age: 'Ages 10-14',
        title: 'Python Adventures',
        description: 'Master the most popular language by building text adventures and tools.',
        price: 'Free',
    },
    {
        id: '2',
        tag: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        duration: '10 Weeks',
        age: 'Ages 12+',
        title: 'Web Wizardry',
        description: 'Create stunning websites using HTML, CSS, and JavaScript.',
        price: 'Free',
    },
    {
        id: '3',
        tag: 'Beginner',
        image: 'https://images.unsplash.com/photo-1580234547948-43840776b978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        duration: '6 Weeks',
        age: 'Ages 8-12',
        title: 'Game Design Lab',
        description: 'Start building your own video games with visual block coding.',
        price: 'Free',
    },
    {
        id: '4',
        tag: 'Advanced',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        duration: '12 Weeks',
        age: 'Ages 14+',
        title: 'App Inventor',
        description: 'Design and publish real mobile apps for iOS and Android.',
        price: 'Free',
    },
];

export async function getCourses(query?: string, category?: string): Promise<Course[]> {
    // Simulate server latency
    await new Promise((resolve) => setTimeout(resolve, 100));

    let filtered = [...courses];

    if (category && category !== 'All') {
        filtered = filtered.filter((course) => course.tag.toLowerCase() === category.toLowerCase());
    }

    if (query) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(
            (course) =>
                course.title.toLowerCase().includes(lowerQuery) ||
                course.description.toLowerCase().includes(lowerQuery)
        );
    }

    return filtered;
}

export interface Discussion {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    title: string;
    excerpt: string;
    category: string;
    likes: number;
    comments: number;
    time: string;
}

export interface CommunityStat {
    label: string;
    value: string;
    icon: string;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
}

export const discussions: Discussion[] = [
    {
        id: '1',
        user: { name: 'Alex Chen', avatar: 'https://i.pravatar.cc/150?u=alex' },
        title: 'Best practices for React Server Components?',
        excerpt: 'I am wondering how people are handling state management with the new RSC patterns...',
        category: 'General',
        likes: 24,
        comments: 12,
        time: '2h ago',
    },
    {
        id: '2',
        user: { name: 'Sarah Miller', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        title: 'Python for Data Science - Where to start?',
        excerpt: 'Looking for recommendations on libraries and projects for a beginner interested in ML...',
        category: 'Python',
        likes: 18,
        comments: 15,
        time: '5h ago',
    },
    {
        id: '3',
        user: { name: 'David Wilson', avatar: 'https://i.pravatar.cc/150?u=david' },
        title: 'Check out my new portfolio built with Next.js!',
        excerpt: 'I just finished my portfolio using the latest Next.js features and Tailwind CSS...',
        category: 'Showcase',
        likes: 45,
        comments: 8,
        time: '1d ago',
    },
    {
        id: '4',
        user: { name: 'Guest User', avatar: 'https://i.pravatar.cc/150?u=guest' },
        title: 'How to master Next.js quickly?',
        excerpt: 'I am looking for a structured path to learn Next.js from scratch. Any tips or resources?',
        category: 'Learning',
        likes: 12,
        comments: 4,
        time: '3h ago',
    },
];

export const communityStats: CommunityStat[] = [
    { label: 'Active Members', value: '15,000+', icon: 'fas fa-users' },
    { label: 'Courses Completed', value: '45k+', icon: 'fas fa-graduation-cap' },
    { label: 'Discussions Started', value: '12k+', icon: 'fas fa-comments' },
    { label: 'Questions Answered', value: '98%', icon: 'fas fa-check-circle' },
];

export const faqs: FAQ[] = [
    {
        id: '1',
        question: 'Are the courses really free?',
        answer: 'Yes! All courses on Code Mastery Zone are currently 100% free as part of our mission to make high-quality tech education accessible to everyone.',
    },
    {
        id: '2',
        question: 'Do I get a certificate upon completion?',
        answer: 'Absolutely. Once you finish all modules and pass the final assessment of a course, you will receive a digital certificate of completion.',
    },
    {
        id: '3',
        question: 'Is there a prerequisites for beginner courses?',
        answer: 'No prerequisites! Our beginner courses are designed for absolute newcomers. We start from the very basics.',
    },
    {
        id: '4',
        question: 'Can I interact with other students?',
        answer: 'Yes, our Community page is the perfect place to ask questions, share your projects, and collaborate with fellow learners.',
    },
];

export async function getDiscussions(): Promise<Discussion[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return discussions;
}

export async function getCommunityStats(): Promise<CommunityStat[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return communityStats;
}

export async function getFAQs(): Promise<FAQ[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return faqs;
}
