import type { PaginatedResponse } from '@/types/api';
import type { AuthResponse, User } from '@/types/user';
import type { Question, Message, Feedback, Insight, Caregiver, AdminStats } from '@/types/geriacare';
import { v4 as uuid } from 'uuid';

export const mockUser: User = {
    id: uuid(),
    email: 'user@example.com',
    name: 'John Doe',
    role: 'USER',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockAdminUser: User = {
    id: uuid(),
    email: 'admin@example.com',
    name: 'Jane Smith',
    role: 'ADMIN',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockUsers: User[] = [mockUser, mockAdminUser];

export const mockAuthResponse: AuthResponse = {
    user: mockUser,
    tokens: {
        access: {
            token: 'mock-access-token',
            expires: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        },
        refresh: {
            token: 'mock-refresh-token',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    }
};

export const mockPaginatedUsers: PaginatedResponse<User> = {
    results: mockUsers,
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 2
};

export const mockQuestions: Question[] = [
    {
        id: 'q1',
        name: 'Rajesh Kumar',
        city: 'Delhi',
        relation: 'Son/Daughter',
        phone: '+91-9876543210',
        content:
            'My father, who is 75 years old, has been having difficulty sleeping at night. He often wakes up multiple times and feels restless. What are some safe and non-medical ways to help him get better sleep?',
        status: 'answered',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'q2',
        name: 'Priya Sharma',
        city: 'Mumbai',
        relation: 'Spouse',
        content:
            'My husband is 72 and has been losing his appetite recently. He used to enjoy his meals but now barely eats. Are there any ways to make food more appealing and nutritious for seniors?',
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'q3',
        name: 'Amit Patel',
        city: 'Bangalore',
        relation: 'Grandchild',
        phone: '+91-9123456789',
        content:
            'My grandmother is 78 and has trouble remembering to take her medicines. She lives alone and we are worried about her forgetting doses. What are some practical ways to help her remember?',
        status: 'pending',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
];

export const mockMessages: Message[] = [
    {
        id: 'm1',
        questionId: 'q1',
        content:
            'Thank you for your question about sleep difficulties in seniors. Here are some gentle, non-medical approaches that can help improve sleep quality:\n\n1. **Establish a consistent bedtime routine** - Going to bed and waking up at the same time daily helps regulate the body clock.\n\n2. **Create a comfortable sleep environment** - Ensure the room is dark, quiet, and cool (around 65-68°F).\n\n3. **Limit afternoon naps** - If naps are needed, keep them short (20-30 minutes) and before 3 PM.\n\n4. **Gentle evening activities** - Light reading, soft music, or gentle stretching can help the body prepare for sleep.\n\n5. **Avoid screens 1-2 hours before bedtime** - The blue light can interfere with natural sleep hormones.\n\nRemember, this is general guidance and not medical advice. If sleep problems persist, please consult with a healthcare provider.',
        sender: 'admin',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'm2',
        questionId: 'q1',
        content:
            'Thank you so much for the detailed response! These suggestions are very helpful. We will try establishing a consistent routine and see how it works.',
        sender: 'user',
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
    }
];

export const mockFeedback: Feedback[] = [
    {
        id: 'f1',
        name: 'Sanjay Gupta',
        email: 'sanjay.gupta@example.com',
        feedbackType: 'Appreciation',
        message:
            'The care guidance provided on your website has been incredibly helpful for taking care of my elderly mother. The tips are practical and easy to follow.',
        rating: 5,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'f2',
        name: 'Meera Joshi',
        feedbackType: 'Content Suggestion',
        message:
            'Could you please add more content about managing diabetes in seniors? It would be very helpful for families dealing with this condition.',
        rating: 4,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'f3',
        name: 'Rohit Verma',
        email: 'rohit.verma@example.com',
        feedbackType: 'Website Issues',
        message:
            'The website loads slowly on my mobile device. Could you please look into optimizing it for better mobile performance?',
        rating: 3,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
];

export const mockInsights: Insight[] = [
    {
        id: 'i1',
        title: 'Safe Bathing Practices for Seniors',
        content:
            '# Safe Bathing Practices for Seniors\n\n*Disclaimer: This content provides general guidance and is not medical advice. Always consult healthcare professionals for specific medical concerns.*\n\nBathing safely becomes increasingly important as we age. Here are essential tips to ensure your elderly loved ones can maintain personal hygiene safely:\n\n## Key Safety Measures\n\n1. **Non-slip surfaces** - Install rubber mats both inside and outside the bathtub\n2. **Grab bars** - Install sturdy grab bars near the toilet and in the shower area\n3. **Shower chairs** - Consider a shower chair for those who have difficulty standing\n4. **Water temperature** - Test water temperature to prevent burns (ideally 100-110°F)\n\n## Creating a Routine\n\n- Schedule baths when the senior feels most energetic\n- Ensure good lighting in the bathroom\n- Keep towels and clothing within easy reach\n- Consider assistance for those with mobility issues\n\nRemember, maintaining dignity while ensuring safety is key to successful bathing routines.',
        category: 'Bathing & Hygiene',
        excerpt:
            'Essential safety tips and practices to help seniors maintain personal hygiene safely and independently.',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Dr. Sarah Mehta'
    },
    {
        id: 'i2',
        title: 'Nutritious Meal Planning for Elderly',
        content:
            "# Nutritious Meal Planning for Elderly\n\n*Disclaimer: This content provides general guidance and is not medical advice. Always consult healthcare professionals for specific dietary needs.*\n\nProper nutrition plays a crucial role in maintaining health and vitality in seniors. Here's how to create appetizing and nutritious meals:\n\n## Essential Nutrients\n\n1. **Protein** - Include lean meats, fish, eggs, and legumes\n2. **Calcium** - Dairy products, leafy greens, and fortified foods\n3. **Fiber** - Whole grains, fruits, and vegetables\n4. **Hydration** - Ensure adequate water intake throughout the day\n\n## Making Meals Appealing\n\n- Use herbs and spices to enhance flavor\n- Serve smaller, frequent meals\n- Make meals colorful with various fruits and vegetables\n- Consider texture modifications if needed\n\n## Practical Tips\n\n- Prepare meals in advance and freeze portions\n- Keep healthy snacks easily accessible\n- Make eating a social activity when possible\n\nGood nutrition supports overall health and can improve quality of life significantly.",
        category: 'Food & Nutrition',
        excerpt:
            'Comprehensive guide to planning nutritious, appealing meals that meet the specific dietary needs of seniors.',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Nutritionist Priya Kumar'
    },
    {
        id: 'i3',
        title: 'Managing Emotions and Loneliness in Seniors',
        content:
            '# Managing Emotions and Loneliness in Seniors\n\n*Disclaimer: This content provides general guidance and is not medical advice. Always consult healthcare professionals for specific mental health concerns.*\n\nEmotional wellbeing is just as important as physical health for seniors. Here are ways to support mental and emotional health:\n\n## Recognizing Signs\n\n- Changes in appetite or sleep patterns\n- Withdrawal from social activities\n- Persistent sadness or anxiety\n- Loss of interest in hobbies\n\n## Building Emotional Support\n\n1. **Regular social interaction** - Schedule visits, phone calls, or video chats\n2. **Meaningful activities** - Encourage hobbies, volunteer work, or creative pursuits\n3. **Physical activity** - Gentle exercises like walking or yoga can boost mood\n4. **Routine maintenance** - Keep familiar daily routines for comfort and stability\n\n## Creating Connection\n\n- Join senior community centers or groups\n- Participate in religious or spiritual activities\n- Consider pet companionship\n- Engage in intergenerational activities\n\nRemember, professional help should be sought if emotional issues persist or worsen.',
        category: 'Emotional Wellbeing',
        excerpt:
            'Strategies to recognize and address emotional challenges, loneliness, and depression in elderly adults.',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Dr. Anjali Sharma'
    },
    {
        id: 'i4',
        title: 'Creating Structured Daily Routines',
        content:
            '# Creating Structured Daily Routines\n\n*Disclaimer: This content provides general guidance and is not medical advice. Always consult healthcare professionals for specific health concerns.*\n\nA well-structured daily routine provides stability, purpose, and improved quality of life for seniors:\n\n## Benefits of Routine\n\n- Reduces anxiety and confusion\n- Improves sleep patterns\n- Ensures essential tasks are completed\n- Provides sense of purpose and control\n\n## Essential Components\n\n1. **Morning routine** - Consistent wake-up time, morning hygiene, light breakfast\n2. **Physical activity** - Daily walks, stretching, or chair exercises\n3. **Meal times** - Regular, nutritious meals at consistent times\n4. **Social time** - Scheduled interactions with family, friends, or caregivers\n5. **Evening routine** - Calming activities before consistent bedtime\n\n## Flexibility Within Structure\n\n- Allow for spontaneous activities\n- Adapt routines for weather or health changes\n- Include enjoyable activities and hobbies\n- Balance active and restful periods\n\nRoutines should be comforting, not restrictive, and can be adjusted based on individual preferences and needs.',
        category: 'Daily Routine',
        excerpt:
            'Guide to establishing beneficial daily routines that provide structure, purpose, and improved quality of life.',
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Geriatric Care Specialist Maya Iyer'
    },
    {
        id: 'i5',
        title: 'Oral Hygiene Tips for Seniors',
        content:
            '# Oral Hygiene Tips for Seniors\n\n*Disclaimer: This content provides general guidance and is not medical advice. Always consult dental professionals for specific oral health concerns.*\n\nMaintaining good oral hygiene becomes increasingly important with age:\n\n## Common Challenges\n\n- Decreased saliva production\n- Medication side effects affecting oral health\n- Physical limitations affecting brushing ability\n- Gum disease and tooth sensitivity\n\n## Daily Care Routine\n\n1. **Gentle brushing** - Use soft-bristled toothbrush twice daily\n2. **Fluoride toothpaste** - Choose appropriate fluoride concentration\n3. **Flossing or alternatives** - Use floss picks or water flossers if traditional flossing is difficult\n4. **Mouth rinse** - Alcohol-free mouthwash can help with dry mouth\n\n## Special Considerations\n\n- Clean dentures daily and soak overnight\n- Schedule regular dental check-ups\n- Stay hydrated to combat dry mouth\n- Avoid hard candies and sticky foods\n\nGood oral health is connected to overall health and can prevent serious complications.',
        category: 'Bathing & Hygiene',
        excerpt:
            'Essential oral care practices and tips specifically designed for seniors to maintain healthy teeth and gums.',
        publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Dr. Vikram Dental Care'
    },
    {
        id: 'i6',
        title: 'Hydration and Fluid Management',
        content:
            '# Hydration and Fluid Management\n\n*Disclaimer: This content provides general guidance and is not medical advice. Always consult healthcare professionals for specific health concerns.*\n\nProper hydration is crucial for seniors, who are at higher risk of dehydration:\n\n## Why Hydration Matters More\n\n- Decreased kidney function with age\n- Reduced sensation of thirst\n- Medications that affect fluid balance\n- Chronic conditions that increase fluid needs\n\n## Daily Hydration Goals\n\n1. **Water intake** - Aim for 6-8 glasses of water daily\n2. **Variety of fluids** - Include herbal teas, broths, and milk\n3. **Water-rich foods** - Fruits like watermelon, oranges, and vegetables like cucumbers\n4. **Monitor color** - Pale yellow urine indicates good hydration\n\n## Practical Tips\n\n- Keep water bottles in multiple rooms\n- Set reminders to drink fluids\n- Flavor water with lemon or mint if plain water is unappealing\n- Limit caffeine and alcohol which can be dehydrating\n\n## Warning Signs of Dehydration\n\n- Dizziness or confusion\n- Dry mouth or lips\n- Fatigue or weakness\n- Decreased urination\n\nProper hydration supports overall health, medication effectiveness, and cognitive function.',
        category: 'Food & Nutrition',
        excerpt:
            'Important guidelines for maintaining proper hydration in seniors, including practical tips and warning signs.',
        publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Nutritionist Dr. Kavita Rao'
    },
    {
        id: 'i7',
        title: 'Sleep Quality and Rest Management',
        content:
            '# Sleep Quality and Rest Management\n\n*Disclaimer: This content provides general guidance and is not medical advice. Always consult healthcare professionals for specific sleep concerns.*\n\nQuality sleep becomes more challenging but more important with age:\n\n## Common Sleep Changes\n\n- Earlier bedtimes and wake times\n- More frequent night wakings\n- Lighter sleep phases\n- Shorter total sleep time\n\n## Creating Good Sleep Environment\n\n1. **Comfortable temperature** - Keep room cool (65-68°F)\n2. **Dark room** - Use blackout curtains or eye masks\n3. **Quiet space** - Consider white noise machines for consistent sound\n4. **Comfortable bedding** - Supportive pillows and mattress\n\n## Healthy Sleep Habits\n\n- Consistent bedtime and wake time\n- Limit daytime naps to 20-30 minutes\n- Avoid screens 2 hours before bed\n- Light dinner 3 hours before bedtime\n- Relaxing bedtime routine (reading, gentle music)\n\n## When to Seek Help\n\n- Persistent insomnia lasting more than a few weeks\n- Loud snoring or breathing interruptions\n- Excessive daytime sleepiness\n- Frequent nightmares or night terrors\n\nGood sleep supports immune function, memory, and emotional wellbeing.',
        category: 'Daily Routine',
        excerpt:
            'Comprehensive guide to improving sleep quality and establishing healthy rest patterns for better overall health.',
        publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Sleep Specialist Dr. Rajesh Nair'
    },
    {
        id: 'i8',
        title: 'Building Social Connections and Community',
        content:
            '# Building Social Connections and Community\n\n*Disclaimer: This content provides general guidance and is not medical advice. Always consult healthcare professionals for specific mental health concerns.*\n\nSocial connections are vital for mental, emotional, and even physical health in seniors:\n\n## Benefits of Social Connection\n\n- Reduced risk of depression and anxiety\n- Improved cognitive function\n- Better physical health outcomes\n- Increased sense of purpose and belonging\n\n## Ways to Stay Connected\n\n1. **Technology tools** - Video calls with family and friends\n2. **Community activities** - Senior centers, religious organizations, clubs\n3. **Volunteering** - Sharing skills and experience with others\n4. **Learning opportunities** - Classes, workshops, book clubs\n\n## Creating New Friendships\n\n- Join groups with shared interests\n- Participate in neighborhood activities\n- Attend community events regularly\n- Consider intergenerational programs\n\n## For Family Members\n\n- Schedule regular visits or calls\n- Include seniors in family activities\n- Help them connect with old friends\n- Encourage new social opportunities\n- Be patient with technology learning\n\nSocial engagement is not a luxury—it is essential for healthy aging.',
        category: 'Emotional Wellbeing',
        excerpt:
            'Strategies for maintaining and building social connections to combat loneliness and support overall wellbeing.',
        publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Social Worker Deepika Jain'
    },
    {
        id: 'i9',
        title: 'Home Safety and Fall Prevention',
        content:
            '# Home Safety and Fall Prevention\n\n*Disclaimer: This content provides general guidance and is not medical advice. Always consult healthcare professionals for specific safety concerns.*\n\nCreating a safe home environment is crucial for maintaining independence and preventing accidents:\n\n## Key Safety Areas\n\n1. **Lighting** - Ensure adequate lighting in all areas, especially stairs and hallways\n2. **Floor surfaces** - Remove loose rugs, fix uneven surfaces\n3. **Bathroom safety** - Install grab bars, non-slip mats, and raised toilet seats\n4. **Stair safety** - Handrails on both sides, good lighting, non-slip treads\n\n## Fall Prevention Strategies\n\n- Clear walkways of clutter\n- Secure electrical cords\n- Use night lights in bedrooms and bathways\n- Wear appropriate, non-slip footwear\n- Keep frequently used items at accessible heights\n\n## Emergency Preparedness\n\n- Install medical alert systems\n- Keep emergency contacts easily accessible\n- Ensure cell phone is always charged and nearby\n- Consider smart home devices for quick help\n\n## Regular Maintenance\n\n- Check and replace smoke detector batteries\n- Test medical alert devices monthly\n- Review and update emergency contact information\n- Conduct seasonal safety reviews\n\nA safe home environment supports independent living and provides peace of mind for both seniors and their families.',
        category: 'General Care',
        excerpt:
            'Essential home safety tips and fall prevention strategies to create a secure living environment for seniors.',
        publishedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Home Safety Expert Arjun Mishra'
    }
];

export const mockCaregivers: Caregiver[] = [
    {
        id: 'c1',
        name: 'Sunita Devi',
        photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
        experience: 8,
        city: 'Delhi',
        languages: ['Hindi', 'English', 'Punjabi'],
        skills: ['Elderly Care', 'Meal Preparation', 'Medication Reminders', 'Companionship'],
        availability: 'available',
        contactInfo: 'Contact through Geriacare admin',
        verified: true
    },
    {
        id: 'c2',
        name: 'Lakshmi Pillai',
        photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
        experience: 12,
        city: 'Mumbai',
        languages: ['Hindi', 'English', 'Marathi', 'Malayalam'],
        skills: ['Elderly Care', 'Physical Therapy Support', 'Meal Preparation', 'Housekeeping'],
        availability: 'busy',
        contactInfo: 'Contact through Geriacare admin',
        verified: true
    },
    {
        id: 'c3',
        name: 'Kamala Reddy',
        photo: 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?w=400&h=400&fit=crop&crop=face',
        experience: 5,
        city: 'Bangalore',
        languages: ['English', 'Kannada', 'Telugu', 'Tamil'],
        skills: ['Elderly Care', 'Companionship', 'Light Housekeeping', 'Medication Reminders'],
        availability: 'available',
        contactInfo: 'Contact through Geriacare admin',
        verified: true
    }
];

export const mockAdminStats: AdminStats = {
    totalQuestions: 3,
    pendingQuestions: 2,
    answeredQuestions: 1,
    totalInsights: 9,
    totalCaregivers: 3,
    activeCaregivers: 2,
    totalFeedback: 3
};
