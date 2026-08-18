(function attachQuantumLeapProfile(root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.QuantumLeapProfile = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function createQuantumLeapProfile() {
    const ENERGY_TYPES = {
        Generator: {
            description: 'You tend to build momentum through steady, satisfying work. Sustainable rhythms help your energy stay reliable.'
        },
        'Manifesting Generator': {
            description: 'Your multi-passionate energy tends to move quickly across interests, learning by trying and adjusting. Variety and room to pivot keep your energy alive.'
        },
        Projector: {
            description: 'Your best work often comes in focused bursts, especially when your perspective is recognized or invited. Spacious recovery protects the clarity you bring.'
        },
        Manifestor: {
            description: 'You naturally initiate and prefer freedom to move independently. Closing loops and informing others can help your energy land cleanly.'
        },
        Reflector: {
            description: 'You are highly responsive to the people and environments around you. Supportive spaces and time to notice what is yours help you find clarity.'
        }
    };

    const ENERGY_QUESTIONS = [
        {
            question: 'When starting something new, you usually…',
            answers: [
                { text: 'Wait for something energizing, then build steadily', type: 'Generator' },
                { text: 'Follow the spark and move quickly between parts', type: 'Manifesting Generator' },
                { text: 'Look for recognition that your perspective is needed', type: 'Projector' },
                { text: 'Initiate independently and set things in motion', type: 'Manifestor' },
                { text: 'Sense the people and environment before moving', type: 'Reflector' }
            ]
        },
        {
            question: 'You know a decision is right when…',
            answers: [
                { text: 'Your gut gives a grounded, consistent yes', type: 'Generator' },
                { text: 'You feel a quick yes and want to test it immediately', type: 'Manifesting Generator' },
                { text: 'Your insight is recognized and you have space to focus', type: 'Projector' },
                { text: 'Your inner drive is clear enough to begin', type: 'Manifestor' },
                { text: 'Clarity holds across different moods and settings', type: 'Reflector' }
            ]
        },
        {
            question: 'Your energy naturally builds when…',
            answers: [
                { text: 'You can keep working at a satisfying rhythm', type: 'Generator' },
                { text: 'You have variety, momentum, and room to pivot', type: 'Manifesting Generator' },
                { text: 'You can concentrate deeply in a focused burst', type: 'Projector' },
                { text: 'You have freedom to initiate your own direction', type: 'Manifestor' },
                { text: 'The people and space around you feel supportive', type: 'Reflector' }
            ]
        },
        {
            question: 'After a full week, you recharge best by…',
            answers: [
                { text: 'Resting, then returning to a familiar rhythm', type: 'Generator' },
                { text: 'Switching interests, moving, or following fresh curiosity', type: 'Manifesting Generator' },
                { text: 'Taking real downtime with no demand to produce', type: 'Projector' },
                { text: 'Closing open loops, then unplugging completely', type: 'Manifestor' },
                { text: 'Changing scenery and decompressing from others', type: 'Reflector' }
            ]
        },
        {
            question: 'In collaboration, you are most comfortable when…',
            answers: [
                { text: 'There is clear work you can respond to and sustain', type: 'Generator' },
                { text: 'You can iterate quickly across several moving pieces', type: 'Manifesting Generator' },
                { text: 'Your guidance is invited and genuinely valued', type: 'Projector' },
                { text: 'You can set direction and keep others informed', type: 'Manifestor' },
                { text: 'You can read the group and adapt thoughtfully', type: 'Reflector' }
            ]
        }
    ];

    const SUN_SIGNS = [
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces'
    ];

    function calculateEnergyType(answerTypes) {
        const counts = {};

        (answerTypes || []).forEach(type => {
            if (Object.prototype.hasOwnProperty.call(ENERGY_TYPES, type)) {
                counts[type] = (counts[type] || 0) + 1;
            }
        });

        let result = null;
        let maxCount = 0;
        Object.keys(ENERGY_TYPES).forEach(type => {
            if ((counts[type] || 0) > maxCount) {
                result = type;
                maxCount = counts[type];
            }
        });

        return result;
    }

    function getEnergyDescription(type) {
        return ENERGY_TYPES[type]?.description || '';
    }

    function formatIdentityTag({ energyType, sunSign } = {}) {
        const parts = [];

        if (Object.prototype.hasOwnProperty.call(ENERGY_TYPES, energyType)) {
            parts.push(`${energyType} energy`);
        }

        if (SUN_SIGNS.includes(sunSign)) {
            parts.push(sunSign);
        }

        return parts.join(' · ');
    }

    return {
        ENERGY_QUESTIONS,
        ENERGY_TYPES,
        SUN_SIGNS,
        calculateEnergyType,
        formatIdentityTag,
        getEnergyDescription
    };
});
