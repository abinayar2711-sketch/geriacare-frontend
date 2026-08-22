import { slugify, statusForNewPost, nameFrom } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('slugify', () => {
    it('converts title to lowercase slug', () => {
      expect(slugify('Hello World')).toMatch(/^hello-world-/);
    });

    it('removes special characters and punctuation', () => {
      expect(slugify("What's the Best Care?"  )).toMatch(/^whats-the-best-care-/);
      expect(slugify('How to: Help Your Elder')).toMatch(/^how-to-help-your-elder-/);
    });

    it('replaces spaces with hyphens', () => {
      expect(slugify('My Care Question')).toMatch(/^my-care-question-/);
      expect(slugify('Elder Care Tips')).toMatch(/^elder-care-tips-/);
    });

    it('adds random suffix for uniqueness', () => {
      const slug1 = slugify('Dementia Care');
      const slug2 = slugify('Dementia Care');
      expect(slug1).not.toEqual(slug2);
      
      // Both should start with the same prefix
      const prefix1 = slug1.substring(0, slug1.lastIndexOf('-'));
      const prefix2 = slug2.substring(0, slug2.lastIndexOf('-'));
      expect(prefix1).toEqual(prefix2);
    });

    it('truncates long titles', () => {
      const longTitle = 'A'.repeat(100);
      const slug = slugify(longTitle);
      // Should be at most 70 chars + "-" + 5 char random suffix
      expect(slug.length).toBeLessThanOrEqual(77);
    });

    it('handles already hyphenated titles', () => {
      const slug = slugify('pain-management-tips');
      expect(slug).toMatch(/^pain-management-tips-/);
    });

    it('handles titles with only special characters', () => {
      const slug = slugify('!@#$%^&*()');
      // Should just have the random suffix
      expect(slug).toMatch(/^-[a-z0-9]{5}$/);
    });
  });

  describe('nameFrom', () => {
    it('extracts name from FormData', () => {
      const formData = new FormData();
      formData.append('authorName', 'John Doe');
      expect(nameFrom(formData)).toBe('John Doe');
    });

    it('returns null when authorName is empty', () => {
      const formData = new FormData();
      formData.append('authorName', '');
      expect(nameFrom(formData)).toBeNull();
    });

    it('returns null when authorName is only whitespace', () => {
      const formData = new FormData();
      formData.append('authorName', '   ');
      expect(nameFrom(formData)).toBeNull();
    });

    it('trims whitespace from name', () => {
      const formData = new FormData();
      formData.append('authorName', '  Jane Smith  ');
      expect(nameFrom(formData)).toBe('Jane Smith');
    });

    it('truncates names longer than 60 characters', () => {
      const formData = new FormData();
      const longName = 'A'.repeat(100);
      formData.append('authorName', longName);
      const result = nameFrom(formData);
      expect(result).toHaveLength(60);
    });

    it('returns null when field does not exist', () => {
      const formData = new FormData();
      expect(nameFrom(formData)).toBeNull();
    });

    it('handles names with special characters', () => {
      const formData = new FormData();
      formData.append('authorName', 'José García-López');
      expect(nameFrom(formData)).toBe('José García-López');
    });
  });

  describe('statusForNewPost', () => {
    it('marks posts with crisis language as needs_review', () => {
      const crisisPost = 'My mother has been hitting her and hurting her';
      expect(statusForNewPost(crisisPost)).toBe('needs_review');
    });

    it('marks normal posts as live', () => {
      const normalPost = 'My father has been having difficulty sleeping lately. What can help?';
      expect(statusForNewPost(normalPost)).toBe('live');
    });

    it('marks posts with neglect indicators as needs_review', () => {
      const neglectPost = 'We are not feeding him properly and he has bedsores';
      expect(statusForNewPost(neglectPost)).toBe('needs_review');
    });

    it('marks posts with suicide language as needs_review', () => {
      const suicidePost = 'My elder wants to end it all, we are very worried';
      expect(statusForNewPost(suicidePost)).toBe('needs_review');
    });

    it('marks posts with abuse language as needs_review', () => {
      const abusePost = 'My family member has been hurting my mother';
      expect(statusForNewPost(abusePost)).toBe('needs_review');
    });

    it('marks empty posts as live', () => {
      expect(statusForNewPost('')).toBe('live');
    });

    it('is case insensitive', () => {
      const upperPost = 'MY MOTHER HAS BEEN HITTING HER';
      expect(statusForNewPost(upperPost)).toBe('needs_review');
    });
  });
});
