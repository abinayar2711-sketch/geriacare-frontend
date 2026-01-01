import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    MapPin,
    Star,
    User,
    CheckCircle,
    Languages,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    Phone,
    Mail,
    Award
} from 'lucide-react';
import { caregiversService } from '@/services/caregivers';
import type { Caregiver } from '@/types/geriacare';

const ITEMS_PER_PAGE = 12;

interface CaregiverCardProps {
    caregiver: Caregiver;
    onContactClick: (caregiver: Caregiver) => void;
}

const CaregiverCard = ({ caregiver, onContactClick }: CaregiverCardProps) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
            {/* Profile Image Section */}
            <div className='relative aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-100'>
                {caregiver.photo ? (
                    <img
                        src={caregiver.photo}
                        alt={caregiver.name}
                        className='w-full h-full object-cover'
                    />
                ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                        <User className='h-16 w-16 text-gray-400' />
                    </div>
                )}

                {/* Verification Badge */}
                {caregiver.verified && (
                    <div className='absolute top-3 right-3'>
                        <div className='flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
                            <CheckCircle className='h-3 w-3' />
                            Verified
                        </div>
                    </div>
                )}

                {/* Availability Badge */}
                <div className='absolute top-3 left-3'>
                    <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        <div className='w-2 h-2 bg-green-500 rounded-full mr-1'></div>
                        Available
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className='p-6 space-y-4'>
                {/* Header */}
                <div className='space-y-2'>
                    <h3 className='text-xl font-bold text-gray-900'>{caregiver.name}</h3>
                    <div className='flex items-center gap-2 text-gray-600'>
                        <MapPin className='h-4 w-4' />
                        <span className='text-sm'>{caregiver.city}</span>
                    </div>
                </div>

                {/* Experience & Languages */}
                <div className='grid grid-cols-1 gap-3'>
                    <div className='flex items-center gap-2 text-sm text-gray-700'>
                        <div className='p-1 bg-orange-100 rounded-lg'>
                            <Star className='h-4 w-4 text-orange-600' />
                        </div>
                        <span className='font-medium'>{caregiver.experience} years experience</span>
                    </div>

                    <div className='flex items-start gap-2 text-sm text-gray-700'>
                        <div className='p-1 bg-purple-100 rounded-lg mt-0.5'>
                            <Languages className='h-4 w-4 text-purple-600' />
                        </div>
                        <div className='flex flex-wrap gap-1'>
                            {caregiver.languages.slice(0, 3).map((language, index) => (
                                <span
                                    key={language}
                                    className='text-gray-600'
                                >
                                    {language}
                                    {index < Math.min(caregiver.languages.length, 3) - 1 && ', '}
                                </span>
                            ))}
                            {caregiver.languages.length > 3 && (
                                <span className='text-gray-500'>+{caregiver.languages.length - 3} more</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                        <Award className='h-4 w-4 text-blue-600' />
                        <span>Key Skills</span>
                    </div>
                    <div className='flex flex-wrap gap-1'>
                        {caregiver.skills.slice(0, 3).map(skill => (
                            <span
                                key={skill}
                                className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200'
                            >
                                {skill}
                            </span>
                        ))}
                        {caregiver.skills.length > 3 && (
                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-50 text-gray-600'>
                                +{caregiver.skills.length - 3} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Contact Button */}
                <button
                    onClick={() => onContactClick(caregiver)}
                    className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg'
                >
                    <Phone className='h-4 w-4' />
                    Contact Now
                </button>
            </div>
        </div>
    );
};

interface ContactModalProps {
    caregiver: Caregiver | null;
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal = ({ caregiver, isOpen, onClose }: ContactModalProps) => {
    if (!isOpen || !caregiver) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
                <div className='p-6 border-b border-gray-200'>
                    <h2 className='text-xl font-bold text-gray-900'>Contact {caregiver.name}</h2>
                    <p className='text-gray-600 mt-1'>Get in touch with this caregiver</p>
                </div>

                <div className='p-6 space-y-6'>
                    {/* Caregiver Info */}
                    <div className='flex items-start gap-4'>
                        <div className='w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center'>
                            {caregiver.photo ? (
                                <img
                                    src={caregiver.photo}
                                    alt={caregiver.name}
                                    className='w-full h-full object-cover rounded-xl'
                                />
                            ) : (
                                <User className='h-8 w-8 text-gray-400' />
                            )}
                        </div>
                        <div className='flex-1'>
                            <h3 className='font-semibold text-gray-900'>{caregiver.name}</h3>
                            <p className='text-gray-600 text-sm'>{caregiver.city}</p>
                            <p className='text-gray-600 text-sm'>{caregiver.experience} years experience</p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className='space-y-3'>
                        <h4 className='font-medium text-gray-900'>Contact Information</h4>
                        <div className='bg-gray-50 rounded-lg p-4'>
                            <div className='flex items-start gap-3'>
                                <Mail className='h-5 w-5 text-gray-500 mt-0.5' />
                                <div>
                                    <p className='text-sm font-medium text-gray-900 mb-1'>Contact Details</p>
                                    <p className='text-sm text-gray-700 whitespace-pre-line'>{caregiver.contactInfo}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skills & Languages */}
                    <div className='space-y-4'>
                        <div>
                            <h4 className='font-medium text-gray-900 mb-2'>Languages</h4>
                            <div className='flex flex-wrap gap-2'>
                                {caregiver.languages.map(language => (
                                    <span
                                        key={language}
                                        className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800'
                                    >
                                        {language}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className='font-medium text-gray-900 mb-2'>Skills</h4>
                            <div className='flex flex-wrap gap-2'>
                                {caregiver.skills.map(skill => (
                                    <span
                                        key={skill}
                                        className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800'
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='p-6 border-t border-gray-200'>
                    <button
                        onClick={onClose}
                        className='w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors'
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const CaregiversPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [cityFilter, setCityFilter] = useState('');
    const [experienceFilter, setExperienceFilter] = useState<number | undefined>();
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
    const [contactModalOpen, setContactModalOpen] = useState(false);

    const {
        data: caregiversData,
        isLoading,
        error
    } = useQuery({
        queryKey: ['caregivers', currentPage, cityFilter, experienceFilter],
        queryFn: () => caregiversService.getAllCaregivers(currentPage, ITEMS_PER_PAGE, cityFilter, experienceFilter)
    });

    const { data: cities } = useQuery({
        queryKey: ['caregiver-cities'],
        queryFn: caregiversService.getCaregiverCities
    });

    const handleContactClick = (caregiver: Caregiver) => {
        setSelectedCaregiver(caregiver);
        setContactModalOpen(true);
    };

    const closeContactModal = () => {
        setContactModalOpen(false);
        setSelectedCaregiver(null);
    };

    const clearFilters = () => {
        setCityFilter('');
        setExperienceFilter(undefined);
        setCurrentPage(1);
    };

    if (isLoading) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <div className='container mx-auto px-4 py-8'>
                    <div className='flex items-center justify-center min-h-[400px]'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <div className='container mx-auto px-4 py-8'>
                    <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
                        <p className='text-red-600'>Failed to load caregivers data</p>
                    </div>
                </div>
            </div>
        );
    }

    const caregivers = caregiversData?.results || [];
    const totalPages = caregiversData?.totalPages || 1;

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='container mx-auto px-4 py-8 space-y-8'>
                {/* Header */}
                <div className='text-center space-y-4'>
                    <h1 className='text-3xl md:text-4xl font-bold text-gray-900'>Find Trusted Caregivers</h1>
                    <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                        Connect with verified and experienced caregivers (aaya) in your city. All profiles are carefully
                        verified to ensure quality care for your loved ones.
                    </p>
                </div>

                {/* Filters */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                    <div className='flex flex-col lg:flex-row gap-4 items-center'>
                        <div className='flex-1 relative'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search by city...'
                                value={cityFilter}
                                onChange={e => {
                                    setCityFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>

                        <div className='flex gap-4 items-center'>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className='flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors'
                            >
                                <Filter className='h-4 w-4' />
                                Filters
                            </button>

                            {(cityFilter || experienceFilter) && (
                                <button
                                    onClick={clearFilters}
                                    className='px-4 py-3 text-red-600 hover:text-red-700 font-medium'
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {showFilters && (
                        <div className='mt-6 pt-6 border-t border-gray-200'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>City</label>
                                    <select
                                        value={cityFilter}
                                        onChange={e => {
                                            setCityFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    >
                                        <option value=''>All Cities</option>
                                        {cities?.map(city => (
                                            <option
                                                key={city}
                                                value={city}
                                            >
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Minimum Experience (years)
                                    </label>
                                    <select
                                        value={experienceFilter || ''}
                                        onChange={e => {
                                            setExperienceFilter(e.target.value ? parseInt(e.target.value) : undefined);
                                            setCurrentPage(1);
                                        }}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    >
                                        <option value=''>Any Experience</option>
                                        <option value='1'>1+ years</option>
                                        <option value='3'>3+ years</option>
                                        <option value='5'>5+ years</option>
                                        <option value='10'>10+ years</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                {caregiversData && (
                    <div className='text-center text-gray-600'>
                        Showing {caregivers.length} of {caregiversData.totalResults} caregivers
                        {cityFilter && ` in ${cityFilter}`}
                        {experienceFilter && ` with ${experienceFilter}+ years experience`}
                    </div>
                )}

                {/* Caregivers Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {caregivers.length === 0 ? (
                        <div className='col-span-full text-center py-16'>
                            <User className='h-16 w-16 text-gray-300 mx-auto mb-4' />
                            <h3 className='text-lg font-medium text-gray-900 mb-2'>No caregivers found</h3>
                            <p className='text-gray-600'>Try adjusting your search criteria or clearing the filters.</p>
                        </div>
                    ) : (
                        caregivers.map((caregiver: Caregiver) => (
                            <CaregiverCard
                                key={caregiver.id}
                                caregiver={caregiver}
                                onContactClick={handleContactClick}
                            />
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className='flex items-center justify-center gap-4 pt-8'>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
                        >
                            <ChevronLeft className='h-4 w-4' />
                            Previous
                        </button>

                        <div className='flex items-center gap-1'>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                const page = i + Math.max(1, currentPage - 2);
                                if (page > totalPages) return null;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            currentPage === page
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
                        >
                            Next
                            <ChevronRight className='h-4 w-4' />
                        </button>
                    </div>
                )}

                {/* Page Info */}
                {totalPages > 1 && (
                    <div className='text-center text-sm text-gray-600'>
                        Page {currentPage} of {totalPages}
                    </div>
                )}
            </div>

            {/* Contact Modal */}
            <ContactModal
                caregiver={selectedCaregiver}
                isOpen={contactModalOpen}
                onClose={closeContactModal}
            />
        </div>
    );
};

export default CaregiversPage;
