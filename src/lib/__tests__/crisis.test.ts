import { detectCrisis, HELPLINES } from '@/lib/crisis';

describe('Crisis Detection', () => {
  describe('Elder abuse indicators', () => {
    it('detects direct violence patterns', () => {
      expect(detectCrisis('hitting my mother')).toBe(true);
      expect(detectCrisis('He is hurting the elderly woman')).toBe(true);
      expect(detectCrisis('Been abusing my grandfather')).toBe(true);
      expect(detectCrisis('started beating him')).toBe(true);
      expect(detectCrisis('slapping and pushing them')).toBe(true);
    });

    it('detects elder abuse terminology', () => {
      expect(detectCrisis('elder abuse situation')).toBe(true);
      expect(detectCrisis('senior abuse is happening')).toBe(true);
      expect(detectCrisis('old age abuse concerns')).toBe(true);
    });

    it('is case insensitive', () => {
      expect(detectCrisis('HITTING MY MOTHER')).toBe(true);
      expect(detectCrisis('HiTtInG mY fAtHeR')).toBe(true);
    });

    it('handles variations in possessives', () => {
      expect(detectCrisis('hurting my grandmother')).toBe(true);
      expect(detectCrisis('hitting the elderly person')).toBe(true);
      expect(detectCrisis('pushing her down')).toBe(true);
      expect(detectCrisis('beating him regularly')).toBe(true);
    });
  });

  describe('Neglect patterns', () => {
    it('detects neglect terminology', () => {
      expect(detectCrisis('we are neglecting her needs')).toBe(true);
      expect(detectCrisis('feeling abandoned by family')).toBe(true);
      expect(detectCrisis('left alone all day')).toBe(true);
      expect(detectCrisis('left to die without help')).toBe(true);
    });

    it('detects bedsores and pressure sores', () => {
      expect(detectCrisis('bedsores are forming')).toBe(true);
      expect(detectCrisis('pressure sores developing')).toBe(true);
      expect(detectCrisis('has bedsore on back')).toBe(true);
      expect(detectCrisis('multiple pressure sores')).toBe(true);
    });

    it('detects feeding and medication neglect', () => {
      expect(detectCrisis('not eating for days')).toBe(true);
      expect(detectCrisis('we are not feeding him')).toBe(true);
      expect(detectCrisis('not giving water')).toBe(true);
      expect(detectCrisis('not giving medicine')).toBe(true);
    });

    it('detects untreated injuries', () => {
      expect(detectCrisis('untreated wound on leg')).toBe(true);
      expect(detectCrisis('has untreated infection')).toBe(true);
      expect(detectCrisis('untreated pain all day')).toBe(true);
      expect(detectCrisis('untreated injury from fall')).toBe(true);
    });

    it('detects coping struggles', () => {
      expect(detectCrisis("can't go on like this")).toBe(true);
      expect(detectCrisis("can't take it anymore")).toBe(true);
      expect(detectCrisis("can't cope with situation")).toBe(true);
    });
  });

  describe('Self-harm indicators', () => {
    it('detects suicide ideation', () => {
      expect(detectCrisis('want to kill myself')).toBe(true);
      expect(detectCrisis('hurt myself')).toBe(true);
      expect(detectCrisis('considering suicide')).toBe(true);
      expect(detectCrisis('suicidal thoughts')).toBe(true);
    });

    it('detects death wishes', () => {
      expect(detectCrisis('want to die')).toBe(true);
      expect(detectCrisis('no reason to live')).toBe(true);
      expect(detectCrisis('no point in living')).toBe(true);
      expect(detectCrisis('end my life')).toBe(true);
      expect(detectCrisis('end it')).toBe(true);
    });

    it('detects self-harm language', () => {
      expect(detectCrisis('self harm thoughts')).toBe(true);
      expect(detectCrisis('self-harm behavior')).toBe(true);
    });
  });

  describe('Edge cases and safe patterns', () => {
    it('does not flag normal care discussions', () => {
      expect(detectCrisis('We help her with feeding daily')).toBe(false);
      expect(detectCrisis('Taking medicines regularly')).toBe(false);
      expect(detectCrisis('Doctor treating the infection')).toBe(false);
    });

    it('does not flag preventive care language', () => {
      expect(detectCrisis('wound care protocol')).toBe(false);
      expect(detectCrisis('pain management techniques')).toBe(false);
    });

    it('does not flag inquiries about normal aging', () => {
      expect(detectCrisis('Is it normal for seniors to lose appetite?')).toBe(false);
      expect(detectCrisis('My mother is 85 and has mobility issues')).toBe(false);
      expect(detectCrisis('Grandpa forgets things sometimes')).toBe(false);
    });

    it('handles empty and null strings', () => {
      expect(detectCrisis('')).toBe(false);
      expect(detectCrisis('   ')).toBe(false);
    });

    it('detects patterns despite punctuation and special characters', () => {
      expect(detectCrisis('hitting my mother!!!')).toBe(true);
      expect(detectCrisis('beating her...repeatedly')).toBe(true);
      expect(detectCrisis('slapping him very often')).toBe(true);
    });
  });

  describe('Helplines', () => {
    it('exports helplines for crisis response', () => {
      expect(HELPLINES).toBeDefined();
      expect(HELPLINES.length).toBeGreaterThan(0);
    });

    it('includes India-specific helplines', () => {
      const indiaHelplines = HELPLINES.filter(h => h.region === 'India');
      expect(indiaHelplines.length).toBeGreaterThan(0);
    });

    it('includes international helpline resources', () => {
      const intlHelplines = HELPLINES.filter(h => h.region === 'International');
      expect(intlHelplines.length).toBeGreaterThan(0);
    });

    it('helplines have required fields', () => {
      HELPLINES.forEach(helpline => {
        expect(helpline.region).toBeDefined();
        expect(helpline.name).toBeDefined();
        expect(helpline.contact).toBeDefined();
        expect(helpline.hours).toBeDefined();
      });
    });
  });

  describe('Integration scenarios', () => {
    it('catches complex multi-part crisis sentences', () => {
      const complexText = `
        My father hasn't been eating properly and we aren't giving him his medicines.
        He has developed bedsores and we just leave him alone all day.
      `;
      expect(detectCrisis(complexText)).toBe(true);
    });

    it('catches crisis in typical question format', () => {
      const question = `
        My 78-year-old mother with dementia has been showing signs of self-harm.
        She keeps trying to harm herself and we don't know what to do.
      `;
      expect(detectCrisis(question)).toBe(true);
    });

    it('does not flag legitimate concerns as crisis', () => {
      const legitimate = `
        My mother is 82 and has diabetes. She's been feeling sad lately and 
        has lost interest in activities she enjoys. Is this normal? What can we do?
      `;
      expect(detectCrisis(legitimate)).toBe(false);
    });
  });
});
