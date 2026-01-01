import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Plus,
    Edit,
    Trash2,
    MapPin,
    Star,
    User,
    CheckCircle,
    Languages,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { adminService } from '@/services/admin';
import type { Caregiver, CreateCaregiverInput, UpdateCaregiverInput } from '@/types/geriacare';

const ITEMS_PER_PAGE = 8;

interface CaregiverModalProps {
    caregiver?: Caregiver;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateCaregiverInput | UpdateCaregiverInput) => void;
}

const CaregiverModal = ({ caregiver, isOpen, onClose, onSave }: CaregiverModalProps) => {
    const [formData, setFormData] = useState<CreateCaregiverInput>({
        name: caregiver?.name || '',
        photo: caregiver?.photo || '',
        experience: caregiver?.experience || 0,
        city: caregiver?.city || '',
        languages: caregiver?.languages || [],
        skills: caregiver?.skills || [],
        availability: caregiver?.availability || 'available',
        contactInfo: caregiver?.contactInfo || '',
        verified: caregiver?.verified || false
    });

    const [languageInput, setLanguageInput] = useState('');
    const [skillInput, setSkillInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const addLanguage = () => {
        if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
            setFormData(prev => ({
                ...prev,
                languages: [...prev.languages, languageInput.trim()]
            }));
            setLanguageInput('');
        }
    };

    const removeLanguage = (language: string) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.filter(l => l !== language)
        }));
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                <div className='p-6 border-b border-gray-200'>
                    <h2 className='text-xl font-semibold'>{caregiver ? 'Edit Caregiver' : 'Add New Caregiver'}</h2>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className='p-6 space-y-4'
                >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Name *</label>
                            <input
                                type='text'
                                required
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Experience (years) *</label>
                            <input
                                type='number'
                                min='0'
                                required
                                value={formData.experience}
                                onChange={e =>
                                    setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))
                                }
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>City *</label>
                            <input
                                type='text'
                                required
                                value={formData.city}
                                onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Availability *</label>
                            <select
                                value={formData.availability}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        availability: e.target.value as 'available' | 'busy' | 'unavailable'
                                    }))
                                }
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            >
                                <option value='available'>Available</option>
                                <option value='busy'>Busy</option>
                                <option value='unavailable'>Unavailable</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Photo URL</label>
                        <input
                            type='url'
                            value={formData.photo}
                            onChange={e => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='https://example.com/photo.jpg'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Contact Information *</label>
                        <textarea
                            required
                            value={formData.contactInfo}
                            onChange={e => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                            rows={3}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='Contact details or instructions'
                        />
                    </div>

                    {/* Languages */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Languages</label>
                        <div className='flex gap-2 mb-2'>
                            <input
                                type='text'
                                value={languageInput}
                                onChange={e => setLanguageInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                placeholder='Add language'
                            />
                            <button
                                type='button'
                                onClick={addLanguage}
                                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                            >
                                Add
                            </button>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {formData.languages.map(language => (
                                <span
                                    key={language}
                                    className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'
                                >
                                    {language}
                                    <button
                                        type='button'
                                        onClick={() => removeLanguage(language)}
                                        className='text-blue-600 hover:text-blue-800'
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Skills</label>
                        <div className='flex gap-2 mb-2'>
                            <input
                                type='text'
                                value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                placeholder='Add skill'
                            />
                            <button
                                type='button'
                                onClick={addSkill}
                                className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                            >
                                Add
                            </button>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {formData.skills.map(skill => (
                                <span
                                    key={skill}
                                    className='inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm'
                                >
                                    {skill}
                                    <button
                                        type='button'
                                        onClick={() => removeSkill(skill)}
                                        className='text-green-600 hover:text-green-800'
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input
                            type='checkbox'
                            id='verified'
                            checked={formData.verified}
                            onChange={e => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                            className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                        />
                        <label
                            htmlFor='verified'
                            className='text-sm font-medium text-gray-700'
                        >
                            Verified Caregiver
                        </label>
                    </div>

                    <div className='flex justify-end gap-3 pt-4'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                        >
                            {caregiver ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManageCaregiversPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCaregiver, setEditingCaregiver] = useState<Caregiver | undefined>();
    const queryClient = useQueryClient();

    const {
        data: caregiversData,
        isLoading,
        error
    } = useQuery({
        queryKey: ['admin-caregivers', currentPage],
        queryFn: () => adminService.getCaregivers(currentPage, ITEMS_PER_PAGE)
    });

    const createCaregiverMutation = useMutation({
        mutationFn: adminService.createCaregiver,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-caregivers'] });
        }
    });

    const updateCaregiverMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCaregiverInput }) =>
            adminService.updateCaregiver(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-caregivers'] });
        }
    });

    const deleteCaregiverMutation = useMutation({
        mutationFn: adminService.deleteCaregiver,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-caregivers'] });
        }
    });

    const handleSave = (data: CreateCaregiverInput | UpdateCaregiverInput) => {
        if (editingCaregiver) {
            updateCaregiverMutation.mutate({
                id: editingCaregiver.id,
                data: data as UpdateCaregiverInput
            });
        } else {
            createCaregiverMutation.mutate(data as CreateCaregiverInput);
        }
    };

    const handleEdit = (caregiver: Caregiver) => {
        setEditingCaregiver(caregiver);
        setModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this caregiver?')) {
            deleteCaregiverMutation.mutate(id);
        }
    };

    const handleAddNew = () => {
        setEditingCaregiver(undefined);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCaregiver(undefined);
    };

    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'busy':
                return 'bg-yellow-100 text-yellow-800';
            case 'unavailable':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-[400px]'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
                <p className='text-red-600'>Failed to load caregivers data</p>
            </div>
        );
    }

    const caregivers = caregiversData?.results || [];
    const totalPages = caregiversData?.totalPages || 1;

    return (
        <div className='space-y-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <h1 className='text-2xl font-bold text-gray-900'>Manage Caregivers</h1>

                <button
                    onClick={handleAddNew}
                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                    <Plus className='h-4 w-4' />
                    Add Caregiver
                </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {caregivers.length === 0 ? (
                    <div className='col-span-full text-center py-12 text-gray-500'>No caregivers found</div>
                ) : (
                    caregivers.map((caregiver: Caregiver) => (
                        <div
                            key={caregiver.id}
                            className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
                        >
                            <div className='aspect-square bg-gray-100 relative'>
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

                                {caregiver.verified && (
                                    <div className='absolute top-3 right-3'>
                                        <CheckCircle className='h-6 w-6 text-green-600 bg-white rounded-full' />
                                    </div>
                                )}
                            </div>

                            <div className='p-4 space-y-3'>
                                <div className='flex items-start justify-between'>
                                    <h3 className='font-semibold text-gray-900'>{caregiver.name}</h3>
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(caregiver.availability)}`}
                                    >
                                        {caregiver.availability}
                                    </span>
                                </div>

                                <div className='space-y-2'>
                                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                                        <MapPin className='h-4 w-4' />
                                        {caregiver.city}
                                    </div>

                                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                                        <Star className='h-4 w-4' />
                                        {caregiver.experience} years experience
                                    </div>

                                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                                        <Languages className='h-4 w-4' />
                                        {caregiver.languages.join(', ')}
                                    </div>
                                </div>

                                <div className='flex flex-wrap gap-1'>
                                    {caregiver.skills.slice(0, 2).map(skill => (
                                        <span
                                            key={skill}
                                            className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800'
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {caregiver.skills.length > 2 && (
                                        <span className='text-xs text-gray-500'>
                                            +{caregiver.skills.length - 2} more
                                        </span>
                                    )}
                                </div>

                                <div className='flex justify-between pt-2'>
                                    <button
                                        onClick={() => handleEdit(caregiver)}
                                        className='flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm'
                                    >
                                        <Edit className='h-4 w-4' />
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(caregiver.id)}
                                        disabled={deleteCaregiverMutation.isPending}
                                        className='flex items-center gap-1 text-red-600 hover:text-red-800 text-sm disabled:opacity-50'
                                    >
                                        <Trash2 className='h-4 w-4' />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className='flex items-center justify-between'>
                    <div className='text-sm text-gray-700'>
                        Showing page {currentPage} of {totalPages}
                        {caregiversData?.totalResults && ` (${caregiversData.totalResults} total)`}
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className='flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <ChevronLeft className='h-4 w-4' />
                            Previous
                        </button>

                        <div className='flex items-center gap-1'>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                        currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className='flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Next
                            <ChevronRight className='h-4 w-4' />
                        </button>
                    </div>
                </div>
            )}

            <CaregiverModal
                caregiver={editingCaregiver}
                isOpen={modalOpen}
                onClose={closeModal}
                onSave={handleSave}
            />
        </div>
    );
};

export default ManageCaregiversPage;
