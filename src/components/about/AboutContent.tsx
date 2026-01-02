import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Users, Clock, CheckCircle } from 'lucide-react';

const values = [
    {
        icon: Heart,
        title: 'Compassionate Care',
        description: 'Every senior deserves dignity, respect, and loving care in their daily life.'
    },
    {
        icon: Shield,
        title: 'Trusted Guidance',
        description: 'Our advice is based on years of experience in senior care and observation.'
    },
    {
        icon: Users,
        title: 'Family Support',
        description: 'We understand the challenges families face and provide practical solutions.'
    },
    {
        icon: Clock,
        title: 'Timely Response',
        description: 'Quick support when you need it most, through multiple channels.'
    }
];

const services = [
    'Personalized care question responses',
    'Expert observations on daily routines',
    'Hygiene and bathing guidance',
    'Nutritional advice for seniors',
    'Emotional wellbeing support',
    'Caregiver recommendations',
    'WhatsApp and phone support',
    'Family education resources'
];

export const AboutContent = () => {
    return (
        <div className='space-y-12 lg:space-y-16'>
            {/* Introduction */}
            <section className='text-center space-y-6'>
                <div className='flex items-center justify-center mb-6'>
                    <div className='flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-primary rounded-full'>
                        <Heart className='h-8 w-8 lg:h-10 lg:w-10 text-primary-foreground fill-current' />
                    </div>
                </div>
                <h1 className='text-3xl lg:text-5xl font-bold text-foreground'>About Geriacare</h1>
                <p className='text-xl lg:text-2xl text-primary font-medium'>
                    Observation & Opinions – Trusted domestic care guidance for seniors 70+
                </p>
                <p className='text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed'>
                    Geriacare provides compassionate, non-clinical domestic care guidance specifically designed for
                    families caring for seniors aged 70 and above. We bridge the gap between professional medical care
                    and everyday practical support.
                </p>
            </section>

            {/* Mission */}
            <section className='bg-muted/30 rounded-xl p-8 lg:p-12'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
                    <div className='space-y-6'>
                        <h2 className='text-2xl lg:text-3xl font-bold text-foreground'>Our Mission</h2>
                        <p className='text-lg text-muted-foreground leading-relaxed'>
                            To empower families with practical, experienced-based guidance for caring for their elderly
                            loved ones at home. We focus on everyday challenges like nutrition, hygiene, routines, and
                            emotional support that make a real difference in quality of life.
                        </p>
                        <p className='text-lg text-muted-foreground leading-relaxed'>
                            Our team understands that caring for seniors requires not just love, but practical knowledge
                            and reliable support. We're here to provide both.
                        </p>
                    </div>
                    <div className='space-y-4'>
                        <h3 className='text-xl font-semibold text-foreground'>What We Offer</h3>
                        <div className='grid grid-cols-1 gap-3'>
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className='flex items-center space-x-3'
                                >
                                    <CheckCircle className='h-5 w-5 text-primary flex-shrink-0' />
                                    <span className='text-base text-muted-foreground'>{service}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className='space-y-8'>
                <div className='text-center space-y-4'>
                    <h2 className='text-3xl lg:text-4xl font-bold text-foreground'>Our Values</h2>
                    <p className='text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto'>
                        These principles guide everything we do at Geriacare
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8'>
                    {values.map(value => {
                        const IconComponent = value.icon;

                        return (
                            <Card
                                key={value.title}
                                className='border-2 hover:border-primary/20 transition-colors'
                            >
                                <CardHeader>
                                    <div className='flex items-center space-x-4'>
                                        <div className='flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full'>
                                            <IconComponent className='h-6 w-6 text-primary' />
                                        </div>
                                        <CardTitle className='text-xl text-foreground'>{value.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className='text-base lg:text-lg text-muted-foreground leading-relaxed'>
                                        {value.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* Approach */}
            <section className='space-y-8'>
                <div className='text-center space-y-4'>
                    <h2 className='text-3xl lg:text-4xl font-bold text-foreground'>Our Approach</h2>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    <Card className='text-center'>
                        <CardHeader>
                            <CardTitle className='text-xl text-primary'>1. Listen</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className='text-base leading-relaxed'>
                                We carefully listen to your specific situation and challenges, understanding that every
                                family's needs are unique.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className='text-center'>
                        <CardHeader>
                            <CardTitle className='text-xl text-primary'>2. Guide</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className='text-base leading-relaxed'>
                                Our experienced team provides practical, actionable guidance based on years of
                                observation and real-world experience.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className='text-center'>
                        <CardHeader>
                            <CardTitle className='text-xl text-primary'>3. Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className='text-base leading-relaxed'>
                                We offer ongoing support through multiple channels, ensuring you never feel alone in
                                your caregiving journey.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </section>
            <section className="mt-16">
  <h2 className="text-3xl font-bold text-primary mb-8">
    Our Team
  </h2>

  <div className="space-y-6">
    {/* Team Member */}
    <div className="flex items-start gap-4 p-4 rounded-lg border">
      <img
        src="/team/naveen.jpg"
        alt="Naveen Nath Kallath Narayanan"
        className="h-14 w-14 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold">
          Naveen Nath Kallath Narayanan
        </h3>
        <p className="text-sm text-muted-foreground">
          Operations & Care Oversight
        </p>
        <p className="text-sm mt-1">
          Experienced in nursing homes in the UK, with an MBA in International Business from the United Kingdom.
        </p>
      </div>
    </div>

    <div className="flex items-start gap-4 p-4 rounded-lg border">
      <img
        src="/team/abinaya.jpg"
        alt="Abinaya Radhakrishnan"
        className="h-14 w-14 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold">
          Abinaya Radhakrishnan
        </h3>
        <p className="text-sm text-muted-foreground">
          Administration & Technology
        </p>
        <p className="text-sm mt-1">
          Information Technology professional with an Executive M.Tech in Artificial Intelligence and Machine Learning from IIT Jammu.
        </p>
      </div>
    </div>

    <div className="flex items-start gap-4 p-4 rounded-lg border">
      <img
        src="/team/shamili.jpg"
        alt="Shamili Unnikrishnan"
        className="h-14 w-14 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold">
          Shamili Unnikrishnan
        </h3>
        <p className="text-sm text-muted-foreground">
          Operations
        </p>
        <p className="text-sm mt-1">
          MBA in HR and Marketing.
        </p>
      </div>
    </div>

    <div className="flex items-start gap-4 p-4 rounded-lg border">
      <img
        src="/team/siya.jpg"
        alt="Siya Santosh Rayu Desai"
        className="h-14 w-14 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold">
          Siya Santosh Rayu Desai
        </h3>
        <p className="text-sm text-muted-foreground">
          Physiotherapy & Osteopathy (Advisory)
        </p>
        <p className="text-sm mt-1">
          Bachelor’s in Physiotherapy and MSc in Osteopathy.
          <br />
          <span className="italic text-xs text-muted-foreground">
            (Non-clinical, advisory role)
          </span>
        </p>
      </div>
    </div>

    <div className="flex items-start gap-4 p-4 rounded-lg border">
      <img
        src="/team/mamatha.jpg"
        alt="Mamatha Gurumoorthy"
        className="h-14 w-14 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold">
          Mamatha Gurumoorthy
        </h3>
        <p className="text-sm text-muted-foreground">
          HR & Hiring
        </p>
        <p className="text-sm mt-1">
          MBA in Good Governance.
        </p>
      </div>
    </div>
  </div>
</section>

        </div>
    );
};
